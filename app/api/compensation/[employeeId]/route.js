import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/dbConnect";
import SalaryStructure from "@/models/SalaryStructure";
import User from "@/models/User"; // Ensure User model is imported for ref integrity

const getRoleFromToken = async (request) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return payload.role;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export async function POST(request, { params }) {
  const userRole = await getRoleFromToken(request);

  if (userRole !== "admin" && userRole !== "hr") {
    return NextResponse.json(
      { message: "Forbidden: Access is restricted to Admin or HR roles." },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const { employeeId } = params;
    const body = await request.json();
    const { baseSalary, payFrequency, effectiveDate } = body;

    if (!baseSalary || !payFrequency) {
      return NextResponse.json(
        { message: "baseSalary and payFrequency are required" },
        { status: 400 }
      );
    }

    const salaryData = {
      employeeId,
      baseSalary,
      payFrequency,
      ...(effectiveDate && { effectiveDate }), // Only add effectiveDate if provided
    };

    const updatedSalaryStructure = await SalaryStructure.findOneAndUpdate(
      { employeeId },
      salaryData,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updatedSalaryStructure, { status: 200 });
  } catch (error) {
    console.error("Error creating or updating salary structure:", error);
    if (error.name === 'ValidationError') {
        return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const userRole = await getRoleFromToken(request);

  if (userRole !== "admin" && userRole !== "hr") {
    return NextResponse.json(
      { message: "Forbidden: Access is restricted to Admin or HR roles." },
      { status: 403 }
    );
  }

  try {
    await connectDB();
    const { employeeId } = params;

    const salaryStructure = await SalaryStructure.findOne({ employeeId }).populate('employeeId', 'name email');

    if (!salaryStructure) {
      return NextResponse.json(
        { message: "Salary structure not found for this employee." },
        { status: 404 }
      );
    }

    return NextResponse.json(salaryStructure, { status: 200 });
  } catch (error) {
    console.error("Error fetching salary structure:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
