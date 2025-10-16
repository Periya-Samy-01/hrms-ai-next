import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB } from "@/lib/dbConnect";
import Notification from "@/models/Notification";

export async function PATCH(req) {
  const cookieStore = await cookies();
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
    const id = new URL(req.url).pathname.split('/').pop();

    const notification = await Notification.findById(id);

    if (!notification) {
      return NextResponse.json({ message: "Notification not found" }, { status: 404 });
    }

    // Ensure the user is the recipient of the notification
    if (notification.recipientId.toString() !== decodedToken.sub) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    notification.isRead = true;
    await notification.save();

    return NextResponse.json({ message: "Notification marked as read", notification });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}