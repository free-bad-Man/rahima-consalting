"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Filter, Loader2, AlertCircle, Download, Trash2, Eye } from "lucide-react";
import DocumentCard from "./document-card";
import UploadDocumentModal from "./upload-document-modal";

interface Document {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  category: string | null;
  description: string | null;
  createdAt: string;
  order: {
    id: string;
    serviceName: string;
    status: string;
  } | null;
}

export default function DocumentsList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | "ALL">("ALL");
  const [selectedOrderId, setSelectedOrderId] = useState<string | "ALL">("ALL");
  const [showUploadModal, setShowUploadModal] = useState(false);

  const fetchDocuments = async (category?: string, orderId?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category && category !== "ALL") {
        params.append("category", category);
      }
      if (orderId && orderId !== "ALL") {
        params.append("orderId", orderId);
      }

      const url = params.toString() 
        ? `/api/documents?${params.toString()}`
        : "/api/documents";
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка при загрузке документов");
      }

      setDocuments(data.documents || []);
    } catch (err) {
      console.error("Fetch documents error:", err);
      setError(err instanceof Error ? err.message : "Ошибка при загрузке документов");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(
      selectedCategory !== "ALL" ? selectedCategory : undefined,
      selectedOrderId !== "ALL" ? selectedOrderId : undefined
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedOrderId]);

  const handleDocumentUploaded = () => {
    setShowUploadModal(false);
    fetchDocuments(
      selectedCategory !== "ALL" ? selectedCategory : undefined,
      selectedOrderId !== "ALL" ? selectedOrderId : undefined
    );
  };

  const handleDocumentDeleted = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
  };

  const categories = ["ALL", "invoice", "contract", "report", "other"] as const;
  const categoryLabels: Record<string, string> = {
    ALL: "Все категории",
    invoice: "Счета",
    contract: "Договоры",
    report: "Отчеты",
    other: "Прочее",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Панель управления */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Фильтры */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-5 h-5 text-white/60" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#0A0A0A]">
                {categoryLabels[cat]}
              </option>
            ))}
          </select>
        </div>

        {/* Кнопка загрузки */}
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
        >
          <Upload className="w-5 h-5" />
          <span>Загрузить документ</span>
        </button>
      </div>

      {/* Состояния загрузки и ошибок */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <Loader2 className="w-8 h-8 md:w-12 md:h-12 text-purple-400 animate-spin mb-4" />
          <p className="text-white/60">Загрузка документов...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 md:py-16">
          <AlertCircle className="w-8 h-8 md:w-12 md:h-12 text-red-400 mb-4" />
          <p className="text-white/60 mb-4">{error}</p>
          <button
            onClick={() => fetchDocuments(
              selectedCategory !== "ALL" ? selectedCategory : undefined,
              selectedOrderId !== "ALL" ? selectedOrderId : undefined
            )}
            className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      )}

      {/* Список документов */}
      {!isLoading && !error && (
        <>
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 md:py-16 rounded-xl md:rounded-2xl border border-white/10 bg-white/5">
              <FileText className="w-12 h-12 md:w-16 md:h-16 text-white/20 mb-4" />
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                У вас пока нет документов
              </h3>
              <p className="text-white/60 text-sm md:text-base mb-6 text-center">
                Загрузите первый документ
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
              >
                <Upload className="w-5 h-5" />
                Загрузить документ
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {documents.map((document) => (
                <DocumentCard
                  key={document.id}
                  document={document}
                  onDelete={handleDocumentDeleted}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Модальное окно загрузки */}
      {showUploadModal && (
        <UploadDocumentModal
          isOpen={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleDocumentUploaded}
        />
      )}
    </div>
  );
}
