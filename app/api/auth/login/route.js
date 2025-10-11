import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/dbConnect";
import { generateToken } from "@/lib/auth";


export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    // Create JWT using the standardized function
    const token = generateToken(user);

    // ❌ If you only returned this:
    // return NextResponse.json({ message: "Login successful", token });

    // ✅ Instead, attach it as a cookie
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

    return response;
  } catch (err) {
    console.error("Login error:", err);
    // Return the actual error message for better debugging
    return NextResponse.json({ error: err.message || "An unexpected error occurred" }, { status: 500 });
  }
}
