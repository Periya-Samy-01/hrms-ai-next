import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Goal from "@/models/Goal";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  console.log("➡️ POST /api/goals route hit");
  try {
    await connectDB();
    console.log("✅ Database connection successful");

    const token = req.cookies.get("token")?.value;
    console.log("🍪 Token from cookies:", token);

    if (!token) {
      console.log("❌ No token found");
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔑 Decoded token:", decoded);

    const body = await req.json();
    console.log("📦 Request body:", body);

    const {
      title,
      description,
      deadline,
    } = body;

    const employee = await User.findById(decoded.id);
    if (!employee) {
        return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    const newGoal = new Goal({
      title,
      description,
      employeeId: employee._id,
      managerId: employee.manager,
      status: "Pending Approval",
      progress: 0,
      deadline,
    });
    console.log("📝 Creating new goal:", newGoal);

    await newGoal.save();
    console.log("✅ Goal saved successfully");
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
    console.error("💥 Error in POST /api/goals:", error);
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { message: "employeeId is required" },
        { status: 400 }
      );
    }

    // Security check: ensure the employeeId in the query matches the logged-in user
    if (decoded.id !== employeeId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const goals = await Goal.find({ employeeId });
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}