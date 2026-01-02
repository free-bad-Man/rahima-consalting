export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, NotificationType } from "@prisma/client";
import { sendEmail } from "@/lib/email";

// Проверка прав администратора/менеджера
async function checkAdminAccess(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  return user?.role === "ADMIN" || user?.role === "MANAGER";
}

// PATCH - обновление статуса заказа
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const hasAccess = await checkAdminAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id: orderId } = await params;
    const body = await request.json();
    const { status, comment } = body;

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return NextResponse.json({ error: "Некорректный статус" }, { status: 400 });
    }

    // Получаем заказ с данными пользователя
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { user: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    const oldStatus = order.status;

    // Обновляем статус
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status,
        updatedAt: new Date(),
        completedAt: status === "COMPLETED" ? new Date() : order.completedAt,
      },
    });

    // Записываем в историю
    await prisma.orderStatusHistory.create({
      data: {
        id: `osh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        orderId,
        status,
        comment: comment || null,
        changedBy: userId,
      },
    });

    // Создаём уведомление для клиента
    const statusLabels: Record<string, string> = {
      PENDING: "ожидает обработки",
      IN_PROGRESS: "взята в работу",
      REVIEW: "на проверке",
      COMPLETED: "выполнена",
      CANCELLED: "отменена",
    };

    await prisma.notification.create({
      data: {
        userId: order.userId,
        type: NotificationType.ORDER_UPDATE,
        title: "Статус заявки изменён",
        message: `Ваша заявка "${order.serviceName}" ${statusLabels[status] || status}.${comment ? ` Комментарий: ${comment}` : ""}`,
        link: "/dashboard/orders",
      },
    });

    // Отправляем email клиенту
    if (order.user.email && oldStatus !== status) {
      const statusColors: Record<string, string> = {
        PENDING: "#EAB308",
        IN_PROGRESS: "#3B82F6",
        REVIEW: "#A855F7",
        COMPLETED: "#22C55E",
        CANCELLED: "#EF4444",
      };

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; text-align: center;">Rahima Consulting</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #333;">Статус вашей заявки изменён</h2>
            
            <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p><strong>Заявка:</strong> ${order.serviceName}</p>
              <p>
                <strong>Новый статус:</strong> 
                <span style="color: ${statusColors[status] || "#333"}; font-weight: bold;">
                  ${statusLabels[status] || status}
                </span>
              </p>
              ${comment ? `<p><strong>Комментарий:</strong> ${comment}</p>` : ""}
            </div>
            
            <p>Вы можете отслеживать статус в <a href="${process.env.NEXTAUTH_URL}/dashboard/orders" style="color: #667eea;">личном кабинете</a>.</p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} Rahima Consulting
            </p>
          </div>
        </body>
        </html>
      `;

      try {
        await sendEmail({
          to: order.user.email,
          subject: `Статус заявки изменён — ${statusLabels[status]}`,
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("Admin order update error:", error);
    return NextResponse.json({ error: "Ошибка обновления" }, { status: 500 });
  }
}

// GET - получение заказа
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const hasAccess = await checkAdminAccess(userId);
    if (!hasAccess) {
      return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
    }

    const { id: orderId } = await params;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        documents: true,
        statusHistory: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Admin order get error:", error);
    return NextResponse.json({ error: "Ошибка получения" }, { status: 500 });
  }
}
