import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectDB();
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-password");
    return Response.json({ user });
  } catch (error) {
    console.error("💥 Error in protected route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
