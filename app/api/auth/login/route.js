import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/dbConnect";
import { generateToken } from "@/lib/auth";

export async function POST(req) {
  try {
    console.log("Login request received");
    await connectDB();
    console.log("Database connected");
    const { email, password } = await req.json();
    console.log(`Attempting to log in user: ${email}`);

    const user = await User.findOne({ email });
    if (!user) {
      console.log(`User not found: ${email}`);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log(`User found: ${user.email}`);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log(`Invalid credentials for user: ${email}`);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    console.log(`Password is valid for user: ${email}`);

    const token = await generateToken(user);
    console.log(`Token generated for user: ${email}`);

    const response = NextResponse.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    console.log("Login successful, returning response");
    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred" }, { status: 500 });
  }
}
