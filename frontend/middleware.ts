import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const userID = request.cookies.get("userID");
  const groupID = request.cookies.get("groupID");
  const isUserLoggedIn = Boolean(jwtToken && userID && !groupID);
  const isGroupLoggedIn = Boolean(jwtToken && userID && groupID);
  const pathname = request.nextUrl.pathname;
  const isPathNotLogin = pathname === "/login" || pathname === "/createnew";
  const isPathGetStarted = pathname.includes("get-started");
  const isPathProfile = pathname === "/profile";

  // ユーザーもグループもログインしている場合
  if (isGroupLoggedIn) {
    if (isPathNotLogin || isPathGetStarted) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  // ユーザーのみログインしている場合
  if (isUserLoggedIn) {
    if (isPathGetStarted || isPathProfile) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/get-started/landing", request.url));
  }
  // ログインしていない場合
  if (isPathNotLogin) {
    return NextResponse.next();
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/createnew",
    "/profile",
    "/histories/:path*",
    "/get-started/:path*",
  ],
};
