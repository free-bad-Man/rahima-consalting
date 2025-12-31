export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { OrderStatus, OrderPriority, OrderSource } from "@prisma/client";
import { createNotification } from "@/lib/notifications";
import { NotificationType } from "@prisma/client";
import { sendToN8n } from "@/lib/n8n";
import { sendEmail } from "@/lib/email";

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
    const userEmail = session.user.email;
    const userName = session.user.name;
    const body = await request.json();

    const { 
      serviceName, 
      description, 
      priority, 
      amount, 
      currency,
      // Новые поля для калькулятора
      source,
      monthlyAmount,
      oneTimeAmount,
      calculatorData,
    } = body;

    // Валидация
    if (!serviceName || typeof serviceName !== "string" || serviceName.trim().length === 0) {
      return NextResponse.json(
        { error: "Название услуги обязательно" },
        { status: 400 }
      );
    }

    // Определяем источник заявки
    const orderSource = source === "calculator" ? OrderSource.CALCULATOR : OrderSource.MANUAL;

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
        monthlyAmount: monthlyAmount ? parseFloat(monthlyAmount) : null,
        oneTimeAmount: oneTimeAmount ? parseFloat(oneTimeAmount) : null,
        currency: currency || "RUB",
        status: OrderStatus.PENDING,
        source: orderSource,
        calculatorData: calculatorData || null,
      },
      include: {
        documents: true,
        statusHistory: true,
      },
    });

    // Создаём начальную запись в истории статусов
    await prisma.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: OrderStatus.PENDING,
        comment: orderSource === OrderSource.CALCULATOR 
          ? "Заявка создана через калькулятор" 
          : "Заявка создана",
        changedBy: "system",
      },
    });

    // Создаем уведомление в личном кабинете
    try {
      await createNotification({
        userId,
        type: NotificationType.ORDER_UPDATE,
        title: "Заявка создана",
        message: orderSource === OrderSource.CALCULATOR
          ? `Ваша заявка на сумму ${monthlyAmount?.toLocaleString() || 0} ₽/мес создана и ожидает обработки.`
          : `Ваш заказ "${serviceName.trim()}" успешно создан и ожидает обработки.`,
        link: `/dashboard/orders`,
      });
    } catch (notificationError) {
      console.error("Error creating notification for order:", notificationError);
    }

    // Отправляем в n8n для обработки
    try {
      await sendToN8n("/webhook/order-created", {
        type: "order_created",
        data: {
          orderId: order.id,
          userId,
          userEmail,
          userName,
          serviceName: serviceName.trim(),
          monthlyAmount,
          oneTimeAmount,
          source: orderSource,
          calculatorData,
        },
        userId,
      });
    } catch (n8nError) {
      console.error("Error sending to n8n:", n8nError);
    }

    // Отправляем email клиенту
    if (userEmail) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; text-align: center;">Rahima Consulting</h1>
            </div>
            
            <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #333; margin-top: 0;">Спасибо за заявку!</h2>
              
              <p>Здравствуйте${userName ? `, ${userName}` : ''}!</p>
              
              <p>Мы получили вашу заявку и уже начинаем работу над ней.</p>
              
              <div style="background: white; border: 1px solid #ddd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="margin-top: 0; color: #667eea;">Детали заявки:</h3>
                <p><strong>Услуга:</strong> ${serviceName}</p>
                ${monthlyAmount ? `<p><strong>Ежемесячно:</strong> ${monthlyAmount.toLocaleString()} ₽</p>` : ''}
                ${oneTimeAmount ? `<p><strong>Разово:</strong> ${oneTimeAmount.toLocaleString()} ₽</p>` : ''}
                <p><strong>Номер заявки:</strong> ${order.id.slice(-8).toUpperCase()}</p>
              </div>
              
              <p>Наш менеджер свяжется с вами в течение 24 часов для уточнения деталей.</p>
              
              <p>Вы можете отслеживать статус заявки в <a href="${process.env.NEXTAUTH_URL}/dashboard/orders" style="color: #667eea;">личном кабинете</a>.</p>
              
              <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
              
              <p style="color: #999; font-size: 12px;">
                Если у вас есть вопросы, напишите нам: info@rahima-consulting.ru
              </p>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
              © ${new Date().getFullYear()} Rahima Consulting. Все права защищены.
            </div>
          </body>
          </html>
        `;

        await sendEmail({
          to: userEmail,
          subject: "Ваша заявка принята — Rahima Consulting",
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Error sending email to client:", emailError);
      }
    }

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json(
      { error: "Ошибка при создании заказа" },
      { status: 500 }
    );
  }
}
