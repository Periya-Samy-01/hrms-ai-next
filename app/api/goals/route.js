import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Goal from "@/models/Goal";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
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
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await dbConnect();
  const token = await getToken({ req });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const employeeId = searchParams.get("employeeId");

  if (!employeeId) {
    return NextResponse.json(
      { message: "employeeId is required" },
      { status: 400 }
    );
  }

  try {
    const goals = await Goal.find({ employeeId });
    return NextResponse.json(goals, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}