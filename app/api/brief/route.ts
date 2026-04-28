import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit = 10, windowMs = 60000): boolean {
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

export async function GET() {
  try {
    const briefs = await prisma.brief.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(briefs);
  } catch (error) {
    console.error("GET briefs error:", error);
    return NextResponse.json(
      { error: "Помилка при отриманні брифів" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  
  if (!checkRateLimit(ip, 5, 60000)) {
    return NextResponse.json(
      { error: "Занадто багато запитів. Спробуйте пізніше." },
      { status: 429 }
    );
  }
  
  try {
    const body = await request.json();
    
    // Зберігаємо основні поля окремо для зручності пошуку, а все інше в Json
    const brief = await prisma.brief.create({
      data: {
        companyName: body.companyName || "Не вказано",
        contactName: body.contactName || "Не вказано",
        email: body.email || "Не вказано",
        phone: body.phone || "Не вказано",
        data: body, // Зберігаємо весь об'єкт з усіма питаннями
      },
    });

    return NextResponse.json(brief, { status: 201 });
  } catch (error) {
    console.error("Brief creation error:", error);
    return NextResponse.json(
      { error: "Помилка при створенні брифу" },
      { status: 500 }
    );
  }
}
