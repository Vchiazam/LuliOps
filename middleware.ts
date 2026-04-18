import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicPaths = [
  "/login",
  "/register",
  "/verify-email-otp",
  "/password-reset/request",
  "/password-reset/validate",
  "/password-reset/done",
  "/google-callback",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  if (isPublic) {
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
