import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

export async function POST(request, context) {
  const { params } = context;
  const { employeeId } = params;

  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    if (payload.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden: Only admins can reset passwords.' }, { status: 403 });
    }

    await connectDB();
    const user = await User.findById(employeeId);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const newPassword = 'password123'; // Temporary default password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: `Password for ${user.name} has been reset.` }, { status: 200 });

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'JWTExpired') {
        return NextResponse.json({ message: 'Invalid token.' }, { status: 401 });
    }
    console.error(`POST /api/users/${employeeId}/reset-password Error:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
