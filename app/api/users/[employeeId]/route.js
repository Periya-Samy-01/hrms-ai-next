import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import { jwtVerify } from 'jose';

async function verifyAuth(request) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return { authorized: false, status: 401, message: 'Authentication required.' };
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Allow HR/Admin to view any profile.
    if (payload.role === 'admin' || payload.role === 'hr') {
      return { authorized: true };
    }

    return { authorized: false, status: 403, message: 'Forbidden' };
  } catch (error) {
    return { authorized: false, status: 401, message: 'Invalid token.' };
  }
}

export async function GET(request, context) {
  const employeeId = new URL(request.url).pathname.split('/').pop();
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await connectDB();
    const user = await User.findById(employeeId).select('-password');

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`GET /api/users/${employeeId} Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request, context) {
  const employeeId = new URL(request.url).pathname.split('/').pop();

  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Only admins can change user roles.' }, { status: 403 });
    }

    const { role: newRole } = await request.json();
    const allowedRoles = ['admin', 'hr', 'manager', 'employee'];
    if (!newRole || !allowedRoles.includes(newRole)) {
      return NextResponse.json({ message: 'Invalid role specified.' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(employeeId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    user.role = newRole;
    await user.save();

    const { password, ...userWithoutPassword } = user.toObject();
    return NextResponse.json(userWithoutPassword, { status: 200 });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired') {
        return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }
    console.error(`PUT /api/users/${employeeId} Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}