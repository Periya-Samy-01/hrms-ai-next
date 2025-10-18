import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

// GET: Fetch users not in the manager's team
export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get('token')?.value;
    const decoded = await verifyToken(token);

    if (!decoded || decoded.role !== 'manager') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const manager = await User.findById(decoded.sub).select('team');
    if (!manager) {
      return NextResponse.json({ message: 'Manager not found' }, { status: 404 });
    }

    const teamMemberIds = manager.team.map(id => id.toString());
    teamMemberIds.push(decoded.sub); // Exclude the manager themselves

    const availableUsers = await User.find({
      _id: { $nin: teamMemberIds },
      role: { $in: ['employee', 'hr'] }
    }).select('name role');

    return NextResponse.json(availableUsers, { status: 200 });
  } catch (error) {
    console.error('Error fetching available users:', error);
    if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add a user to the manager's team
export async function POST(req) {
    try {
      await connectDB();
      const token = req.cookies.get('token')?.value;
      const decoded = await verifyToken(token);

      if (!decoded || decoded.role !== 'manager') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { userId } = await req.json();
      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }

      // Add user to manager's team array
      const manager = await User.findByIdAndUpdate(
        decoded.sub,
        { $addToSet: { team: userId } }, // Use $addToSet to avoid duplicates
        { new: true }
      );

      if (!manager) {
        return NextResponse.json({ message: 'Manager not found' }, { status: 404 });
      }

      // Assign manager to the user
      await User.findByIdAndUpdate(userId, { manager: decoded.sub });

      return NextResponse.json({ message: 'Team member added successfully' }, { status: 200 });

    } catch (error) {
      console.error('Error adding team member:', error);
      if (error.name === 'JsonWebTokenError') {
          return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }

  // DELETE: Remove a user from the manager's team
  export async function DELETE(req) {
    try {
      await connectDB();
      const token = req.cookies.get('token')?.value;
      const decoded = await verifyToken(token);

      if (!decoded || decoded.role !== 'manager') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }

      const { userId } = await req.json();
      if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
      }

      // Remove user from manager's team array
      const manager = await User.findByIdAndUpdate(
        decoded.sub,
        { $pull: { team: userId } },
        { new: true }
      );

      if (!manager) {
        return NextResponse.json({ message: 'Manager not found' }, { status: 404 });
      }

      // Unassign manager from the user
      await User.findByIdAndUpdate(userId, { manager: null });

      return NextResponse.json({ message: 'Team member removed successfully' }, { status: 200 });

    } catch (error) {
      console.error('Error removing team member:', error);
      if (error.name === 'JsonWebTokenError') {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
      }
      return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
  }