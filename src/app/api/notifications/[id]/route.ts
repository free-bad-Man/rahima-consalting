import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PATCH - отметка уведомления как прочитанного
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
    const { id: notificationId } = await params;
    const body = await request.json();
    const { read } = body;

    // Получаем уведомление и проверяем принадлежность
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Уведомление не найдено" },
        { status: 404 }
      );
    }

    // Обновляем статус прочтения
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        read: read !== undefined ? read : true,
      },
    });

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error("Notification PATCH error:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении уведомления" },
      { status: 500 }
    );
  }
}

// DELETE - удаление уведомления
export async function DELETE(
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
    const { id: notificationId } = await params;

    // Проверяем принадлежность уведомления
    const notification = await prisma.notification.findFirst({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (!notification) {
      return NextResponse.json(
        { error: "Уведомление не найдено" },
        { status: 404 }
      );
    }

    // Удаляем уведомление
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    return NextResponse.json({ message: "Уведомление успешно удалено" });
  } catch (error) {
    console.error("Notification DELETE error:", error);
    return NextResponse.json(
      { error: "Ошибка при удалении уведомления" },
      { status: 500 }
    );
  }
}


