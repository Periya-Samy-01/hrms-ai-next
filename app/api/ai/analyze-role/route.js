import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import Skill from '@/models/Skill';
import RoleSkillMatrix from '@/models/RoleSkillMatrix';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompt = `
Analyze the following job description and extract the required skills and proficiency levels.
Return the response as a JSON object with two keys: "roleName" and "requiredSkills".
"roleName" should be a string containing the job title.
"requiredSkills" should be an array of objects, where each object has two keys: "skillName" (string) and "requiredProficiency" (string).
The proficiency level must be one of the following: 'Beginner', 'Intermediate', 'Advanced', 'Expert'.
`;

export async function POST(req) {
    try {
        const token = req.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }
        const user = await verifyToken(token);
        if (!user || !['Admin', 'HR'].includes(user.role)) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const { jobDescription } = await req.json();
        if (!jobDescription) {
            return NextResponse.json({ message: 'Job description is required' }, { status: 400 });
        }

        // 1. Call AI to get structured data
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const fullPrompt = `${prompt}\n\nJob Description:\n${jobDescription}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        const aiResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());
        const { roleName, requiredSkills } = aiResponse;

        // 2. Save to database
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

        let roleSkillMatrix = await RoleSkillMatrix.findOne({ roleName });
        if (roleSkillMatrix) {
            roleSkillMatrix.requiredSkills = skillIds;
            await roleSkillMatrix.save();
        } else {
            roleSkillMatrix = await RoleSkillMatrix.create({
                roleName,
                requiredSkills: skillIds,
            });
        }

        return NextResponse.json(roleSkillMatrix, { status: 200 });

    } catch (error) {
        console.error("Error in /api/ai/analyze-role:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}