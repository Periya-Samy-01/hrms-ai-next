import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import Goal from "@/models/Goal";
import User from "@/models/User";

export async function PATCH(req, { params }) {
  console.log("PATCH /api/goals/[goalId] hit:", params);
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("No token found.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log("Invalid token.");
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }
    console.log("Token decoded:", decoded);

    const manager = await User.findById(decoded.id);
    if (!manager || manager.role !== "manager") {
      console.log("User is not a manager or not found.");
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }
    console.log("Manager found:", manager.name);

    const { goalId } = params;
    const { status } = await req.json();
    console.log("Request body:", { goalId, status });

    if (!["Active", "Needs Revision"].includes(status)) {
      console.log("Invalid status received:", status);
      return new Response(JSON.stringify({ error: "Invalid status" }), { status: 400 });
    }

    const goal = await Goal.findById(goalId);
    if (!goal) {
      console.log("Goal not found for ID:", goalId);
      return new Response(JSON.stringify({ error: "Goal not found" }), { status: 404 });
    }
    console.log("Goal found:", goal.title);

    if (goal.managerId.toString() !== manager._id.toString()) {
      console.log("Authorization failed: Manager ID mismatch.");
      return new Response(JSON.stringify({ error: "You are not authorized to update this goal" }), { status: 403 });
    }

    goal.status = status;
    await goal.save();
    console.log("Goal status updated successfully.");

    return new Response(JSON.stringify(goal), { status: 200 });
  } catch (error) {
    console.error("💥 Error in PATCH /api/goals/[goalId]:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}