import { prisma } from "@/lib/prisma";
import { NotificationType } from "@prisma/client";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
}

/**
 * Создает уведомление для пользователя с учетом его настроек
 */
export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  try {
    // Получаем настройки уведомлений пользователя
    const settings = await prisma.notificationSettings.findUnique({
      where: { userId },
    });

    // Если настроек нет, создаем уведомление по умолчанию
    // (в реальном приложении можно проверить настройки и не создавать, если отключено)
    
    // Создаем уведомление в БД
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link || null,
        read: false,
      },
    });

    // TODO: Здесь можно добавить отправку email и push уведомлений
    // в зависимости от настроек пользователя
    // if (settings?.emailEnabled && shouldSendEmail(type, settings)) {
    //   await sendEmailNotification(userId, title, message);
    // }
    // if (settings?.pushEnabled && shouldSendPush(type, settings)) {
    //   await sendPushNotification(userId, title, message);
    // }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Проверяет, нужно ли отправлять email уведомление для данного типа
 */
function shouldSendEmail(type: NotificationType, settings: any): boolean {
  if (!settings.emailEnabled) return false;

  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return settings.emailOrderUpdates;
    case NotificationType.DOCUMENT_READY:
      return settings.emailDocumentReady;
    case NotificationType.REMINDER:
      return settings.emailReminders;
    case NotificationType.PROMOTION:
      return settings.emailPromotions;
    default:
      return true;
  }
}

/**
 * Проверяет, нужно ли отправлять push уведомление для данного типа
 */
function shouldSendPush(type: NotificationType, settings: any): boolean {
  if (!settings.pushEnabled) return false;

  switch (type) {
    case NotificationType.ORDER_UPDATE:
      return settings.pushOrderUpdates;
    case NotificationType.DOCUMENT_READY:
      return settings.pushDocumentReady;
    case NotificationType.REMINDER:
      return settings.pushReminders;
    case NotificationType.PROMOTION:
      return settings.pushPromotions;
    default:
      return true;
  }
}




