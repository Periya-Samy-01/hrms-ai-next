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
        case "employee":
          url.pathname = "/dashboard/employee";
          break;
        default:
          url.pathname = "/login";
          break;
      }
      return NextResponse.redirect(url);
    }

    // Add any other role-based access control here if needed

  } catch (err) {
    console.error("Invalid token detected:", err.message);

    // If the request was for an API route, return a 401 JSON response and clear the cookie.
    if (req.nextUrl.pathname.startsWith("/api")) {
      const response = NextResponse.json(
        { message: "Authentication failed: Invalid token" },
        { status: 401 }
      );
      response.cookies.delete("token");
      return response;
    }

    // For page navigations, redirect to login and clear the cookie.
    const response = NextResponse.redirect(new URL("/login", req.url));
    response.cookies.delete("token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login", "/api/:path*"],
};