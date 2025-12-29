export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - получение настроек уведомлений пользователя
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    // Получаем настройки уведомлений или создаем дефолтные
    const settings = await prisma.notificationSettings.findUnique({
      where: { userId },
    });

    // Если настроек нет, создаем дефолтные
    if (!settings) {
      const defaultSettings = await prisma.notificationSettings.create({
        data: {
          userId,
          emailEnabled: true,
          emailOrderUpdates: true,
          emailDocumentReady: true,
          emailReminders: true,
          emailPromotions: true,
          pushEnabled: true,
          pushOrderUpdates: true,
          pushDocumentReady: true,
          pushReminders: true,
          pushPromotions: true,
        },
      });

      return NextResponse.json({ settings: defaultSettings });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Notification settings GET error:", error);
    return NextResponse.json(
      { error: "Ошибка при получении настроек уведомлений" },
      { status: 500 }
    );
  }
}

// PUT - обновление настроек уведомлений
export async function PUT(request: Request) {
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

    const {
      emailEnabled,
      emailOrderUpdates,
      emailDocumentReady,
      emailReminders,
      emailPromotions,
      pushEnabled,
      pushOrderUpdates,
      pushDocumentReady,
      pushReminders,
      pushPromotions,
    } = body;

    // Обновляем или создаем настройки
    const updatedSettings = await prisma.notificationSettings.upsert({
      where: { userId },
      update: {
        ...(emailEnabled !== undefined && { emailEnabled }),
        ...(emailOrderUpdates !== undefined && { emailOrderUpdates }),
        ...(emailDocumentReady !== undefined && { emailDocumentReady }),
        ...(emailReminders !== undefined && { emailReminders }),
        ...(emailPromotions !== undefined && { emailPromotions }),
        ...(pushEnabled !== undefined && { pushEnabled }),
        ...(pushOrderUpdates !== undefined && { pushOrderUpdates }),
        ...(pushDocumentReady !== undefined && { pushDocumentReady }),
        ...(pushReminders !== undefined && { pushReminders }),
        ...(pushPromotions !== undefined && { pushPromotions }),
      },
      create: {
        userId,
        emailEnabled: emailEnabled !== undefined ? emailEnabled : true,
        emailOrderUpdates: emailOrderUpdates !== undefined ? emailOrderUpdates : true,
        emailDocumentReady: emailDocumentReady !== undefined ? emailDocumentReady : true,
        emailReminders: emailReminders !== undefined ? emailReminders : true,
        emailPromotions: emailPromotions !== undefined ? emailPromotions : true,
        pushEnabled: pushEnabled !== undefined ? pushEnabled : true,
        pushOrderUpdates: pushOrderUpdates !== undefined ? pushOrderUpdates : true,
        pushDocumentReady: pushDocumentReady !== undefined ? pushDocumentReady : true,
        pushReminders: pushReminders !== undefined ? pushReminders : true,
        pushPromotions: pushPromotions !== undefined ? pushPromotions : true,
      },
    });

    return NextResponse.json({ settings: updatedSettings });
  } catch (error) {
    console.error("Notification settings PUT error:", error);
    return NextResponse.json(
      { error: "Ошибка при обновлении настроек уведомлений" },
      { status: 500 }
    );
  }
}


