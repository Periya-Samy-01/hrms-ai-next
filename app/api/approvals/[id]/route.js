
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import ApprovalRequest from "@/models/ApprovalRequest";
import LeaveRequest from "@/models/LeaveRequest";
import Goal from "@/models/Goal";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "hr" && decoded.role !== "manager" && decoded.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !["Approved", "Rejected"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const approval = await ApprovalRequest.findByIdAndUpdate(
      id,
      { status, processedAt: new Date() },
      { new: true }
    );

    if (!approval) {
      return Response.json({ error: "Approval request not found" }, { status: 404 });
    }

    // Managers can only approve requests for their own team
    if (decoded.role === "manager" && approval.manager.toString() !== decoded.sub) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // If the approval is for a LeaveRequest, update its status as well
    if (approval.referenceModel === 'LeaveRequest') {
      await LeaveRequest.findByIdAndUpdate(approval.referenceId, { status });
    } else if (approval.referenceModel === 'Goal') {
      // Handle Goal status updates differently if needed, e.g., 'Approved' -> 'Active'
      const goalStatus = status === 'Approved' ? 'Active' : 'Needs Revision';
      await Goal.findByIdAndUpdate(approval.referenceId, { status: goalStatus });
    }


    return Response.json(approval);
  } catch (error) {
    console.error("💥 Error updating approval:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
