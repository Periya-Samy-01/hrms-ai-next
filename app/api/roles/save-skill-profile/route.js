import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Skill from '@/models/Skill';
import RoleSkillMatrix from '@/models/RoleSkillMatrix';

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const user = verifyToken(token);
        if (!user || !['Admin', 'HR'].includes(user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();

        const { roleName, requiredSkills } = await req.json();

        // Find or create skills and get their IDs
        const skillIds = await Promise.all(
            requiredSkills.map(async (skill) => {
                let skillDoc = await Skill.findOne({ name: { $regex: new RegExp(`^${skill.skillName}$`, 'i') } });
                if (!skillDoc) {
                    skillDoc = new Skill({ name: skill.skillName });
                    await skillDoc.save();
                }
                return {
                    skillId: skillDoc._id,
                    requiredProficiency: skill.requiredProficiency,
                };
            })
        );

        // Create or update the RoleSkillMatrix
        let roleSkillMatrix = await RoleSkillMatrix.findOne({ roleName });
        if (roleSkillMatrix) {
            // Update existing matrix
            roleSkillMatrix.requiredSkills = skillIds;
            await roleSkillMatrix.save();
        } else {
            // Create new matrix
            roleSkillMatrix = await RoleSkillMatrix.create({
                roleName,
                requiredSkills: skillIds,
            });
        }

        return NextResponse.json(roleSkillMatrix, { status: 200 });

    } catch (error) {
        console.error("Error in /api/roles/save-skill-profile:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}