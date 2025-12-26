"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Package, FileText, DollarSign, AlertCircle, Loader2, Save, ChevronDown } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer } from "vaul";
import { SERVICES_LIST } from "@/lib/services";

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    serviceName: "",
    description: "",
    priority: "NORMAL" as "LOW" | "NORMAL" | "HIGH" | "URGENT",
    amount: "",
    currency: "RUB",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          amount: formData.amount ? parseFloat(formData.amount) : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при создании заказа");
      }

      // Сбрасываем форму
      setFormData({
        serviceName: "",
        description: "",
        priority: "NORMAL",
        amount: "",
        currency: "RUB",
      });

      onSuccess();
    } catch (err) {
      console.error("Create order error:", err);
      setError(err instanceof Error ? err.message : "Ошибка при создании заказа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Новый заказ</h2>
            <p className="text-white/60 text-sm">Создайте заявку на услугу</p>
          </div>
        </div>
        {!isMobile && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Сообщение об ошибке */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Форма */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Название услуги */}
        <div>
          <label htmlFor="serviceName" className="block text-sm font-medium text-white/70 mb-2">
            Название услуги <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none z-10" />
            <select
              id="serviceName"
              name="serviceName"
              value={formData.serviceName}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors appearance-none cursor-pointer"
            >
              <option value="" className="bg-[#0A0A0A] text-white/30">
                Выберите услугу...
              </option>
              {SERVICES_LIST.map((service) => (
                <option key={service} value={service} className="bg-[#0A0A0A] text-white">
                  {service}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
          </div>
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-2">
            Описание
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-white/40" />
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors resize-none"
              placeholder="Опишите детали заказа или ваши требования..."
            />
          </div>
        </div>

        {/* Приоритет и стоимость */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Приоритет */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-white/70 mb-2">
              Приоритет
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
            >
              <option value="LOW" className="bg-[#0A0A0A]">Низкий</option>
              <option value="NORMAL" className="bg-[#0A0A0A]">Обычный</option>
              <option value="HIGH" className="bg-[#0A0A0A]">Высокий</option>
              <option value="URGENT" className="bg-[#0A0A0A]">Срочный</option>
            </select>
          </div>

          {/* Валюта */}
          <div>
            <label htmlFor="currency" className="block text-sm font-medium text-white/70 mb-2">
              Валюта
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
            >
              <option value="RUB" className="bg-[#0A0A0A]">RUB (₽)</option>
              <option value="USD" className="bg-[#0A0A0A]">USD ($)</option>
              <option value="EUR" className="bg-[#0A0A0A]">EUR (€)</option>
            </select>
          </div>
        </div>

        {/* Стоимость */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-white/70 mb-2">
            Предполагаемая стоимость (опционально)
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Создать заказ
              </>
            )}
          </button>
        </div>
      </form>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex flex-col rounded-t-2xl bg-[#0A0A0A]/95 border-t border-white/10 max-h-[90vh]">
            <Drawer.Title className="sr-only">Создать новый заказ</Drawer.Title>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-4 mt-3" />
            <div className="px-4 py-4 overflow-y-auto">
              {modalContent}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-2 md:inset-4 z-[101] overflow-hidden bg-[#0A0A0A]/95 border border-white/10 rounded-2xl md:rounded-3xl max-w-2xl mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full overflow-y-auto">
              <div className="p-6 md:p-8">
                {modalContent}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


