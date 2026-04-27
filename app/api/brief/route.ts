import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const body = await request.json();
    
    const dataToSave: any = {
      companyName: body.companyName || "",
      contactName: body.contactName || "",
      phone: body.phone || "",
      email: body.email || "",
      contactMethod: body.contactMethod || "",
      messenger: body.messenger || null,
      contactTime: body.contactTime || null,
      goal: body.goal || "",
      problem: body.problem || "",
      features: body.features || "",
      functionalModules: body.functionalModules || "",
      valueProposition: body.valueProposition || null,
      targetAudience: body.targetAudience || null,
      uniqueness: body.uniqueness || null,
      competitors: body.competitors || null,
      existingWork: body.existingWork || null,
      references: body.references || null,
      expectations: body.expectations || null,
      needAuth: body.needAuth || false,
      needApi: body.needApi || false,
      exampleSites: body.exampleSites || null,
      designStyle: body.designStyle || null,
      budget: body.budget || "",
      deadline: body.deadline || "",
      priority: body.priority || "",
      comments: body.comments || null,
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