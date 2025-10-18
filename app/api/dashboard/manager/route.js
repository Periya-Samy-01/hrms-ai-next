import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";
import ApprovalRequest from "@/models/ApprovalRequest";
import Goal from "@/models/Goal";

export async function GET(req) {
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

    const manager = await User.findById(decoded.sub).select("-password");
    if (!manager || manager.role !== "manager") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const pendingApprovals = await ApprovalRequest.find({ manager: manager._id, status: "Pending" }).populate("requester", "name");
    const pendingGoals = await Goal.find({ managerId: manager._id, status: "Pending Approval" }).populate("employeeId", "name");

    const formattedGoals = pendingGoals.map(goal => ({
      _id: goal._id,
      type: "Goal",
      requester: goal.employeeId,
      details: {
        title: goal.title,
        description: goal.description,
      },
      status: goal.status
    }));

    const allPendingApprovals = [...pendingApprovals, ...formattedGoals];
    const teamMembers = await User.find({ _id: { $in: manager.team } }).select("name profile");

    return Response.json({
      pendingApprovals: allPendingApprovals,
      teamMembers,
    });
  } catch (error) {
    console.error("💥 Error in manager dashboard route:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}