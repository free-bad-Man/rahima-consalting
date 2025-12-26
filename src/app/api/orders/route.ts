import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, OrderPriority } from "@prisma/client";

// GET - получение списка заказов пользователя
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
    const status = searchParams.get("status") as OrderStatus | null;
    const limit = parseInt(searchParams.get("limit") || "50");
    const offset = parseInt(searchParams.get("offset") || "0");

    // Формируем условия фильтрации
    const where: any = { userId };
    if (status && Object.values(OrderStatus).includes(status)) {
      where.status = status;
    }

    // Получаем заказы с документами
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          documents: {
            select: {
              id: true,
              name: true,
              fileName: true,
              createdAt: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.order.count({ where }),
    ]);

    return NextResponse.json({
      orders,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказов" },
      { status: 500 }
    );
  }
}

// POST - создание нового заказа
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

    const { serviceName, description, priority, amount, currency } = body;

    // Валидация
    if (!serviceName || typeof serviceName !== "string" || serviceName.trim().length === 0) {
      return NextResponse.json(
        { error: "Название услуги обязательно" },
        { status: 400 }
      );
    }

    // Создаем заказ
    const order = await prisma.order.create({
      data: {
        userId,
        serviceName: serviceName.trim(),
        description: description?.trim() || null,
        priority: priority && Object.values(OrderPriority).includes(priority) 
          ? priority 
          : OrderPriority.NORMAL,
        amount: amount ? parseFloat(amount) : null,
        currency: currency || "RUB",
        status: OrderStatus.PENDING,
      },
      include: {
        documents: true,
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}
