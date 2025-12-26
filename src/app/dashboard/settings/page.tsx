import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NotificationSettingsForm from "@/components/dashboard/notification-settings-form";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/settings");
  }

  const userId = (session.user as any).id;

  // Получаем настройки уведомлений
  let settings = await prisma.notificationSettings.findUnique({
    where: { userId },
  });

  // Если настроек нет, создаем дефолтные
  if (!settings) {
    settings = await prisma.notificationSettings.create({
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
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
          Настройки
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          Управление уведомлениями и предпочтениями
        </p>
      </div>

      {/* Форма настроек уведомлений */}
      <NotificationSettingsForm initialSettings={settings} />
    </div>
  );
}
