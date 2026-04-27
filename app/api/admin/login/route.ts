import { NextResponse } from "next/server";

export async function POST(request: Request) {
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