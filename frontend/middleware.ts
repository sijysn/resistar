import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const userID = request.cookies.get("userID");
  const isLoggedIn = jwtToken && userID;
  const isPathLogin = request.nextUrl.pathname === "/login";
  if (isLoggedIn && isPathLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!isLoggedIn && !isPathLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/histories/:path*"],
};
