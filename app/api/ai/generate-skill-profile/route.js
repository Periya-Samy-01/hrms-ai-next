import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const prompt = `
Analyze the following job description and extract the required skills and proficiency levels.
Return the response as a JSON object with two keys: "roleName" and "requiredSkills".
"roleName" should be a string containing the job title.
"requiredSkills" should be an array of objects, where each object has two keys: "skillName" (string) and "requiredProficiency" (string).
The proficiency level must be one of the following: 'Beginner', 'Intermediate', 'Advanced', 'Expert'.

Example Input:
"We are looking for a Senior Software Engineer with expertise in React, Node.js, and MongoDB. The ideal candidate should have advanced knowledge of JavaScript and intermediate knowledge of Python."

Example Output:
{
  "roleName": "Senior Software Engineer",
  "requiredSkills": [
    { "skillName": "React", "requiredProficiency": "Advanced" },
    { "skillName": "Node.js", "requiredProficiency": "Advanced" },
    { "skillName": "MongoDB", "requiredProficiency": "Advanced" },
    { "skillName": "JavaScript", "requiredProficiency": "Advanced" },
    { "skillName": "Python", "requiredProficiency": "Intermediate" }
  ]
}
`;

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

        const { jobDescription } = await req.json();

        if (!jobDescription) {
            return NextResponse.json({ message: 'Job description is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const fullPrompt = `${prompt}\n\nJob Description:\n${jobDescription}`;
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        const aiResponse = JSON.parse(text.replace(/```json/g, '').replace(/```/g, '').trim());

        return NextResponse.json(aiResponse, { status: 200 });

    } catch (error) {
        console.error("Error in /api/ai/generate-skill-profile:", error);
        return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
    }
}