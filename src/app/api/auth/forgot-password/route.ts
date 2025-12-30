export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // Валидация email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    // Проверяем формат email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      );
    }

    // Ищем пользователя
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    // Всегда возвращаем успех, чтобы не раскрывать существование аккаунта
    if (!user) {
      return NextResponse.json({
        message: "Если аккаунт существует, вы получите письмо с инструкциями",
      });
    }

    // Проверяем, есть ли у пользователя пароль (не OAuth-only)
    if (!user.password) {
      return NextResponse.json({
        message: "Если аккаунт существует, вы получите письмо с инструкциями",
      });
    }

    // Удаляем старые токены для этого email
    await prisma.passwordResetToken.deleteMany({
      where: { email: trimmedEmail },
    });

    // Генерируем новый токен
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 час

    // Сохраняем токен в БД
    await prisma.passwordResetToken.create({
      data: {
        email: trimmedEmail,
        token,
        expires,
      },
    });

    // Отправляем email
    try {
      await sendPasswordResetEmail(trimmedEmail, token);
    } catch (emailError) {
      console.error("Failed to send password reset email:", emailError);
      // Удаляем токен если не удалось отправить письмо
      await prisma.passwordResetToken.deleteMany({
        where: { email: trimmedEmail },
      });
      return NextResponse.json(
        { error: "Не удалось отправить письмо. Попробуйте позже." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Если аккаунт существует, вы получите письмо с инструкциями",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже." },
      { status: 500 }
    );
  }
}
