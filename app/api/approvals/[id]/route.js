import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import ApprovalRequest from "@/models/ApprovalRequest";
import User from "@/models/User";
import Goal from "@/models/Goal";
import AuditEvent from "@/models/AuditEvent";
import Notification from "@/models/Notification";

export async function PATCH(req, context) {
  // Workaround for a persistent Next.js warning about `params` not being awaited.
  // We extract the ID directly from the request URL instead of using context.
  const id = new URL(req.url).pathname.split('/').pop();
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

    const manager = await User.findById(decoded.sub);
    if (!manager || manager.role !== "manager") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    const validStatuses = ["Approved", "Denied", "Rejected"];
    if (!status || !validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    let itemToUpdate = await Goal.findById(id);
    let itemType = "Goal";

    if (!itemToUpdate) {
      itemToUpdate = await ApprovalRequest.findById(id);
      itemType = "ApprovalRequest";
    }

    if (!itemToUpdate) {
      return Response.json({ error: "Request not found" }, { status: 404 });
    }

    const managerIdToCheck = itemType === "Goal" ? itemToUpdate.managerId : itemToUpdate.manager;
    if (managerIdToCheck.toString() !== manager._id.toString()) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    if (itemType === "Goal") {
      let notificationMessage = "";
      if (status === "Approved") {
        itemToUpdate.status = "Active";
        notificationMessage = `Your goal "${itemToUpdate.title}" has been approved.`;
      } else {
        itemToUpdate.status = "Needs Revision";
        notificationMessage = `Your goal "${itemToUpdate.title}" needs revision.`;
      }
      await itemToUpdate.save();

      // Create a notification for the employee
      await Notification.create({
        recipientId: itemToUpdate.employeeId,
        message: notificationMessage,
        link: "/dashboard/goals",
      });
    } else {
      itemToUpdate.status = status;
      await itemToUpdate.save();
    }

    if (itemType === "Goal" && itemToUpdate.status === "Active") {
      const auditEvent = new AuditEvent({
        actorId: manager._id,
        actionType: "GOAL_APPROVED",
        details: {
          goalId: itemToUpdate._id,
          employeeId: itemToUpdate.employeeId,
        },
      });
      await auditEvent.save();
    }

    return Response.json({ message: `Request ${status.toLowerCase()}`, itemToUpdate });
  } catch (error) {
    console.error("💥 Error in updating request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}