import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { User, Mail, Calendar, ClipboardList, ChevronRight } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { orders: true },
      },
      orders: {
        take: 1,
        orderBy: { createdAt: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Пользователи</h1>
        <p className="text-white/60">Всего: {users.length}</p>
      </div>

      <div className="space-y-3">
        {users.map(user => (
          <Link
            key={user.id}
            href={`/admin/users/${user.id}`}
            className="block p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{user.name || "Без имени"}</h3>
                  <div className="flex items-center gap-4 text-sm text-white/60">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(user.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardList className="w-4 h-4" />
                      {user._count.orders} заявок
                    </span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </div>
          </Link>
        ))}

        {users.length === 0 && (
          <div className="text-center py-12 text-white/50">
            Нет пользователей
          </div>
        )}
      </div>
    </div>
  );
}
