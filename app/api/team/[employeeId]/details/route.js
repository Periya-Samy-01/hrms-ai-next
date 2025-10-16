import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import User from "@/models/User";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
    }

    const manager = await User.findById(decoded.sub);
    if (!manager || manager.role !== "manager") {
      return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403 });
    }

    const { employeeId } = params;

    // Ensure the employee is in the manager's team
    if (!manager.team.map(id => id.toString()).includes(employeeId)) {
        return new Response(JSON.stringify({ error: "Employee not in your team" }), { status: 403 });
    }

    const employee = await User.findById(employeeId).select('-password');

    if (!employee) {
        return new Response(JSON.stringify({ error: "Employee not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(employee), { status: 200 });
  } catch (error) {
    console.error("💥 Error in fetching employee details:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}