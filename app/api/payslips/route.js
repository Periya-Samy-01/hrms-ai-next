import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { connectDB } from "@/lib/dbConnect";
import Payslip from "@/models/Payslip";
import User from "@/models/User"; // Ensure User model is imported for ref integrity

const getUserIdFromToken = async (request) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // The 'sub' (subject) claim is typically used for the user ID
    const { payload } = await jwtVerify(token, secret);
    return payload.sub;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export async function GET(request) {
  const userId = await getUserIdFromToken(request);

  if (!userId) {
    return NextResponse.json(
      { message: "Unauthorized: Invalid or missing token." },
      { status: 401 }
    );
  }

  try {
    await connectDB();

    const payslips = await Payslip.find({ employeeId: userId }).sort({ payPeriodEndDate: -1 });

    if (!payslips) {
      return NextResponse.json([], { status: 200 }); // Return empty array if no payslips found
    }

    return NextResponse.json(payslips, { status: 200 });
  } catch (error) {
    console.error("Error fetching payslips:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
