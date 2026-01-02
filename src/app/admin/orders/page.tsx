import { prisma } from "@/lib/prisma";
import AdminOrdersList from "@/components/admin/orders-list";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      statusHistory: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Сериализуем даты в строки
  const serializedOrders = orders.map(order => ({
    ...order,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    completedAt: order.completedAt?.toISOString() || null,
    statusHistory: order.statusHistory.map(h => ({
      ...h,
      createdAt: h.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Заявки</h1>
        <p className="text-white/60">Управление заявками клиентов</p>
      </div>

      <AdminOrdersList initialOrders={serializedOrders} />
    </div>
  );
}
