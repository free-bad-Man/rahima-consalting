"use client";

import { useState } from "react";
import { 
  Package, 
  Calendar, 
  DollarSign, 
  FileText, 
  Clock, 
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ChevronDown,
  ChevronUp
} from "lucide-react";
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

interface OrderCardProps {
  order: Order;
  onUpdate?: () => void;
}

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ElementType }> = {
  PENDING: {
    label: "Ожидает обработки",
    color: "text-yellow-400",
    bgColor: "bg-yellow-400/10 border-yellow-400/30",
    icon: Clock,
  },
  IN_PROGRESS: {
    label: "В работе",
    color: "text-blue-400",
    bgColor: "bg-blue-400/10 border-blue-400/30",
    icon: Package,
  },
  REVIEW: {
    label: "На проверке",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10 border-purple-400/30",
    icon: Eye,
  },
  COMPLETED: {
    label: "Выполнен",
    color: "text-green-400",
    bgColor: "bg-green-400/10 border-green-400/30",
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: "Отменен",
    color: "text-red-400",
    bgColor: "bg-red-400/10 border-red-400/30",
    icon: XCircle,
  },
};

const priorityConfig: Record<string, { label: string; color: string }> = {
  LOW: { label: "Низкий", color: "text-gray-400" },
  NORMAL: { label: "Обычный", color: "text-blue-400" },
  HIGH: { label: "Высокий", color: "text-orange-400" },
  URGENT: { label: "Срочный", color: "text-red-400" },
};

export default function OrderCard({ order, onUpdate }: OrderCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusInfo = statusConfig[order.status];
  const StatusIcon = statusInfo.icon;
  const priorityInfo = priorityConfig[order.priority] || priorityConfig.NORMAL;

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("ru-RU", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return new Date(dateString).toLocaleDateString("ru-RU");
    }
  };

  const formatCurrency = (amount: number | null, currency: string | null) => {
    if (!amount) return "Не указана";
    const currencySymbol = currency === "RUB" ? "₽" : currency || "₽";
    return new Intl.NumberFormat("ru-RU").format(amount) + " " + currencySymbol;
  };

  return (
    <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden">
      {/* Основная информация */}
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          {/* Левая часть */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 md:w-12 md:h-12 rounded-lg ${statusInfo.bgColor} flex items-center justify-center flex-shrink-0`}>
                <StatusIcon className={`w-5 h-5 md:w-6 md:h-6 ${statusInfo.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg md:text-xl font-semibold text-white mb-1 truncate">
                  {order.serviceName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-sm">
                  <span className={`px-2 py-1 rounded-md ${statusInfo.bgColor} ${statusInfo.color} font-medium`}>
                    {statusInfo.label}
                  </span>
                  <span className={`px-2 py-1 rounded-md bg-white/5 text-white/60 ${priorityInfo.color}`}>
                    {priorityInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Описание (если есть) */}
            {order.description && (
              <p className="text-white/70 text-sm md:text-base line-clamp-2">
                {order.description}
              </p>
            )}

            {/* Дополнительная информация */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-white/60">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(order.createdAt)}</span>
              </div>
              {order.amount && (
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(order.amount, order.currency)}</span>
                </div>
              )}
              {order.documents.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  <span>{order.documents.length} документ(ов)</span>
                </div>
              )}
            </div>
          </div>

          {/* Правая часть - кнопка раскрытия */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors flex-shrink-0"
            aria-label={isExpanded ? "Свернуть" : "Развернуть"}
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Раскрытая информация */}
      {isExpanded && (
        <div className="border-t border-white/10 p-4 md:p-6 space-y-4 bg-white/5">
          {/* Полное описание */}
          {order.description && (
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2">Описание:</h4>
              <p className="text-white/80 text-sm md:text-base">{order.description}</p>
            </div>
          )}

          {/* Документы */}
          {order.documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Документы ({order.documents.length}):
              </h4>
              <div className="space-y-2">
                {order.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10"
                  >
                    <FileText className="w-4 h-4 text-white/60" />
                    <span className="text-sm text-white/80 flex-1">{doc.name}</span>
                    <span className="text-xs text-white/50">
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Даты */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-white/10">
            <div>
              <p className="text-xs text-white/50 mb-1">Создан:</p>
              <p className="text-sm text-white/80">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-white/50 mb-1">Обновлен:</p>
              <p className="text-sm text-white/80">{formatDate(order.updatedAt)}</p>
            </div>
            {order.completedAt && (
              <div>
                <p className="text-xs text-white/50 mb-1">Завершен:</p>
                <p className="text-sm text-white/80">{formatDate(order.completedAt)}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

