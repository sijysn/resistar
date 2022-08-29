import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwt-token");
  const isPathLogin = request.nextUrl.pathname === "/login";
  if (jwtToken && isPathLogin) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!jwtToken && !isPathLogin) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/histories/:path*"],
};
