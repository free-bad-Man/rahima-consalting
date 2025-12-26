"use client";

import { useState } from "react";
import { 
  FileText, 
  Download, 
  Trash2, 
  Eye,
  Calendar,
  Package,
  File,
  AlertCircle,
  Loader2
} from "lucide-react";

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

interface DocumentCardProps {
  document: Document;
  onDelete: (documentId: string) => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "🖼️";
  if (mimeType.startsWith("video/")) return "🎥";
  if (mimeType.includes("pdf")) return "📄";
  if (mimeType.includes("word") || mimeType.includes("document")) return "📝";
  if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) return "📊";
  if (mimeType.includes("zip") || mimeType.includes("archive")) return "📦";
  return "📎";
};

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

export default function DocumentCard({ document: doc, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/documents/${doc.id}`);
      
      if (!response.ok) {
        throw new Error("Ошибка при скачивании файла");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download error:", error);
      alert("Ошибка при скачивании файла");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Вы уверены, что хотите удалить документ "${doc.name}"?`)) {
      return;
    }

    setIsDeleting(true);
    setDeleteError(null);

    try {
      const response = await fetch(`/api/documents/${doc.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Ошибка при удалении документа");
      }

      onDelete(doc.id);
    } catch (error) {
      console.error("Delete error:", error);
      setDeleteError(error instanceof Error ? error.message : "Ошибка при удалении");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleView = () => {
    // Открываем файл в новой вкладке для просмотра
    window.open(`/api/documents/${doc.id}`, "_blank");
  };

  const canPreview = doc.mimeType.startsWith("image/") || 
                     doc.mimeType.includes("pdf") ||
                     doc.mimeType.includes("text/");

  return (
    <div className="rounded-xl md:rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 overflow-hidden">
      <div className="p-4 md:p-6">
        {/* Заголовок и иконка */}
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0 text-2xl">
            {getFileIcon(doc.mimeType)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-white mb-1 truncate">
              {doc.name}
            </h3>
            <p className="text-sm text-white/60 truncate">
              {doc.fileName}
            </p>
          </div>
        </div>

        {/* Информация о документе */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-white/60">
            <FileText className="w-4 h-4" />
            <span>{formatFileSize(doc.fileSize)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(doc.createdAt)}</span>
          </div>

          {doc.order && (
            <div className="flex items-center gap-2 text-sm text-white/60">
              <Package className="w-4 h-4" />
              <span className="truncate">{doc.order.serviceName}</span>
            </div>
          )}

          {doc.category && (
            <div className="inline-block px-2 py-1 rounded-md bg-purple-500/20 text-purple-400 text-xs font-medium">
              {doc.category}
            </div>
          )}
        </div>

        {/* Описание */}
        {doc.description && (
          <p className="text-sm text-white/70 mb-4 line-clamp-2">
            {doc.description}
          </p>
        )}

        {/* Ошибка удаления */}
        {deleteError && (
          <div className="mb-4 p-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{deleteError}</span>
          </div>
        )}

        {/* Действия */}
        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
          {canPreview && (
            <button
              onClick={handleView}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
              title="Просмотр"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Просмотр</span>
            </button>
          )}
          
          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium transition-all"
            title="Скачать"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Скачать</span>
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Удалить"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
