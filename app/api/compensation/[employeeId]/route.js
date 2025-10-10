import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import SalaryStructure from '@/models/SalaryStructure';
import { jwtVerify } from 'jose';

async function verifyAuth(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { authorized: false, status: 401, message: 'Authentication required.' };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role === 'admin' || payload.role === 'hr') {
      return { authorized: true, role: payload.role };
    }

    return { authorized: false, status: 403, message: 'Forbidden' };
  } catch (error) {
    return { authorized: false, status: 401, message: 'Invalid token.' };
  }
}

export async function GET(request, { params }) {
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await connectDB();
    const { employeeId } = params;

    const salaryStructure = await SalaryStructure.findOne({ employeeId });

    if (!salaryStructure) {
      return NextResponse.json({ message: 'Salary structure not found' }, { status: 404 });
    }

    return NextResponse.json(salaryStructure, { status: 200 });
  } catch (error) {
    console.error('GET /api/compensation Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await connectDB();
    const { employeeId } = params;
    const body = await request.json();

    const { baseSalary, payFrequency, effectiveDate } = body;

    if (!baseSalary || !payFrequency) {
      return NextResponse.json({ message: 'Missing required fields: baseSalary and payFrequency' }, { status: 400 });
    }

    const salaryData = {
      employeeId,
      baseSalary,
      payFrequency,
      ...(effectiveDate && { effectiveDate }),
    };

    const updatedSalaryStructure = await SalaryStructure.findOneAndUpdate(
      { employeeId },
      salaryData,
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json(updatedSalaryStructure, { status: 200 });
  } catch (error) {
    console.error('POST /api/compensation Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}