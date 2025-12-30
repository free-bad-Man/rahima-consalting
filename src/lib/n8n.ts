/**
 * Утилита для интеграции с n8n
 * Отправляет события в n8n webhooks и получает ответы
 */

// URL n8n внутри Docker-сети (для server-side) или внешний (для fallback)
const N8N_INTERNAL_URL = process.env.N8N_INTERNAL_URL || "http://n8n:5678";
const N8N_EXTERNAL_URL = process.env.N8N_WEBHOOK_URL || "https://ai.rahima-consulting.ru";

// Типы событий которые можно отправлять в n8n
export type N8nEventType = 
  | "contact_form"      // Заявка с формы обратной связи
  | "document_upload"   // Загрузка документа
  | "order_created"     // Создан новый заказ
  | "order_updated"     // Обновлён заказ
  | "user_registered"   // Новый пользователь
  | "ai_chat"           // Запрос к ИИ-ассистенту
  | "custom";           // Кастомное событие

export interface N8nEvent {
  type: N8nEventType;
  data: Record<string, unknown>;
  userId?: string;
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export interface N8nResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  executionId?: string;
}

/**
 * Отправить событие в n8n webhook
 * @param webhookPath - путь к webhook (например: "/webhook/contact-form")
 * @param event - данные события
 * @param useExternal - использовать внешний URL (по умолчанию false - внутренний Docker URL)
 */
export async function sendToN8n(
  webhookPath: string,
  event: N8nEvent,
  useExternal: boolean = false
): Promise<N8nResponse> {
  const baseUrl = useExternal ? N8N_EXTERNAL_URL : N8N_INTERNAL_URL;
  const url = `${baseUrl}${webhookPath.startsWith("/") ? "" : "/"}${webhookPath}`;

  const payload = {
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
    source: "rahima-consulting-app",
  };

  console.log(`[n8n] Sending event to: ${url}`, { type: event.type });

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Source": "rahima-app",
      },
      body: JSON.stringify(payload),
      // Таймаут 30 секунд для тяжёлых операций
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[n8n] Error response:`, errorText);
      return {
        success: false,
        error: `n8n returned ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    console.log(`[n8n] Success:`, data);

    return {
      success: true,
      data,
      executionId: response.headers.get("x-n8n-execution-id") || undefined,
    };
  } catch (error) {
    console.error(`[n8n] Request failed:`, error);
    
    // Если внутренний URL не работает, попробуем внешний
    if (!useExternal) {
      console.log(`[n8n] Retrying with external URL...`);
      return sendToN8n(webhookPath, event, true);
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Отправить заявку с формы обратной связи
 */
export async function sendContactForm(data: {
  name: string;
  email: string;
  phone?: string;
  message: string;
  service?: string;
}) {
  return sendToN8n("/webhook/contact-form", {
    type: "contact_form",
    data,
  });
}

/**
 * Отправить уведомление о загрузке документа
 */
export async function notifyDocumentUpload(data: {
  userId: string;
  documentId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}) {
  return sendToN8n("/webhook/document-upload", {
    type: "document_upload",
    data,
    userId: data.userId,
  });
}

/**
 * Отправить запрос к ИИ-ассистенту через n8n
 */
export async function sendAiChatRequest(data: {
  userId: string;
  message: string;
  conversationId?: string;
  context?: Record<string, unknown>;
}) {
  return sendToN8n("/webhook/ai-chat", {
    type: "ai_chat",
    data,
    userId: data.userId,
  });
}

/**
 * Уведомить о новом заказе
 */
export async function notifyOrderCreated(data: {
  orderId: string;
  userId: string;
  service: string;
  amount?: number;
  details?: Record<string, unknown>;
}) {
  return sendToN8n("/webhook/order-created", {
    type: "order_created",
    data,
    userId: data.userId,
  });
}

/**
 * Уведомить о регистрации пользователя
 */
export async function notifyUserRegistered(data: {
  userId: string;
  email: string;
  name: string;
}) {
  return sendToN8n("/webhook/user-registered", {
    type: "user_registered",
    data,
    userId: data.userId,
  });
}
