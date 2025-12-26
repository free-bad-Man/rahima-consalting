"use client";

import { useState, useEffect } from "react";
import { Package, Plus, Filter, Loader2, AlertCircle } from "lucide-react";
import OrderCard from "./order-card";
import CreateOrderModal from "./create-order-modal";
import { OrderStatus } from "@prisma/client";

interface Order {
  id: string;
  serviceName: string;
  description: string | null;
  status: OrderStatus;
  priority: string;
  amount: number | null;
  currency: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  documents: Array<{
    id: string;
    name: string;
    fileName: string;
    createdAt: string;
  }>;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | "ALL">("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchOrders = async (status?: OrderStatus | "ALL") => {
    setIsLoading(true);
    setError(null);

    try {
      const url = status && status !== "ALL" 
        ? `/api/orders?status=${status}`
        : "/api/orders";
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при загрузке заказов");
      }

      setOrders(data.orders || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(err instanceof Error ? err.message : "Ошибка при загрузке заказов");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(selectedStatus !== "ALL" ? selectedStatus : undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStatus]);

  const handleOrderCreated = () => {
    setShowCreateModal(false);
    fetchOrders(selectedStatus !== "ALL" ? selectedStatus : undefined);
  };

  const statusOptions: Array<{ value: OrderStatus | "ALL"; label: string; color: string }> = [
    { value: "ALL", label: "Все заказы", color: "text-white/70" },
    { value: "PENDING", label: "Ожидают", color: "text-yellow-400" },
    { value: "IN_PROGRESS", label: "В работе", color: "text-blue-400" },
    { value: "REVIEW", label: "На проверке", color: "text-purple-400" },
    { value: "COMPLETED", label: "Выполнены", color: "text-green-400" },
    { value: "CANCELLED", label: "Отменены", color: "text-red-400" },
  ];

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Панель управления */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Фильтр по статусу */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-white/60" />
          <div className="flex gap-2 flex-wrap">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedStatus(option.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  selectedStatus === option.value
                    ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                    : `bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 ${option.color}`
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Кнопка создания заказа */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Новый заказ</span>
        </button>
      </div>

      {/* Состояния загрузки и ошибок */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-white/60">Загрузка заказов...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-red-400 mb-4" />
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => fetchOrders(selectedStatus !== "ALL" ? selectedStatus : undefined)}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Список заказов */}
      {!isLoading && !error && (
        <>
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 rounded-xl md:rounded-2xl border border-white/10 bg-white/5">
              <Package className="w-12 h-12 md:w-16 md:h-16 text-white/20 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                {selectedStatus === "ALL" 
                  ? "У вас пока нет заказов" 
                  : "Нет заказов с выбранным статусом"}
              </h3>
              <p className="text-white/60 text-sm md:text-base mb-6 text-center">
                {selectedStatus === "ALL"
                  ? "Создайте первый заказ на услугу"
                  : "Попробуйте выбрать другой фильтр"}
              </p>
              {selectedStatus === "ALL" && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Создать заказ
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:gap-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} onUpdate={fetchOrders} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно создания заказа */}
      {showCreateModal && (
        <CreateOrderModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleOrderCreated}
        />
      )}
    </div>
  );
}

