import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/dbConnect';
import User from '@/models/User';
import { jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

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

export async function GET(request) {
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await connectDB();
    // Select only non-sensitive fields
    const users = await User.find({}).select('name email role profile.jobTitle');
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('GET /api/users Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const authResult = await verifyAuth(request);
  if (!authResult.authorized) {
    return NextResponse.json({ message: authResult.message }, { status: authResult.status });
  }

  try {
    await connectDB();
    const { name, email, password, role } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error('POST /api/users Error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}