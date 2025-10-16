import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import SalaryStructure from "@/models/SalaryStructure";
import Payslip from "@/models/Payslip";
import AuditEvent from "@/models/AuditEvent";
import Notification from "@/models/Notification";

export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const userRole = decodedToken.role;
  if (userRole !== "admin" && userRole !== "hr") {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    const { payPeriodStartDate, payPeriodEndDate } = await req.json();

    if (!payPeriodStartDate || !payPeriodEndDate) {
      return NextResponse.json(
        { message: "Pay period start and end dates are required." },
        { status: 400 }
      );
    }

    const salaryStructures = await SalaryStructure.find({}).populate("employeeId");

    if (!salaryStructures || salaryStructures.length === 0) {
      return NextResponse.json(
        { message: "No employees with active salary structures found." },
        { status: 404 }
      );
    }

    let processedCount = 0;
    for (const structure of salaryStructures) {
      const { employeeId: user, baseSalary } = structure;

      if (!user) continue;

      const grossEarnings = baseSalary / 12;
      const deductions = grossEarnings * 0.15;
      const netPay = grossEarnings - deductions;

      const breakdown = {
        baseSalary: baseSalary,
        payFrequency: "Monthly",
        monthlySalary: grossEarnings,
        taxAndProvidentFund: deductions,
      };

      const newPayslip = new Payslip({
        user: user._id,
        payPeriodStartDate,
        payPeriodEndDate,
        grossEarnings,
        deductions,
        netPay,
        breakdown,
      });

      await newPayslip.save();

      // Create a notification for the employee
      await Notification.create({
        recipientId: user._id,
        message: `Your payslip for the period ${payPeriodStartDate} to ${payPeriodEndDate} is available.`,
        link: "/dashboard/payslips",
      });

      processedCount++;
    }

    const auditEvent = new AuditEvent({
      actorId: decodedToken.sub,
      actionType: "PAYROLL_RUN",
      details: {
        payPeriodStartDate,
        payPeriodEndDate,
        processedEmployees: processedCount,
      },
    });
    await auditEvent.save();

    return NextResponse.json({
      message: `Payroll run completed successfully for ${processedCount} employees.`,
    });
  } catch (error) {
    console.error("Payroll Run Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
