import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import SalaryStructure from "@/models/SalaryStructure";
import User from "@/models/User";

// GET handler to fetch all salary structures
export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken || (decodedToken.role !== "admin" && decodedToken.role !== "hr")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const structures = await SalaryStructure.find({}).populate("employeeId", "name profile.jobTitle");
    return NextResponse.json(structures);
  } catch (error) {
    console.error("Error fetching salary structures:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST handler to create a new salary structure
export async function POST(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken || (decodedToken.role !== "admin" && decodedToken.role !== "hr")) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const { employeeId, baseSalary, payFrequency } = await req.json();

    if (!employeeId || !baseSalary || !payFrequency) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const existingStructure = await SalaryStructure.findOne({ employeeId });
    if (existingStructure) {
      return NextResponse.json({ message: "A salary structure for this employee already exists." }, { status: 409 });
    }

    const newStructure = new SalaryStructure({
      employeeId,
      baseSalary,
      payFrequency,
    });

    await newStructure.save();
    const populatedStructure = await SalaryStructure.findById(newStructure._id).populate("employeeId", "name profile.jobTitle");

    return NextResponse.json(populatedStructure, { status: 201 });
  } catch (error) {
    console.error("Error creating salary structure:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
