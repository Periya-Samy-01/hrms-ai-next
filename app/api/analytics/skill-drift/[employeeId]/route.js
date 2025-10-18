import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import RoleSkillMatrix from '@/models/RoleSkillMatrix';
import EmployeeSkill from '@/models/EmployeeSkill';
import Skill from '@/models/Skill';
import { verifyToken } from '@/lib/auth';

export async function GET(req, { params }) {
  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded || !['manager', 'admin', 'hr'].includes(decoded.role)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  const { employeeId } = params;

  if (!employeeId) {
    return NextResponse.json({ message: 'Employee ID is required' }, { status: 400 });
  }

  try {
    await connectDB();

    const employee = await User.findById(employeeId);
    if (!employee) {
      return NextResponse.json({ message: 'Employee not found' }, { status: 404 });
    }

    const roleName = employee.profile.jobTitle;
    const roleSkillMatrix = await RoleSkillMatrix.findOne({ roleName }).populate('requiredSkills.skillId');
    if (!roleSkillMatrix) {
      return NextResponse.json({ message: 'Role skill matrix not found for this role' }, { status: 404 });
    }

    const employeeSkills = await EmployeeSkill.find({ employeeId }).populate('skillId');

    const proficiencyToValue = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };

    const skillDrift = roleSkillMatrix.requiredSkills.map(required => {
      const employeeSkill = employeeSkills.find(es => es.skillId._id.toString() === required.skillId._id.toString());
      const currentProficiency = employeeSkill ? employeeSkill.currentProficiency : 'N/A';
      const requiredValue = proficiencyToValue[required.requiredProficiency] || 0;
      const currentValue = employeeSkill ? proficiencyToValue[currentProficiency] || 0 : 0;

      return {
        skill: required.skillId.name,
        requiredProficiency: required.requiredProficiency,
        currentProficiency: currentProficiency,
        gap: requiredValue - currentValue,
      };
    });

    return NextResponse.json(skillDrift, { status: 200 });
  } catch (error) {
    console.error("Error fetching skill drift analytics:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}