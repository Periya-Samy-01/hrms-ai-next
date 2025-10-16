import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import AuditEvent from "@/models/AuditEvent";
import User from "@/models/User";

export async function GET(req) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken || decodedToken.role !== 'admin') {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();

    const auditEvents = await AuditEvent.find({})
      .populate({
        path: 'actorId',
        select: 'name'
      })
      .sort({ timestamp: -1 });

    return NextResponse.json(auditEvents);
  } catch (error) {
    console.error("Error fetching audit events:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}