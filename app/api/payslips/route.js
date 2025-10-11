import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Use consistent token verification
import { connectDB } from "@/lib/dbConnect";
import Payslip from "@/models/Payslip";
import User from "@/models/User"; // Ensure User model is imported for ref integrity

const getUserIdFromToken = (request) => {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    return null;
  }
  try {
    // Use the same verification function as other parts of the app
    const decoded = verifyToken(token);
    // The 'sub' (subject) claim is used for the user ID
    return decoded ? decoded.sub : null;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
};

export async function GET(request) {
  const userId = getUserIdFromToken(request);

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
