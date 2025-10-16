import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import Notification from "@/models/Notification";

export async function GET(req) {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const recipientId = decodedToken.sub;

    const unreadCount = await Notification.countDocuments({
      recipientId,
      isRead: false,
    });

    const recentNotifications = await Notification.find({ recipientId })
      .sort({ createdAt: -1 })
      .limit(5);

    return NextResponse.json({
      unreadCount,
      recentNotifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}