import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import LeaveRequest from '@/models/LeaveRequest';
import Notification from '@/models/Notification';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = params;
  const { status } = await req.json();

  const token = req.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const decoded = await verifyToken(token);
  if (!decoded || (decoded.role !== 'hr' && decoded.role !== 'admin')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!leaveRequest) {
      return NextResponse.json({ message: 'Leave request not found' }, { status: 404 });
    }

    const notification = new Notification({
      recipient: leaveRequest.employee,
      message: `Your leave request has been ${status}.`,
    });
    await notification.save();

    return NextResponse.json(leaveRequest, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}