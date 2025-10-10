import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    console.log("➡️ Register route hit");
    await connectDB();

    const body = await req.json();
    console.log("📦 Received body:", body);

    const { name, email, password } = body;

    const existingUser = await User.findOne({ email });
    console.log("👀 Existing user:", existingUser);

    if (existingUser) {
      return Response.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ User registered:", newUser);

    return Response.json({ message: "✅ User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("💥 Error in register route:", error);
    return Response.json({ error: "❌ Registration failed" }, { status: 500 });
  }
}
