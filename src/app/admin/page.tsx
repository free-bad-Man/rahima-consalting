import { prisma } from "@/lib/prisma";
import { ClipboardList, Users, CheckCircle, Clock } from "lucide-react";

export default async function AdminDashboard() {
  const [totalOrders, pendingOrders, completedOrders, totalUsers] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.user.count(),
  ]);

  const stats = [
    { label: "Всего заявок", value: totalOrders, icon: ClipboardList, color: "text-blue-400" },
    { label: "Ожидают обработки", value: pendingOrders, icon: Clock, color: "text-yellow-400" },
    { label: "Выполнено", value: completedOrders, icon: CheckCircle, color: "text-green-400" },
    { label: "Пользователей", value: totalUsers, icon: Users, color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Обзор</h1>
        <p className="text-white/60">Статистика системы</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg bg-white/10 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
