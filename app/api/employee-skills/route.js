import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import EmployeeSkill from '@/models/EmployeeSkill';
import { verifyToken } from '@/lib/auth';

export async function POST(req) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded || !['manager', 'admin', 'hr'].includes(decoded.role)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await connectDB();
    const { employeeId, skillId, currentProficiency } = await req.json();

    if (!employeeId || !skillId || !currentProficiency) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const existingSkill = await EmployeeSkill.findOne({ employeeId, skillId });

    if (existingSkill) {
      existingSkill.currentProficiency = currentProficiency;
      await existingSkill.save();
      return NextResponse.json(existingSkill, { status: 200 });
    } else {
      const newEmployeeSkill = await EmployeeSkill.create({
        employeeId,
        skillId,
        currentProficiency,
      });
      return NextResponse.json(newEmployeeSkill, { status: 201 });
    }
  } catch (error) {
    console.error("Error creating or updating employee skill:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}