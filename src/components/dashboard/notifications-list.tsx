"use client";

import { useState, useEffect } from "react";
import { Bell, Filter, Loader2, AlertCircle, CheckCircle2, Check, X, Trash2 } from "lucide-react";
import { NotificationType } from "@prisma/client";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export default function NotificationsList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = filter === "unread" 
        ? "/api/notifications?read=false"
        : "/api/notifications";
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при загрузке уведомлений");
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      console.error("Fetch notifications error:", err);
      setError(err instanceof Error ? err.message : "Ошибка при загрузке уведомлений");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date(dateString).toLocaleDateString("ru-RU");
    }
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case NotificationType.ORDER_UPDATE:
        return "📦";
      case NotificationType.DOCUMENT_READY:
        return "📄";
      case NotificationType.REMINDER:
        return "⏰";
      case NotificationType.PROMOTION:
        return "🎁";
      default:
        return "🔔";
    }
  };

  const handleMarkAsRead = async (notificationId: string, currentRead: boolean) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (!response.ok) {
        throw new Error("Ошибка при обновлении уведомления");
      }

      // Обновляем локальное состояние
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: !currentRead } : n
        )
      );
    } catch (error) {
      console.error("Mark as read error:", error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ошибка при удалении уведомления");
      }

      // Удаляем из локального состояния
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Delete notification error:", error);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Фильтры */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-5 h-5 text-white/60" />
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          Все
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
              : "bg-white/5 border border-white/10 text-white/70 hover:bg-white/10"
          }`}
        >
          Непрочитанные
        </button>
      </div>

      {/* Состояния загрузки и ошибок */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-white/60">Загрузка уведомлений...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-red-400 mb-4" />
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={fetchNotifications}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Список уведомлений */}
      {!isLoading && !error && (
        <>
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 rounded-xl md:rounded-2xl border border-white/10 bg-white/5">
              <Bell className="w-12 h-12 md:w-16 md:h-16 text-white/20 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {filter === "unread" 
                  ? "Нет непрочитанных уведомлений" 
                  : "У вас пока нет уведомлений"}
              </h3>
              <p className="text-white/60 text-sm md:text-base text-center">
                {filter === "unread"
                  ? "Все уведомления прочитаны"
                  : "Здесь будут отображаться ваши уведомления"}
              </p>
            </div>
          ) : (
            <div className="space-y-3 md:space-y-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 md:p-6 rounded-xl md:rounded-2xl border transition-all duration-300 ${
                    notification.read
                      ? "border-white/10 bg-white/5"
                      : "border-purple-500/30 bg-purple-500/10"
                  }`}
                >
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="text-2xl md:text-3xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className={`font-semibold ${notification.read ? "text-white/80" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                      <p className={`text-sm md:text-base mb-3 ${notification.read ? "text-white/60" : "text-white/80"}`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs text-white/50">
                          {formatDate(notification.createdAt)}
                        </span>
                        <div className="flex items-center gap-2">
                          {notification.link && (
                            <a
                              href={notification.link}
                              className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                            >
                              Перейти →
                            </a>
                          )}
                          <button
                            onClick={() => handleMarkAsRead(notification.id, notification.read)}
                            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
                            title={notification.read ? "Отметить как непрочитанное" : "Отметить как прочитанное"}
                          >
                            {notification.read ? (
                              <X className="w-4 h-4" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 transition-colors"
                            title="Удалить"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}


