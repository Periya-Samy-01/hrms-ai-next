import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // Allow the login API to be accessed without a token
  if (url.pathname.startsWith("/api/auth/login")) {
    return NextResponse.next();
  }

  // Handle unauthenticated users
  if (!token) {
    if (url.pathname.startsWith("/api")) {
      // For API routes, return a 401 Unauthorized response
      return new Response(JSON.stringify({ message: "Authentication required" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // For frontend routes, redirect to the login page
    if (url.pathname.startsWith("/dashboard")) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Handle authenticated users
  try {
    const { payload } = await jwtVerify(token, secret);
    const userRole = payload.role;

    // If a logged-in user tries to access the login page, redirect them to their dashboard
    if (url.pathname.startsWith("/login")) {
      switch (userRole) {
        case "admin":
          url.pathname = "/dashboard/admin";
          break;
        case "manager":
          url.pathname = "/dashboard/manager";
          break;
        case "hr":
          url.pathname = "/dashboard/hr";
          break;
        default:
          url.pathname = "/dashboard/employee";
          break;
      }
      return NextResponse.redirect(url);
    }

    // Add any other role-based access control here if needed

  } catch (err) {
    // If token is invalid, clear it and redirect to login
    console.error("Invalid token:", err);
    url.pathname = "/login";
    const response = NextResponse.redirect(url);
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login", "/api/:path*"],
};