import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import Goal from '@/models/Goal';
import SalaryStructure from '@/models/SalaryStructure';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    if (!token) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await verifyToken(token);
    if (!decodedToken) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const { sub: userId, role } = decodedToken;

    const { query } = await req.json();
    if (!query) {
        return NextResponse.json({ message: 'Query is required' }, { status: 400 });
    }

    await connectDB();

    let contextData = {};
    const userFieldsToSelect = '-password'; // Exclude password from all queries

    switch (role) {
        case 'employee':
            contextData = await User.findById(userId)
                .select(userFieldsToSelect)
                .populate('performanceGoals')
                .populate('salaryStructure')
                .lean();
            break;
        case 'manager':
            const managerData = await User.findById(userId)
                .select(userFieldsToSelect)
                .populate({
                    path: 'team',
                    select: userFieldsToSelect,
                    populate: ['performanceGoals', 'salaryStructure']
                })
                .lean();
            contextData = managerData;
            break;
        case 'hr':
        case 'admin':
            // For simplicity, fetching all users. In a real-world scenario, you might paginate or be more selective.
            const allUsers = await User.find({})
                .select(userFieldsToSelect)
                .populate('performanceGoals')
                .populate('salaryStructure')
                .lean();
            contextData = { allUsers };
            break;
        default:
            return NextResponse.json({ message: 'Invalid role' }, { status: 403 });
    }

    const prompt = `You are an internal HR AI assistant for a company. Your tone should be helpful and professional.
Based on the following JSON data context, answer the user's question.
If the user asks a question and the data is not present in the context, state that you do not have access to that information.
Do not invent or hallucinate information. Only use the data provided in the context.

Context:
${JSON.stringify(contextData, null, 2)}

User's Question:
"${query}"
`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ response: text });

  } catch (error) {
    console.error("Error in /api/ai/assistant:", error);
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
  }
}