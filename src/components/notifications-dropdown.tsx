"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, Check, Trash2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
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

export default function NotificationsDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  // Загрузка уведомлений
  useEffect(() => {
    if (!session?.user) return;

    const fetchNotifications = async () => {
      try {
        const response = await fetch("/api/notifications?limit=5");
        const data = await response.json();
        if (response.ok) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    
    // Обновляем каждые 30 секунд
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [session]);

  // Загрузка при открытии dropdown
  useEffect(() => {
    if (isOpen && session?.user) {
      setIsLoading(true);
      fetch("/api/notifications?limit=5")
        .then((res) => res.json())
        .then((data) => {
          if (data.notifications) {
            setNotifications(data.notifications);
            setUnreadCount(data.unreadCount || 0);
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, session]);

  const handleMarkAsRead = async (notificationId: string, currentRead: boolean) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ read: !currentRead }),
      });

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, read: !currentRead } : n))
        );
        setUnreadCount((prev) => (currentRead ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (error) {
      console.error("Mark as read error:", error);
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "только что";
    if (minutes < 60) return `${minutes} мин назад`;
    if (hours < 24) return `${hours} ч назад`;
    if (days < 7) return `${days} дн назад`;
    return date.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
  };

  if (!session?.user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Кнопка уведомлений */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Уведомления"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4.5 px-1 rounded-full bg-red-500 text-white text-xs font-semibold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-[#1A1A1A] border border-white/10 rounded-xl shadow-2xl z-50 max-h-[500px] flex flex-col">
          {/* Заголовок */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h3 className="text-white font-semibold">Уведомления</h3>
            <Link
              href="/dashboard/notifications"
              onClick={() => setIsOpen(false)}
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Все →
            </Link>
          </div>

          {/* Список уведомлений */}
          <div className="overflow-y-auto flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 text-purple-400 animate-spin" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <Bell className="w-12 h-12 text-white/20 mb-2" />
                <p className="text-white/60 text-sm text-center">Нет уведомлений</p>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-white/5 transition-colors ${
                      !notification.read ? "bg-purple-500/5" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4
                            className={`text-sm font-medium ${
                              notification.read ? "text-white/80" : "text-white"
                            }`}
                          >
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p
                          className={`text-xs mb-2 ${
                            notification.read ? "text-white/60" : "text-white/80"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/50">
                            {formatDate(notification.createdAt)}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMarkAsRead(notification.id, notification.read)}
                              className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                              title={notification.read ? "Отметить как непрочитанное" : "Отметить как прочитанное"}
                            >
                              {notification.read ? (
                                <X className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                        {notification.link && (
                          <Link
                            href={notification.link}
                            onClick={() => setIsOpen(false)}
                            className="mt-2 inline-block text-xs text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Перейти →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Футер */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-white/10">
              <Link
                href="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm transition-colors"
              >
                Посмотреть все уведомления
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}



