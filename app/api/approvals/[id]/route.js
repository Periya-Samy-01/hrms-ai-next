import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import ApprovalRequest from "@/models/ApprovalRequest";
import User from "@/models/User";
import Goal from "@/models/Goal";

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

    const manager = await User.findById(decoded.sub);
    if (!manager || manager.role !== "manager") {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const { status } = await req.json();
    const validStatuses = ["Approved", "Denied", "Rejected"];
    if (!status || !validStatuses.includes(status)) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    let itemToUpdate = await Goal.findById(params.id);
    let itemType = "Goal";

    if (!itemToUpdate) {
      itemToUpdate = await ApprovalRequest.findById(params.id);
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
      if (status === "Approved") {
        itemToUpdate.status = "Active";
      } else {
        itemToUpdate.status = "Needs Revision";
      }
    } else {
      itemToUpdate.status = status;
    }
    await itemToUpdate.save();

    return Response.json({ message: `Request ${status.toLowerCase()}`, itemToUpdate });
  } catch (error) {
    console.error("💥 Error in updating request:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}