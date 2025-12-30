export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Валидация email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Валидация имени (защита от XSS)
function sanitizeName(name: string): string {
  return name
    .trim()
    .slice(0, 100) // Ограничиваем длину
    .replace(/[<>]/g, ""); // Удаляем потенциально опасные символы
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Валидация обязательных полей
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Все поля обязательны" },
        { status: 400 }
      );
    }

    // Валидация типов
    if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
      return NextResponse.json(
        { error: "Неверный формат данных" },
        { status: 400 }
      );
    }

    // Валидация email
    const trimmedEmail = email.trim().toLowerCase();
    if (!isValidEmail(trimmedEmail)) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      );
    }

    // Валидация пароля
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: "Пароль слишком длинный" },
        { status: 400 }
      );
    }

    // Санитизация имени
    const sanitizedName = sanitizeName(name);
    if (sanitizedName.length < 1) {
      return NextResponse.json(
        { error: "Имя не может быть пустым" },
        { status: 400 }
      );
    }

    // Проверка существующего пользователя
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 400 }
      );
    }

    // Хеширование пароля с более высоким cost factor для безопасности
    const hashedPassword = await bcrypt.hash(password, 12);

    // Создание пользователя
    const user = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: trimmedEmail,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "Пользователь успешно зарегистрирован", user: { id: user.id, email: user.email, name: user.name } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Ошибка при регистрации" },
      { status: 500 }
    );
  }
}

