import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import ApprovalRequest from "@/models/ApprovalRequest";
import User from "@/models/User";

export async function PATCH(req, { params }) {
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

    const manager = await User.findById(decoded.id);
    if (!manager || manager.role !== "manager") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !["Approved", "Denied"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const approvalRequest = await ApprovalRequest.findById(params.id);
    if (!approvalRequest) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    if (approvalRequest.manager.toString() !== manager._id.toString()) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    approvalRequest.status = status;
    await approvalRequest.save();

    return Response.json({ message: `Request ${status.toLowerCase()}`, approvalRequest });
  } catch (error) {
    console.error("💥 Error in updating request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}