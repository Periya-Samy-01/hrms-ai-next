// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  // ✅ If user is not logged in, redirect to login
  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // ✅ If user *is* logged in and trying to access login/register, redirect to dashboard
  if (token && (url.pathname === "/" || url.pathname.startsWith("/login"))) {
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // ✅ Validate the JWT
  if (token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
      return NextResponse.next();
    } catch (err) {
      console.error("Invalid token:", err);
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
