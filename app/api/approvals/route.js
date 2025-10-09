import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import ApprovalRequest from "@/models/ApprovalRequest";
import User from "@/models/User";

export async function POST(req) {
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

    const user = await User.findById(decoded.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const { type, details } = await req.json();
    if (!type || !details) {
      return Response.json({ error: "Type and details are required" }, { status: 400 });
    }

    const manager = await User.findById(user.manager);
    if (!manager) {
        return Response.json({ error: "Manager not found" }, { status: 404 });
    }

    const approvalRequest = new ApprovalRequest({
      requester: user._id,
      manager: manager._id,
      type,
      details,
    });
    await approvalRequest.save();

    return Response.json({ message: "Request submitted successfully", approvalRequest });
  } catch (error) {
    console.error("💥 Error in submitting request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}