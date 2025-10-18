import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import LeaveRequest from '@/models/LeaveRequest';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';
import ApprovalRequest from '@/models/ApprovalRequest';

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
    const user = await User.findById(decoded.sub);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!user.manager) {
      return NextResponse.json({ message: 'Cannot request leave: No manager assigned.' }, { status: 400 });
    }

    const leaveRequest = new LeaveRequest({
      employee: decoded.sub,
      startDate,
      endDate,
      reason,
    });
    await leaveRequest.save();

    const approvalRequest = new ApprovalRequest({
      requester: user._id,
      manager: user.manager,
      type: 'Leave',
      details: {
        startDate,
        endDate,
        description: reason,
      },
      referenceId: leaveRequest._id,
      referenceModel: 'LeaveRequest',
    });
    await approvalRequest.save();

    return NextResponse.json(leaveRequest, { status: 201 });
  } catch (error) {
    console.error('Leave Request Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
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