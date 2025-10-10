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

    // For getting payslips, allow employees to view their own, and HR/Admins to view any.
    // This logic will be more fleshed out in the GET handler itself.
    if (payload.role) {
      return { authorized: true, role: payload.role, userId: payload.id };
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

  const { employeeId } = params;
  const { role, userId } = authResult;

  // Security check: Admins/HR can see any payslip. Employees can only see their own.
  if (role !== 'admin' && role !== 'hr' && userId !== employeeId) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await dbConnect();

    const payslips = await Payslip.find({ employeeId }).sort({ payPeriodEndDate: -1 });

    if (!payslips) {
      return NextResponse.json({ message: 'No payslips found for this employee' }, { status: 404 });
    }

    return NextResponse.json(payslips, { status: 200 });
  } catch (error) {
    console.error(`GET /api/payslips/${employeeId} Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}