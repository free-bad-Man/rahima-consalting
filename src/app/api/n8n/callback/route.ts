export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Callback endpoint для n8n
 * POST /api/n8n/callback
 * 
 * n8n отправляет сюда результаты обработки:
 * - Статусы выполнения workflow
 * - Результаты ИИ-обработки документов
 * - Уведомления для пользователей
 */
export async function POST(request: Request) {
  try {
    // Проверяем секретный ключ от n8n
    const authHeader = request.headers.get("x-n8n-secret");
    const expectedSecret = process.env.N8N_CALLBACK_SECRET;
    
    if (expectedSecret && authHeader !== expectedSecret) {
      console.warn("[n8n Callback] Unauthorized request");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    const { 
      type,           // Тип callback: "notification", "document_result", "order_update"
      userId,         // ID пользователя для уведомления
      title,          // Заголовок уведомления
      message,        // Текст уведомления
      data,           // Дополнительные данные
      priority,       // Приоритет: "low", "normal", "high"
      executionId,    // ID выполнения в n8n
    } = body;

    console.log("[n8n Callback] Received:", { type, userId, executionId });

    // Обработка разных типов callback
    switch (type) {
      case "notification":
        // Создаём уведомление для пользователя
        if (userId && message) {
          await prisma.notification.create({
            data: {
              userId,
              title: title || "Уведомление",
              message,
              type: priority === "high" ? "REMINDER" : "SYSTEM",
              read: false,
            },
          });
          console.log(`[n8n Callback] Notification created for user ${userId}`);
        }
        break;

      case "document_result":
        // Обработка результата анализа документа
        if (data?.documentId && data?.result) {
          // Здесь можно обновить документ с результатами OCR/анализа
          console.log(`[n8n Callback] Document ${data.documentId} processed`);
        }
        break;

      case "order_update":
        // Обновление статуса заказа
        if (data?.orderId && data?.status) {
          await prisma.order.update({
            where: { id: data.orderId },
            data: { status: data.status },
          });
          console.log(`[n8n Callback] Order ${data.orderId} updated to ${data.status}`);
        }
        break;

      default:
        console.log(`[n8n Callback] Unknown type: ${type}`);
    }

    return NextResponse.json({
      success: true,
      received: true,
    });
  } catch (error) {
    console.error("[n8n Callback] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Также поддерживаем GET для проверки доступности
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "n8n-callback",
    timestamp: new Date().toISOString(),
  });
}
