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

    const decoded = await verifyToken(token);
    if (!decoded) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }

    // Role-based authorization
    if (decoded.role !== 'admin' && decoded.role !== 'hr' && decoded.role !== 'manager' && decoded.role !== 'employee') {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await User.findById(decoded.sub);
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

    let query = {};
    // If the user is a manager, only fetch requests for their team
    if (decoded.role === 'manager') {
      query.manager = decoded.sub;
    } else if (decoded.role !== 'hr' && decoded.role !== 'admin') {
      // Non-HR/admin users cannot access all approvals
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }
    // HR and Admin can see all requests, so the query object remains empty

    const approvals = await ApprovalRequest.find(query).populate('requester', 'name');
    return Response.json(approvals);
  } catch (error) {
    console.error("💥 Error fetching approvals:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}