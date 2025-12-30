export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

import { NextResponse } from "next/server";
import { sendContactForm } from "@/lib/n8n";

/**
 * API для отправки формы обратной связи
 * POST /api/contact
 * 
 * Принимает данные формы и отправляет их в n8n для обработки:
 * - Уведомление в Telegram админу
 * - Email клиенту
 * - Запись в CRM
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const { name, email, phone, message, service } = body;

    // Валидация обязательных полей
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Имя обязательно (минимум 2 символа)" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email обязателен" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        { error: "Неверный формат email" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Сообщение обязательно (минимум 10 символов)" },
        { status: 400 }
      );
    }

    // Отправляем в n8n
    const result = await sendContactForm({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || undefined,
      message: message.trim(),
      service: service?.trim() || undefined,
    });

    if (!result.success) {
      console.error("[Contact API] n8n error:", result.error);
      // Не показываем пользователю детали ошибки n8n
      return NextResponse.json(
        { error: "Не удалось отправить заявку. Попробуйте позже." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.",
    });
  } catch (error) {
    console.error("[Contact API] Error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка. Попробуйте позже." },
      { status: 500 }
    );
  }
}
