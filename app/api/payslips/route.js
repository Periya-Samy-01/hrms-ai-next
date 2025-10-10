import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Payslip from '@/models/Payslip';
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

export async function POST(request) {
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await dbConnect();
    const body = await request.json();
    const {
      employeeId,
      payPeriodStartDate,
      payPeriodEndDate,
      grossEarnings,
      totalDeductions,
      netPay,
      breakdown
    } = body;

    if (!employeeId || !payPeriodStartDate || !payPeriodEndDate || !grossEarnings || !totalDeductions || !netPay || !breakdown) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    const newPayslip = new Payslip({
      employeeId,
      payPeriodStartDate,
      payPeriodEndDate,
      grossEarnings,
      totalDeductions,
      netPay,
      breakdown,
    });

    const savedPayslip = await newPayslip.save();

    return NextResponse.json(savedPayslip, { status: 201 });
  } catch (error) {
    console.error('POST /api/payslips Error:', error);
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}