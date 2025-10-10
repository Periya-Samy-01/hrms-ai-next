import { NextResponse } from "next/server";
import { connectDB } from "@/lib/dbConnect";
import Goal from "@/models/Goal";
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
      employeeId,
      managerId,
      status,
      progress,
      deadline,
    } = body;

    // Security check: ensure the employeeId in the body matches the logged-in user
    if (decoded.id !== employeeId) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const newGoal = new Goal({
      title,
      description,
      employeeId,
      managerId,
      status,
      progress,
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
    jwt.verify(token, process.env.JWT_SECRET);
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { message: "employeeId is required" },
        { status: 400 }
      );
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