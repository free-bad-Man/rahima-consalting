"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  User, 
  Package, 
  FileText, 
  Bell, 
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const navItems = [
  { href: "/dashboard", label: "Главная", icon: LayoutDashboard },
  { href: "/dashboard/profile", label: "Профиль", icon: User },
  { href: "/dashboard/orders", label: "Заказы", icon: Package },
  { href: "/dashboard/documents", label: "Документы", icon: FileText },
  { href: "/dashboard/notifications", label: "Уведомления", icon: Bell },
  { href: "/dashboard/settings", label: "Настройки", icon: Settings },
];

export default function DashboardNav() {
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Загружаем количество непрочитанных уведомлений
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch("/api/notifications?read=false&limit=1");
        const data = await response.json();
        if (response.ok) {
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error("Error fetching unread notifications count:", error);
      }
    };

    fetchUnreadCount();
    
    // Обновляем счетчик каждые 30 секунд
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Мобильная кнопка меню */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-[#0A0A0A] backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Меню</h2>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              aria-label="Открыть меню"
            >
              {isOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Навигация */}
      <nav
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300" : "sticky top-0 h-screen"}
          ${isMobile && !isOpen ? "-translate-x-full" : ""}
          bg-[#0A0A0A] backdrop-blur-sm border-r border-white/10 p-4 md:p-6
        `}
      >
        {/* Логотип/Заголовок */}
        <div className="mb-6 md:mb-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-semibold text-lg">Личный кабинет</span>
          </Link>
        </div>

        {/* Список навигации */}
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || 
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const isNotifications = item.href === "/dashboard/notifications";
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative group
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white shadow-lg shadow-purple-500/10"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {/* Индикатор активности слева */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-purple-500 to-blue-500 rounded-r-full" />
                  )}
                  
                  <Icon 
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      isActive ? "scale-110" : "group-hover:scale-105"
                    }`} 
                  />
                  <span className={`text-sm font-medium flex-1 transition-all duration-200 ${
                    isActive ? "font-semibold" : ""
                  }`}>
                    {item.label}
                  </span>
                  
                  {/* Счетчик уведомлений */}
                  {isNotifications && unreadCount > 0 && (
                    <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-white text-xs font-semibold transition-all duration-200 ${
                      isActive 
                        ? "bg-red-500 shadow-lg shadow-red-500/30" 
                        : "bg-red-500 group-hover:bg-red-600"
                    }`}>
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                  
                  {/* Индикатор hover для неактивных элементов */}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 transition-all duration-200 pointer-events-none" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Кнопка выхода */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Выйти</span>
          </button>
        </div>

        {/* Кнопка возврата на главную */}
        <div className="mt-4">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
            onClick={() => isMobile && setIsOpen(false)}
          >
            <span className="text-sm font-medium">← На главную</span>
          </Link>
        </div>
      </nav>

      {/* Overlay для мобильного меню */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/70"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}


