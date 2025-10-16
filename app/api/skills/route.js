import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import Skill from "@/models/Skill";

// GET all skills
export async function GET() {
  try {
    await connectDB();
    const skills = await Skill.find({}).sort({ name: 1 });
    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST a new skill
export async function POST(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken || !['admin', 'hr'].includes(decodedToken.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Skill name is required" }, { status: 400 });
    }

    const existingSkill = await Skill.findOne({ name });
    if (existingSkill) {
      return NextResponse.json({ message: "Skill already exists" }, { status: 409 });
    }

    const newSkill = new Skill({ name });
    await newSkill.save();

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Error creating skill:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}