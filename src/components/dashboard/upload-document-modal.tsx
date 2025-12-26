"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileText, Package, AlertCircle, Loader2, Save, File } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Drawer } from "vaul";

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface Order {
  id: string;
  serviceName: string;
  status: string;
}

export default function UploadDocumentModal({ isOpen, onClose, onSuccess }: UploadDocumentModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "" as "" | "invoice" | "contract" | "report" | "other",
    orderId: "" as string | "",
  });

  // Загружаем список заказов при открытии модального окна
  useEffect(() => {
    if (isOpen) {
      fetchOrders();
    }
  }, [isOpen]);

  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const response = await fetch("/api/orders");
      const data = await response.json();
      
      if (response.ok) {
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Валидация размера (50MB)
      const maxSize = 50 * 1024 * 1024;
      if (file.size > maxSize) {
        setError("Размер файла превышает 50MB");
        return;
      }
      
      setSelectedFile(file);
      // Автоматически заполняем название, если оно пустое
      if (!formData.name) {
        setFormData((prev) => ({ ...prev, name: file.name }));
      }
      setError(null);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Выберите файл для загрузки");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append("file", selectedFile);
      uploadFormData.append("name", formData.name || selectedFile.name);
      if (formData.description) {
        uploadFormData.append("description", formData.description);
      }
      if (formData.category) {
        uploadFormData.append("category", formData.category);
      }
      if (formData.orderId) {
        uploadFormData.append("orderId", formData.orderId);
      }

      const response = await fetch("/api/documents", {
        method: "POST",
        body: uploadFormData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при загрузке документа");
      }

      // Сбрасываем форму
      setFormData({
        name: "",
        description: "",
        category: "",
        orderId: "",
      });
      setSelectedFile(null);
      
      // Сбрасываем input файла
      const fileInput = document.getElementById("file-input") as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }

      onSuccess();
    } catch (err) {
      console.error("Upload document error:", err);
      setError(err instanceof Error ? err.message : "Ошибка при загрузке документа");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const modalContent = (
    <>
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
            <Upload className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">Загрузить документ</h2>
            <p className="text-white/60 text-sm">Добавьте новый документ в вашу библиотеку</p>
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
        {/* Выбор файла */}
        <div>
          <label htmlFor="file-input" className="block text-sm font-medium text-white/70 mb-2">
            Файл <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              required
              className="hidden"
            />
            <label
              htmlFor="file-input"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/20 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
            >
              {selectedFile ? (
                <div className="flex flex-col items-center gap-2 p-4">
                  <File className="w-8 h-8 text-purple-400" />
                  <div className="text-center">
                    <p className="text-white font-medium text-sm truncate max-w-xs">
                      {selectedFile.name}
                    </p>
                    <p className="text-white/60 text-xs mt-1">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      const fileInput = document.getElementById("file-input") as HTMLInputElement;
                      if (fileInput) {
                        fileInput.value = "";
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Удалить файл
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-white/40" />
                  <p className="text-white/70 text-sm">
                    <span className="text-purple-400">Нажмите для выбора</span> или перетащите файл
                  </p>
                  <p className="text-white/50 text-xs">Максимальный размер: 50MB</p>
                </div>
              )}
            </label>
          </div>
        </div>

        {/* Название документа */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-2">
            Название документа <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
              placeholder="Введите название документа"
            />
          </div>
        </div>

        {/* Описание */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-white/70 mb-2">
            Описание
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors resize-none"
            placeholder="Добавьте описание документа (опционально)"
          />
        </div>

        {/* Категория и заказ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Категория */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white/70 mb-2">
              Категория
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
            >
              <option value="" className="bg-[#0A0A0A]">Не выбрано</option>
              <option value="invoice" className="bg-[#0A0A0A]">Счет</option>
              <option value="contract" className="bg-[#0A0A0A]">Договор</option>
              <option value="report" className="bg-[#0A0A0A]">Отчет</option>
              <option value="other" className="bg-[#0A0A0A]">Прочее</option>
            </select>
          </div>

          {/* Привязка к заказу */}
          <div>
            <label htmlFor="orderId" className="block text-sm font-medium text-white/70 mb-2">
              Привязать к заказу
            </label>
            {isLoadingOrders ? (
              <div className="flex items-center justify-center px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg">
                <Loader2 className="w-4 h-4 text-white/60 animate-spin" />
              </div>
            ) : (
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  id="orderId"
                  name="orderId"
                  value={formData.orderId}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-colors"
                >
                  <option value="" className="bg-[#0A0A0A]">Не привязывать</option>
                  {orders.map((order) => (
                    <option key={order.id} value={order.id} className="bg-[#0A0A0A]">
                      {order.serviceName}
                    </option>
                  ))}
                </select>
              </div>
            )}
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
            disabled={isSubmitting || !selectedFile}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Загрузка...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Загрузить документ
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
            <Drawer.Title className="sr-only">Загрузить документ</Drawer.Title>
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


