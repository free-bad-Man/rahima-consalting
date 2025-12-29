export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { NotificationType, OrderStatus } from "@prisma/client";

// GET - получение конкретного заказа
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { id: orderId } = await params;

    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId, // Проверяем, что заказ принадлежит пользователю
      },
      include: {
        documents: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Заказ не найден" },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Order GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении заказа" },
      { status: 500 }
    );
  }
}

// PATCH - обновление заказа (включая статус)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;
    const { id: orderId } = await params;
    const body = await request.json();

    // Получаем текущий заказ
    const currentOrder = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
    });

    if (!currentOrder) {
      return NextResponse.json(
        { error: "Заказ не найден" },
        { status: 404 }
      );
    }

    const { status, ...otherFields } = body;
    const oldStatus = currentOrder.status;

    // Обновляем заказ
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        ...(status && Object.values(OrderStatus).includes(status) && { status }),
        ...(status === OrderStatus.COMPLETED && { completedAt: new Date() }),
        ...otherFields,
      },
      include: {
        documents: true,
      },
    });

    // Создаем уведомление, если статус изменился
    if (status && status !== oldStatus) {
      try {
        const statusMessages: Record<OrderStatus, { title: string; message: string }> = {
          [OrderStatus.PENDING]: {
            title: "Заказ ожидает обработки",
            message: `Заказ "${currentOrder.serviceName}" ожидает обработки.`,
          },
          [OrderStatus.IN_PROGRESS]: {
            title: "Заказ в работе",
            message: `Заказ "${currentOrder.serviceName}" взят в работу.`,
          },
          [OrderStatus.REVIEW]: {
            title: "Заказ на проверке",
            message: `Заказ "${currentOrder.serviceName}" находится на проверке.`,
          },
          [OrderStatus.COMPLETED]: {
            title: "Заказ выполнен",
            message: `Заказ "${currentOrder.serviceName}" успешно выполнен!`,
          },
          [OrderStatus.CANCELLED]: {
            title: "Заказ отменен",
            message: `Заказ "${currentOrder.serviceName}" был отменен.`,
          },
        };

        const statusInfo = statusMessages[status as OrderStatus];
        if (statusInfo) {
          await createNotification({
            userId,
            type: NotificationType.ORDER_UPDATE,
            title: statusInfo.title,
            message: statusInfo.message,
            link: `/dashboard/orders`,
          });
        }
      } catch (notificationError) {
        // Логируем ошибку, но не прерываем обновление заказа
        console.error("Error creating notification for order status update:", notificationError);
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении заказа" },
      { status: 500 }
    );
  }
}
