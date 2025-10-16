import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import RoleSkillMatrix from "@/models/RoleSkillMatrix";

// GET all role skill matrices
export async function GET() {
  try {
    await connectDB();
    const matrices = await RoleSkillMatrix.find({}).populate('requiredSkills.skillId', 'name');
    return NextResponse.json(matrices);
  } catch (error) {
    console.error("Error fetching role skill matrices:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// POST to create or update a role skill matrix
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
    const { roleName, requiredSkills } = await req.json();

    if (!roleName || !requiredSkills) {
      return NextResponse.json({ message: "Role name and required skills are required" }, { status: 400 });
    }

    let matrix = await RoleSkillMatrix.findOne({ roleName });

    if (matrix) {
      // Update existing matrix
      matrix.requiredSkills = requiredSkills;
      await matrix.save();
    } else {
      // Create new matrix
      matrix = new RoleSkillMatrix({ roleName, requiredSkills });
      await matrix.save();
    }

    return NextResponse.json(matrix, { status: matrix.isNew ? 201 : 200 });
  } catch (error) {
    console.error("Error creating/updating role skill matrix:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}