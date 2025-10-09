import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: -1, // Expire the cookie immediately
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}