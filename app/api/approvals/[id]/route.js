
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import ApprovalRequest from "@/models/ApprovalRequest";
import LeaveRequest from "@/models/LeaveRequest";
import Goal from "@/models/Goal";

export async function PATCH(req, { params }) {
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

    if (decoded.role !== "hr" && decoded.role !== "manager" && decoded.role !== "admin") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    if (!status || !["Approved", "Rejected"].includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const approval = await ApprovalRequest.findById(params.id);
    if (!approval) {
      return Response.json({ error: "Approval request not found" }, { status: 404 });
    }

    // Managers can only approve requests for their own team
    if (decoded.role === "manager" && approval.manager.toString() !== decoded.sub) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    approval.status = status;
    await approval.save();

    // If the approval is for a LeaveRequest, update its status as well
    console.log(`Updating approval ${approval._id}: model=${approval.referenceModel}, refId=${approval.referenceId}, status=${status}`);
    try {
      if (approval.referenceModel === 'LeaveRequest') {
        const updatedLeave = await LeaveRequest.findByIdAndUpdate(approval.referenceId, { status }, { new: true });
        console.log('Updated LeaveRequest:', updatedLeave);
        if (!updatedLeave) console.error(`Failed to find and update LeaveRequest with id ${approval.referenceId}`);
      } else if (approval.referenceModel === 'Goal') {
        const goalStatus = status === 'Approved' ? 'Active' : 'Needs Revision';
        const updatedGoal = await Goal.findByIdAndUpdate(approval.referenceId, { status: goalStatus }, { new: true });
        console.log('Updated Goal:', updatedGoal);
        if (!updatedGoal) console.error(`Failed to find and update Goal with id ${approval.referenceId}`);
      }
    } catch (updateError) {
      console.error("💥 Error updating referenced document:", updateError);
    }


    return Response.json(approval);
  } catch (error) {
    console.error("💥 Error updating approval:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
