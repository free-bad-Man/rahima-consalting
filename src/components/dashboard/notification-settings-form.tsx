"use client";

import { useState } from "react";
import { Bell, Mail, Smartphone, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

interface NotificationSettings {
  id: string;
  userId: string;
  emailEnabled: boolean;
  emailOrderUpdates: boolean;
  emailDocumentReady: boolean;
  emailReminders: boolean;
  emailPromotions: boolean;
  pushEnabled: boolean;
  pushOrderUpdates: boolean;
  pushDocumentReady: boolean;
  pushReminders: boolean;
  pushPromotions: boolean;
}

interface NotificationSettingsFormProps {
  initialSettings: NotificationSettings;
}

export default function NotificationSettingsForm({ initialSettings }: NotificationSettingsFormProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [settings, setSettings] = useState<NotificationSettings>(initialSettings);

  const handleToggle = (field: keyof NotificationSettings) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/notifications/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при сохранении настроек");
      }

      setMessage({
        type: "success",
        text: "Настройки успешно сохранены",
      });

      // Скрываем сообщение через 3 секунды
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error("Save settings error:", error);
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Ошибка при сохранении настроек",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Сообщение об успехе/ошибке */}
      {message && (
        <div
          className={`p-4 rounded-lg border flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email уведомления */}
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">Email уведомления</h2>
              <p className="text-white/60 text-sm">Управление уведомлениями по электронной почте</p>
            </div>
          </div>

          {/* Общий переключатель для всех email уведомлений */}
          <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Включить email уведомления</h3>
                <p className="text-white/60 text-sm">Включить или отключить все email уведомления</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("emailEnabled")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailEnabled ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Детальные настройки email уведомлений */}
          <div className="space-y-4">
            {/* Обновления заказов */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Обновления заказов</h4>
                <p className="text-white/60 text-sm">Уведомления об изменении статуса заказов</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("emailOrderUpdates")}
                disabled={!settings.emailEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.emailOrderUpdates && settings.emailEnabled
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailOrderUpdates && settings.emailEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Готовность документов */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Готовность документов</h4>
                <p className="text-white/60 text-sm">Уведомления когда документы готовы к скачиванию</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("emailDocumentReady")}
                disabled={!settings.emailEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.emailDocumentReady && settings.emailEnabled
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailDocumentReady && settings.emailEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Напоминания */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Напоминания</h4>
                <p className="text-white/60 text-sm">Напоминания о важных событиях и дедлайнах</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("emailReminders")}
                disabled={!settings.emailEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.emailReminders && settings.emailEnabled
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailReminders && settings.emailEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Акции и предложения */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Акции и предложения</h4>
                <p className="text-white/60 text-sm">Информация о специальных предложениях и акциях</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("emailPromotions")}
                disabled={!settings.emailEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.emailPromotions && settings.emailEnabled
                    ? "bg-gradient-to-r from-purple-600 to-blue-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailPromotions && settings.emailEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        
        {/* Push уведомления */}
        <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-semibold text-white">Push уведомления</h2>
              <p className="text-white/60 text-sm">Управление push уведомлениями в браузере</p>
            </div>
          </div>

          {/* Общий переключатель для всех push уведомлений */}
          <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Включить push уведомления</h3>
                <p className="text-white/60 text-sm">Включить или отключить все push уведомления</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("pushEnabled")}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushEnabled ? "bg-gradient-to-r from-blue-600 to-cyan-600" : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Детальные настройки push уведомлений */}
          <div className="space-y-4">
            {/* Обновления заказов */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Обновления заказов</h4>
                <p className="text-white/60 text-sm">Уведомления об изменении статуса заказов</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("pushOrderUpdates")}
                disabled={!settings.pushEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.pushOrderUpdates && settings.pushEnabled
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushOrderUpdates && settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Готовность документов */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Готовность документов</h4>
                <p className="text-white/60 text-sm">Уведомления когда документы готовы к скачиванию</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("pushDocumentReady")}
                disabled={!settings.pushEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.pushDocumentReady && settings.pushEnabled
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushDocumentReady && settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Напоминания */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Напоминания</h4>
                <p className="text-white/60 text-sm">Напоминания о важных событиях и дедлайнах</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("pushReminders")}
                disabled={!settings.pushEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.pushReminders && settings.pushEnabled
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushReminders && settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Акции и предложения */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">Акции и предложения</h4>
                <p className="text-white/60 text-sm">Информация о специальных предложениях и акциях</p>
              </div>
              <button
                type="button"
                onClick={() => handleToggle("pushPromotions")}
                disabled={!settings.pushEnabled}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  settings.pushPromotions && settings.pushEnabled
                    ? "bg-gradient-to-r from-blue-600 to-cyan-600"
                    : "bg-white/20"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushPromotions && settings.pushEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Кнопка сохранения */}
        <div className="flex justify-end pt-4 border-t border-white/10">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Сохранение...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Сохранить изменения
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

