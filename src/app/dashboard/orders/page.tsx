import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import OrdersList from "@/components/dashboard/orders-list";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/dashboard/orders");
  }

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Заголовок */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
            Мои заказы
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Управление заявками на услуги
          </p>
        </div>
      </div>

      {/* Список заказов */}
      <OrdersList />
    </div>
  );
}
