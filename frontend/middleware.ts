import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("accessToken");
  const userID = request.cookies.get("userID");
  const groupID = request.cookies.get("groupID");
  const isLoggedIn = accessToken && userID && groupID;
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
