import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import LeaveRequest from '@/models/LeaveRequest';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

export async function POST(req) {
  await connectDB();
  const { startDate, endDate, reason } = await req.json();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leaveRequest = new LeaveRequest({
      employee: decoded.id,
      startDate,
      endDate,
      reason,
    });
    await leaveRequest.save();
    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(req) {
  await connectDB();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leaveRequests = await LeaveRequest.find().populate('employee', 'name');
    return NextResponse.json(leaveRequests, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}