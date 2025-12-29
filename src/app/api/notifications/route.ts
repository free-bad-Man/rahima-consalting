export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

// GET - получение списка уведомлений пользователя
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(request.url);
    const read = searchParams.get("read"); // "true" | "false" | null
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Формируем условия фильтрации
    const where: any = { userId };
    if (read !== null) {
      where.read = read === "true";
    }

    // Получаем уведомления
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
    ]);

    return NextResponse.json({
      notifications,
      total,
      unreadCount,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении уведомлений" },
      { status: 500 }
    );
  }
}

// POST - создание нового уведомления (для внутреннего использования)
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const { type, title, message, link } = body;

    // Валидация
    if (!type || !title || !message) {
      return NextResponse.json(
        { error: "Тип, заголовок и сообщение обязательны" },
        { status: 400 }
      );
    }

    if (!Object.values(NotificationType).includes(type)) {
      return NextResponse.json(
        { error: "Неверный тип уведомления" },
        { status: 400 }
      );
    }

    // Создаем уведомление
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
      },
    });

    return NextResponse.json({ notification }, { status: 201 });
  } catch (error) {
    console.error("Notifications POST error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании уведомления" },
      { status: 500 }
    );
  }
}


