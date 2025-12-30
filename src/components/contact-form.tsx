"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface ContactFormProps {
  service?: string;
  onSuccess?: () => void;
  className?: string;
}

export default function ContactForm({ service, onSuccess, className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          service,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка отправки");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      onSuccess?.();

      // Сбросить статус через 5 секунд
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Заявка отправлена!
        </h3>
        <p className="text-white/70">
          Мы свяжемся с вами в ближайшее время
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {status === "error" && (
        <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="contact-name" className="block text-sm font-medium text-white/70 mb-1">
          Имя *
        </label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          minLength={2}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="Ваше имя"
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-sm font-medium text-white/70 mb-1">
          Email *
        </label>
        <input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="email@example.com"
        />
      </div>

      <div>
        <label htmlFor="contact-phone" className="block text-sm font-medium text-white/70 mb-1">
          Телефон
        </label>
        <input
          id="contact-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-sm font-medium text-white/70 mb-1">
          Сообщение *
        </label>
        <textarea
          id="contact-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          minLength={10}
          rows={4}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          placeholder="Опишите вашу задачу или вопрос..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Отправка...
          </>
        ) : (
          <>
            <Send className="w-5 h-5" />
            Отправить заявку
          </>
        )}
      </button>

      <p className="text-xs text-white/50 text-center">
        Нажимая кнопку, вы соглашаетесь с политикой конфиденциальности
      </p>
    </form>
  );
}
