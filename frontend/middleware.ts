import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const jwtToken = request.cookies.get("jwtToken");
  const userID = request.cookies.get("userID");
  const groupID = request.cookies.get("groupID");
  const isUserLoggedIn = Boolean(jwtToken && userID);
  const pathname = request.nextUrl.pathname;
  const isPathNotLogin =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/createnew";
  const isPathGetStarted = pathname.includes("get-started");

  // ユーザーもグループもログインしている場合
  if (isUserLoggedIn && groupID) {
    if (isPathNotLogin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }
  // ユーザーのみログインしている場合
  if (isUserLoggedIn && !groupID) {
    if (isPathGetStarted) {
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
    "/histories/:path*",
    "/get-started/:path*",
  ],
};
