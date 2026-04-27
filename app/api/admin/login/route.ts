import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (record) {
    if (now > record.resetTime) {
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
      return true;
    } else if (record.count >= limit) {
      return false;
    } else {
      record.count++;
      return true;
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: "Занадто багато спроб. Спробуйте пізніше." },
      { status: 429 }
    );
  }
  
  try {
    const body = await request.json();
    const { login, password } = body;

    const adminLogin = process.env.ADMIN_LOGIN || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "1234";

    if (login === adminLogin && password === adminPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Невірний логін або пароль" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка при авторизації" },
      { status: 500 }
    );
  }
}