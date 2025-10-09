import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import Announcement from "@/models/Announcement";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const announcements = await Announcement.find().sort({ createdAt: -1 }).limit(5);

    return Response.json({
      user: {
        name: user.name,
        jobTitle: user.profile.jobTitle,
        photoUrl: user.profile.photoUrl,
        leaveBalances: user.leaveBalances,
        performanceGoals: user.performanceGoals,
      },
      announcements,
    });
  } catch (error) {
    console.error("💥 Error in employee dashboard route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}