import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = 15;
const WINDOW_MS = 60 * 1000;

export function middleware(request: NextRequest) {
  const ip = request.ip || "unknown";
  const now = Date.now();
  
  const record = rateLimitMap.get(ip);
  
  if (record) {
    if (now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    } else if (record.count >= RATE_LIMIT) {
      return NextResponse.json(
        { error: "Занадто багато запитів. Спробуйте пізніше." },
        { status: 429 }
      );
    } else {
      record.count++;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_MS });
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};