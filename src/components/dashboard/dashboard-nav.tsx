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
import { useState } from "react";
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

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      {/* Мобильная кнопка меню */}
      {isMobile && (
        <div className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/10 p-4">
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
          bg-[#0A0A0A]/95 backdrop-blur-sm border-r border-white/10 p-4 md:p-6
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
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white"
                        : "text-white/70 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-medium">{item.label}</span>
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
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

