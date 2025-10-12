import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Goal from "@/models/Goal";
import User from "@/models/User";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectDB();

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const body = await req.json();
    const {
      title,
      description,
      deadline,
    } = body;

    const employee = await User.findById(decoded.sub);
    if (!employee) {
        return NextResponse.json({ message: "Employee not found" }, { status: 404 });
    }

    if (!employee.manager) {
      return NextResponse.json({ message: "You must have a manager assigned to create a goal." }, { status: 400 });
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

    await newGoal.save();
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error) {
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

    if (decoded.sub !== employeeId) {
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