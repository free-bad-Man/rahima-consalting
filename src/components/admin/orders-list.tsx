"use client";

import { useState } from "react";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Package,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  User,
  Mail,
  Calendar
} from "lucide-react";

interface Order {
  id: string;
  serviceName: string;
  description: string | null;
  status: string;
  priority: string;
  amount: number | null;
  monthlyAmount: number | null;
  oneTimeAmount: number | null;
  source: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  user: {
    id: string;
    name: string | null;
    email: string | null;
  };
  statusHistory: Array<{
    id: string;
    status: string;
    comment: string | null;
    changedBy: string | null;
    createdAt: string;
  }>;
}

const statusConfig: Record<string, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: { label: "Ожидает", color: "text-yellow-400", bgColor: "bg-yellow-400/10", icon: Clock },
  IN_PROGRESS: { label: "В работе", color: "text-blue-400", bgColor: "bg-blue-400/10", icon: Package },
  REVIEW: { label: "На проверке", color: "text-purple-400", bgColor: "bg-purple-400/10", icon: Eye },
  COMPLETED: { label: "Выполнен", color: "text-green-400", bgColor: "bg-green-400/10", icon: CheckCircle },
  CANCELLED: { label: "Отменён", color: "text-red-400", bgColor: "bg-red-400/10", icon: XCircle },
};

const statusOptions = ["PENDING", "IN_PROGRESS", "REVIEW", "COMPLETED", "CANCELLED"];

export default function AdminOrdersList({ initialOrders }: { initialOrders: Order[] }) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("ALL");
  const [updating, setUpdating] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  const filteredOrders = filter === "ALL" 
    ? orders 
    : orders.filter(o => o.status === filter);

  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdating(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, comment }),
      });

      if (res.ok) {
        const updated = await res.json();
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setComment("");
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("ALL")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === "ALL" 
              ? "bg-white text-gray-900" 
              : "bg-white/10 text-white hover:bg-white/20"
          }`}
        >
          Все ({orders.length})
        </button>
        {statusOptions.map(status => {
          const config = statusConfig[status];
          const count = orders.filter(o => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status 
                  ? `${config.bgColor} ${config.color}` 
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Список заявок */}
      <div className="space-y-4">
        {filteredOrders.map(order => {
          const config = statusConfig[order.status] || statusConfig.PENDING;
          const isExpanded = expandedId === order.id;
          const StatusIcon = config.icon;

          return (
            <div
              key={order.id}
              className="rounded-xl bg-white/5 border border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div 
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/5"
                onClick={() => setExpandedId(isExpanded ? null : order.id)}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${config.bgColor}`}>
                    <StatusIcon className={`w-5 h-5 ${config.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{order.serviceName}</h3>
                    <div className="flex items-center gap-4 text-sm text-white/60">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {order.user.name || "Без имени"}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {order.user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {order.monthlyAmount && (
                    <span className="text-white font-medium">
                      {order.monthlyAmount.toLocaleString()} ₽/мес
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-lg ${config.bgColor} ${config.color} font-medium`}>
                    {config.label}
                  </span>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-white/50" /> : <ChevronDown className="w-5 h-5 text-white/50" />}
                </div>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="border-t border-white/10 p-4 space-y-4 bg-black/20">
                  {/* Описание */}
                  {order.description && (
                    <div>
                      <h4 className="text-white/70 text-sm mb-1">Описание:</h4>
                      <p className="text-white whitespace-pre-line">{order.description}</p>
                    </div>
                  )}

                  {/* Стоимость */}
                  <div className="flex gap-6">
                    {order.monthlyAmount && (
                      <div>
                        <h4 className="text-white/70 text-sm">Ежемесячно:</h4>
                        <p className="text-white font-medium">{order.monthlyAmount.toLocaleString()} ₽</p>
                      </div>
                    )}
                    {order.oneTimeAmount && order.oneTimeAmount > 0 && (
                      <div>
                        <h4 className="text-white/70 text-sm">Разово:</h4>
                        <p className="text-white font-medium">{order.oneTimeAmount.toLocaleString()} ₽</p>
                      </div>
                    )}
                  </div>

                  {/* Изменение статуса */}
                  <div className="pt-4 border-t border-white/10">
                    <h4 className="text-white/70 text-sm mb-2">Изменить статус:</h4>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {statusOptions.map(status => {
                        const cfg = statusConfig[status];
                        return (
                          <button
                            key={status}
                            onClick={() => updateStatus(order.id, status)}
                            disabled={updating === order.id || order.status === status}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
                              order.status === status
                                ? `${cfg.bgColor} ${cfg.color} ring-2 ring-white/30`
                                : "bg-white/10 text-white/70 hover:bg-white/20"
                            }`}
                          >
                            {updating === order.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              cfg.label
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Комментарий (опционально)"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* История */}
                  {order.statusHistory.length > 0 && (
                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-white/70 text-sm mb-2">История:</h4>
                      <div className="space-y-2">
                        {order.statusHistory.map(h => (
                          <div key={h.id} className="text-sm text-white/60">
                            <span className="text-white/40">{formatDate(h.createdAt)}</span>
                            {" → "}
                            <span className={statusConfig[h.status]?.color}>{statusConfig[h.status]?.label}</span>
                            {h.comment && <span className="text-white/50"> — {h.comment}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-white/30">ID: {order.id}</div>
                </div>
              )}
            </div>
          );
        })}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-white/50">
            Нет заявок
          </div>
        )}
      </div>
    </div>
  );
}
