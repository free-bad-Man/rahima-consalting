import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar, Clock, CheckCircle, XCircle, Eye, Package } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: { label: "Ожидает", color: "text-yellow-400", bgColor: "bg-yellow-400/10", icon: Clock },
  IN_PROGRESS: { label: "В работе", color: "text-blue-400", bgColor: "bg-blue-400/10", icon: Package },
  REVIEW: { label: "На проверке", color: "text-purple-400", bgColor: "bg-purple-400/10", icon: Eye },
  COMPLETED: { label: "Выполнен", color: "text-green-400", bgColor: "bg-green-400/10", icon: CheckCircle },
  CANCELLED: { label: "Отменён", color: "text-red-400", bgColor: "bg-red-400/10", icon: XCircle },
};

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        include: {
          statusHistory: {
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      },
      profile: true,
    },
  });

  if (!user) {
    notFound();
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <Link href="/admin/users" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Назад к пользователям
      </Link>

      {/* User info */}
      <div className="p-6 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
            <User className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user.name || "Без имени"}</h1>
            <div className="flex items-center gap-4 text-white/60">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Регистрация: {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
        {user.profile && (
          <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {user.profile.phone && <div><span className="text-white/50">Телефон:</span> <span className="text-white">{user.profile.phone}</span></div>}
            {user.profile.company && <div><span className="text-white/50">Компания:</span> <span className="text-white">{user.profile.company}</span></div>}
            {user.profile.city && <div><span className="text-white/50">Город:</span> <span className="text-white">{user.profile.city}</span></div>}
          </div>
        )}
      </div>

      {/* Orders */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Заявки ({user.orders.length})</h2>
        <div className="space-y-3">
          {user.orders.map(order => {
            const config = statusConfig[order.status] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            return (
              <Link
                key={order.id}
                href={`/admin/orders?highlight=${order.id}`}
                className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <StatusIcon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{order.serviceName}</h3>
                      <p className="text-white/60 text-sm">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-lg ${config.bgColor} ${config.color} text-sm font-medium`}>
                      {config.label}
                    </span>
                    {order.monthlyAmount && (
                      <p className="text-white/60 text-sm mt-1">{order.monthlyAmount.toLocaleString()} ₽/мес</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          {user.orders.length === 0 && (
            <div className="text-center py-8 text-white/50">
              Нет заявок
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
