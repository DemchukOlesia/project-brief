import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { briefUpdateSchema } from "@/lib/validation";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const brief = await prisma.brief.findUnique({
      where: { id: params.id },
    });

    if (!brief) {
      return NextResponse.json({ error: "Бриф не знайдено" }, { status: 404 });
    }

    return NextResponse.json(brief);
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка при отриманні брифу" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validatedData = briefUpdateSchema.parse(body);

    const brief = await prisma.brief.update({
      where: { id: params.id },
      data: validatedData,
    });

    return NextResponse.json(brief);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Помилка валідації", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Помилка при оновленні брифу" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.brief.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Помилка при видаленні брифу" },
      { status: 500 }
    );
  }
}