export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Валидация
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Токен обязателен" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Пароль обязателен" },
        { status: 400 }
      );
    }

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

    // Ищем токен в БД
    const resetToken = await prisma.passwordResetToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json(
        { error: "Недействительная или просроченная ссылка" },
        { status: 400 }
      );
    }

    // Проверяем срок действия
    if (resetToken.expires < new Date()) {
      // Удаляем просроченный токен
      await prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      return NextResponse.json(
        { error: "Ссылка просрочена. Запросите новую." },
        { status: 400 }
      );
    }

    // Ищем пользователя
    const user = await prisma.user.findUnique({
      where: { email: resetToken.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" },
        { status: 400 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await bcrypt.hash(password, 12);

    // Обновляем пароль пользователя
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Удаляем использованный токен
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже." },
      { status: 500 }
    );
  }
}
