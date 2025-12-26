import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Package, FileText, Bell, Settings, BarChart3 } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // Получаем статистику пользователя
  const userId = (session.user as any).id;
  
  const [ordersCount, documentsCount, unreadNotificationsCount] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.document.count({ where: { userId } }),
    prisma.notification.count({ 
      where: { 
        userId, 
        read: false 
      } 
    }),
  ]);

  const stats = [
    {
      name: "Активные заказы",
      value: ordersCount,
      icon: Package,
      href: "/dashboard/orders",
      color: "from-purple-600 to-blue-600",
    },
    {
      name: "Документы",
      value: documentsCount,
      icon: FileText,
      href: "/dashboard/documents",
      color: "from-blue-600 to-cyan-600",
    },
    {
      name: "Непрочитанные уведомления",
      value: unreadNotificationsCount,
      icon: Bell,
      href: "/dashboard/notifications",
      color: "from-orange-600 to-red-600",
      badge: unreadNotificationsCount > 0,
    },
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Заголовок */}
      <div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
          Добро пожаловать, {session.user.name || "Пользователь"}!
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          Управляйте своими заказами, документами и настройками
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="group relative p-4 md:p-6 rounded-xl md:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                {stat.badge && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <h3 className="text-white/60 text-xs md:text-sm font-medium mb-1">
                {stat.name}
              </h3>
              <p className="text-2xl md:text-3xl font-bold text-white">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Быстрые действия */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Link
          href="/dashboard/profile"
          className="p-6 rounded-xl md:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Мой профиль</h3>
              <p className="text-white/60 text-sm">Управление личными данными</p>
            </div>
          </div>
        </Link>

        <Link
          href="/dashboard/settings"
          className="p-6 rounded-xl md:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold mb-1">Настройки</h3>
              <p className="text-white/60 text-sm">Уведомления и предпочтения</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Последние заказы (заглушка для следующего шага) */}
      <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Последние заказы</h2>
          <Link
            href="/dashboard/orders"
            className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
          >
            Посмотреть все
          </Link>
        </div>
        {ordersCount === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60">У вас пока нет заказов</p>
            <Link
              href="/"
              className="mt-4 inline-block text-purple-400 hover:text-purple-300 transition-colors"
            >
              Выбрать услугу
            </Link>
          </div>
        ) : (
          <p className="text-white/60 text-sm">Заказы будут отображаться здесь</p>
        )}
      </div>
    </div>
  );
}

