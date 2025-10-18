import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import Announcement from "@/models/Announcement";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.sub);
    if (!user || user.role !== 'admin' && user.role !== 'hr') {
        return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { title, content } = await req.json();
    if (!title || !content) {
        return Response.json({ error: "Title and content are required" }, { status: 400 });
    }

    const announcement = new Announcement({ title, content });
    await announcement.save();

    return Response.json({ message: "Announcement created successfully", announcement });
  } catch (error) {
    console.error("💥 Error in creating announcement:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}