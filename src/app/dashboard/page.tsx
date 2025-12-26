import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { User, Package, FileText, Bell, Settings, BarChart3, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { OrderStatus } from "@prisma/client";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  // Получаем статистику пользователя
  const userId = (session.user as any).id;
  
  const [
    ordersCount,
    activeOrdersCount,
    completedOrdersCount,
    documentsCount,
    unreadNotificationsCount,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count({ where: { userId } }),
    prisma.order.count({ 
      where: { 
        userId,
        status: { in: ["PENDING", "IN_PROGRESS", "REVIEW"] }
      } 
    }),
    prisma.order.count({ 
      where: { 
        userId,
        status: "COMPLETED"
      } 
    }),
    prisma.document.count({ where: { userId } }),
    prisma.notification.count({ 
      where: { 
        userId, 
        read: false 
      } 
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        documents: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    }),
  ]);

  const stats = [
    {
      name: "Всего заказов",
      value: ordersCount,
      icon: Package,
      href: "/dashboard/orders",
      color: "from-purple-600 to-blue-600",
      subtitle: `${activeOrdersCount} активных`,
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
              {stat.subtitle && (
                <p className="text-xs text-white/40 mt-1">{stat.subtitle}</p>
              )}
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

      {/* Последние заказы */}
      <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Последние заказы</h2>
          {ordersCount > 0 && (
            <Link
              href="/dashboard/orders"
              className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
            >
              Посмотреть все →
            </Link>
          )}
        </div>
        {ordersCount === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 mb-2">У вас пока нет заказов</p>
            <Link
              href="/"
              className="mt-4 inline-block text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              Выбрать услугу
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const getStatusColor = (status: OrderStatus) => {
                switch (status) {
                  case OrderStatus.PENDING:
                    return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
                  case OrderStatus.IN_PROGRESS:
                    return "text-blue-400 bg-blue-400/10 border-blue-400/20";
                  case OrderStatus.REVIEW:
                    return "text-purple-400 bg-purple-400/10 border-purple-400/20";
                  case OrderStatus.COMPLETED:
                    return "text-green-400 bg-green-400/10 border-green-400/20";
                  case OrderStatus.CANCELLED:
                    return "text-red-400 bg-red-400/10 border-red-400/20";
                  default:
                    return "text-white/60 bg-white/5 border-white/10";
                }
              };

              const getStatusLabel = (status: OrderStatus) => {
                switch (status) {
                  case OrderStatus.PENDING:
                    return "Ожидает";
                  case OrderStatus.IN_PROGRESS:
                    return "В работе";
                  case OrderStatus.REVIEW:
                    return "На проверке";
                  case OrderStatus.COMPLETED:
                    return "Завершен";
                  case OrderStatus.CANCELLED:
                    return "Отменен";
                  default:
                    return status;
                }
              };

              return (
                <Link
                  key={order.id}
                  href={`/dashboard/orders`}
                  className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-white font-medium group-hover:text-purple-400 transition-colors truncate">
                          {order.serviceName}
                        </h3>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                      {order.description && (
                        <p className="text-white/60 text-sm mb-2 line-clamp-2">
                          {order.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span>
                          {new Date(order.createdAt).toLocaleDateString("ru-RU", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                        {order.amount && (
                          <span>
                            {order.amount} {order.currency || "RUB"}
                          </span>
                        )}
                        {order.documents.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3" />
                            {order.documents.length} документ{order.documents.length > 1 ? "ов" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

