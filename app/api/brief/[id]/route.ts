import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
    
    // Створюємо об'єкт для оновлення лише тих полів, що передані і існують в моделі
    const updateData: any = {};
    if (body.status) updateData.status = body.status;
    if (body.companyName) updateData.companyName = body.companyName;
    if (body.contactName) updateData.contactName = body.contactName;
    if (body.email) updateData.email = body.email;
    if (body.phone) updateData.phone = body.phone;
    if (body.data) updateData.data = body.data;

    const brief = await prisma.brief.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(brief);
  } catch (error: any) {
    console.error("PUT brief error:", error);
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
