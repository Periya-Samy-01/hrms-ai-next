import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);

  // If trying to access a protected route without a token, redirect to login
  if (!token && url.pathname.startsWith("/dashboard")) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (token) {
    try {
      // Validate the token
      const { payload } = await jwtVerify(token, secret);
      const userRole = payload.role;

      // If a logged-in user is on the login page or root, redirect to their specific dashboard
      if (url.pathname === "/" || url.pathname.startsWith("/login")) {
        if (userRole === "manager") {
          url.pathname = "/dashboard/manager";
        }else if (userRole === "hr") {
          url.pathname = "/dashboard/hr";
        }else {
          // Default all other roles to the employee dashboard
          url.pathname = "/dashboard/employee";
        }
        return NextResponse.redirect(url);
      }

      // Add role-based access control for dashboard routes
      if (url.pathname.startsWith("/dashboard/manager") && userRole !== "manager") {
        url.pathname = "/dashboard/employee"; // Redirect non-managers away
        return NextResponse.redirect(url);
      }

      if (url.pathname.startsWith("/dashboard/employee") && userRole === "manager") {
        // Optional: A manager might also have an employee view, but for now, we'll keep them on their main dashboard.
        // If a manager lands on an employee page, redirect them to their own dashboard.
        url.pathname = "/dashboard/manager";
        return NextResponse.redirect(url);
      }

    } catch (err) {
      // If token is invalid, redirect to login and clear the cookie
      console.error("Invalid token:", err);
      url.pathname = "/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/login"],
};
