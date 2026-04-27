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

function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  return input.trim().slice(0, 5000);
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
    
    const dataToSave = {
      companyName: sanitizeInput(body.companyName),
      contactName: sanitizeInput(body.contactName),
      phone: sanitizeInput(body.phone),
      email: sanitizeInput(body.email),
      contactMethod: sanitizeInput(body.contactMethod),
      messenger: sanitizeInput(body.messenger) || null,
      contactTime: sanitizeInput(body.contactTime) || null,
      goal: sanitizeInput(body.goal),
      problem: sanitizeInput(body.problem),
      features: sanitizeInput(body.features),
      functionalModules: sanitizeInput(body.functionalModules),
      valueProposition: sanitizeInput(body.valueProposition) || null,
      targetAudience: sanitizeInput(body.targetAudience) || null,
      uniqueness: sanitizeInput(body.uniqueness) || null,
      competitors: sanitizeInput(body.competitors) || null,
      existingWork: sanitizeInput(body.existingWork) || null,
      references: sanitizeInput(body.references) || null,
      expectations: sanitizeInput(body.expectations) || null,
      needAuth: Boolean(body.needAuth),
      needApi: Boolean(body.needApi),
      exampleSites: sanitizeInput(body.exampleSites) || null,
      designStyle: sanitizeInput(body.designStyle) || null,
      budget: sanitizeInput(body.budget),
      deadline: sanitizeInput(body.deadline),
      priority: sanitizeInput(body.priority),
      comments: sanitizeInput(body.comments) || null,
    };

    const brief = await prisma.brief.create({
      data: dataToSave,
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