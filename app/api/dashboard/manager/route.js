import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import ApprovalRequest from "@/models/ApprovalRequest";

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

    const manager = await User.findById(decoded.id).select("-password");
    if (!manager || manager.role !== "manager") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const pendingApprovals = await ApprovalRequest.find({ manager: manager._id, status: "Pending" }).populate("requester", "name");
    const teamMembers = await User.find({ _id: { $in: manager.team } }).select("name profile");

    return Response.json({
      pendingApprovals,
      teamMembers,
    });
  } catch (error) {
    console.error("💥 Error in manager dashboard route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}