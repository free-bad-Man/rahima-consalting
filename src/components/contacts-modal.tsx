"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Mail, MapPin, Phone, Twitter, Instagram, Send, Loader2, CheckCircle, AlertCircle, type LucideIcon } from "lucide-react";
import VKIcon from "@/components/icons/vk-icon";
import TelegramIcon from "@/components/icons/telegram-icon";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/use-media-query";

// Динамическая загрузка карты (только на клиенте)
const YandexMap = dynamic(() => import("@/components/yandex-map"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-lg overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center">
      <p className="text-white/50 text-sm">Загрузка карты...</p>
    </div>
  ),
});

interface ContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_EMAIL = "info@rahima-consulting.ru";
const APP_PHONE = "+7 (978) 998-72-22";
const APP_ADDRESS = "г. Симферополь, ул. имени Мате Залки, д. 1, офис 1";
// Координаты офиса: [широта, долгота] для Яндекс карт
// Координаты для ул. имени Мате Залки, д. 1, Симферополь
const OFFICE_COORDINATES: [number, number] = [44.950534, 34.127276];

export default function ContactsModal({ isOpen, onClose }: ContactsModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const socialLinks = [
    {
      icon: VKIcon,
      href: "https://vk.com/rahimabiz",
      label: "ВКонтакте",
    },
    {
      icon: Twitter,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: TelegramIcon,
      href: "https://t.me/centr_reg",
      label: "Telegram",
    },
    {
      icon: Instagram,
      href: "https://instagram.com",
      label: "Instagram",
    },
  ];

  const modalContent = (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1">
                Наши контакты
              </h2>
              <p className="text-white/70 text-xs md:text-sm">
                Свяжитесь с нами для консультации или получения дополнительной информации
              </p>
            </div>
            {!isMobile && (
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-4 flex-shrink-0"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 py-4 md:py-8">
          {/* Contact Info Grid */}
          <div className="grid md:grid-cols-3 mb-8">
                  <ContactBox
                    icon={Mail}
                    title="Email"
                    description="Мы отвечаем на все письма в течение 24 часов."
                  >
                    <a
                      href={`mailto:${APP_EMAIL}`}
                      className="font-mono text-base font-medium tracking-wide text-white hover:text-purple-400 transition-colors"
                    >
                      {APP_EMAIL}
                    </a>
                    <CopyButton className="size-6" text={APP_EMAIL} />
                  </ContactBox>
                  <ContactBox
                    icon={MapPin}
                    title="Офис"
                    description="Приходите в наш офис для консультации."
                  >
                    <span className="font-mono text-base font-medium tracking-wide text-white">
                      {APP_ADDRESS}
                    </span>
                  </ContactBox>
                  <ContactBox
                    icon={Phone}
                    title="Телефон"
                    description="Мы доступны Пн-Пт, с 9:00 до 18:00."
                    className="border-b-0 md:border-r-0"
                  >
                    <div className="flex items-center gap-x-2">
                      <a
                        href={`tel:${APP_PHONE.replace(/\s/g, "")}`}
                        className="block font-mono text-base font-medium tracking-wide text-white hover:text-purple-400 transition-colors"
                      >
                        {APP_PHONE}
                      </a>
                      <CopyButton className="size-6" text={APP_PHONE} />
                    </div>
                  </ContactBox>
          </div>

          {/* Яндекс Карта */}
          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              Как нас найти
            </h3>
            <YandexMap
              address={APP_ADDRESS}
              center={OFFICE_COORDINATES}
              zoom={16}
              height="400px"
            />
            <p className="text-white/50 text-xs mt-2">
              {APP_ADDRESS}
            </p>
          </div>

          {/* Форма обратной связи */}
          <div className="mb-8">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Send className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              Оставить заявку
            </h3>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <ContactFormInline onSuccess={onClose} />
            </div>
          </div>

          {/* Social Links */}
          <div className="relative flex h-full min-h-[200px] items-center justify-center">
            <div
              className={cn(
                "z-[-10] absolute inset-0 size-full",
                "bg-[radial-gradient(color-mix(in_oklab,var(--foreground)30%,transparent)_1px,transparent_1px)]",
                "bg-[size:32px_32px]",
                "opacity-20"
              )}
            />

            <div className="relative z-10 space-y-6">
              <h2 className="text-center text-xl md:text-3xl lg:text-4xl font-bold text-white">
                Найдите нас в соцсетях
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {socialLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/10 hover:bg-white/20 flex items-center gap-x-2 rounded-full border border-white/20 px-4 py-2 text-white transition-colors"
                    >
                      <Icon className="size-4" />
                      <span className="font-mono text-sm font-medium tracking-wide">
                        {link.label}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex flex-col rounded-t-2xl bg-[#0A0A0A]/95 border-t border-white/10 max-h-[90vh]">
            {/* Скрытый заголовок для доступности (только для screen readers) */}
            <Drawer.Title className="sr-only">Наши контакты</Drawer.Title>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-4 mt-3" />
            {modalContent}
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
            className="fixed inset-2 md:inset-4 z-[101] overflow-hidden bg-[#0A0A0A]/85 border border-white/10 rounded-2xl md:rounded-3xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type ContactBoxProps = React.ComponentProps<"div"> & {
  icon: LucideIcon;
  title: string;
  description: string;
};

function ContactBox({
  title,
  description,
  className,
  children,
  icon: Icon,
  ...props
}: ContactBoxProps) {
  return (
    <div
      className={cn(
        "flex flex-col justify-between border-b border-white/10 md:border-r md:border-b-0",
        className
      )}
    >
      <div className="bg-white/5 flex items-center gap-x-3 border-b border-white/10 p-4">
        <Icon className="text-purple-400 size-5" strokeWidth={1} />
        <h2 className="font-heading text-lg font-medium tracking-wider text-white">
          {title}
        </h2>
      </div>
      <div className="flex items-center gap-x-2 p-4 py-12">{children}</div>
      <div className="border-t border-white/10 p-4">
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </div>
  );
}

type CopyButtonProps = ButtonProps & {
  text: string;
};

function CopyButton({
  className,
  variant = "ghost",
  size = "icon",
  text,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={cn("disabled:opacity-100 text-white/60 hover:text-white relative", className)}
      onClick={handleCopy}
      aria-label={copied ? "Скопировано" : "Копировать в буфер обмена"}
      disabled={copied || props.disabled}
      {...props}
    >
      <div
        className={cn(
          "transition-all absolute inset-0 flex items-center justify-center",
          copied ? "scale-100 opacity-100" : "scale-0 opacity-0"
        )}
      >
        <Check className="size-3.5 stroke-emerald-500" aria-hidden="true" />
      </div>
      <div
        className={cn(
          "transition-all",
          copied ? "scale-0 opacity-0" : "scale-100 opacity-100"
        )}
      >
        <Copy aria-hidden="true" className="size-3.5" />
      </div>
    </Button>
  );
}

// Форма обратной связи с интеграцией n8n
interface ContactFormInlineProps {
  onSuccess?: () => void;
}

function ContactFormInline({ onSuccess }: ContactFormInlineProps) {
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
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка отправки");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
      
      // Закрыть модалку через 2 секунды после успеха
      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Произошла ошибка");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-8">
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
    <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
      {status === "error" && (
        <div className="md:col-span-2 flex items-center gap-2 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {errorMessage}
        </div>
      )}

      <div>
        <label htmlFor="inline-name" className="block text-sm font-medium text-white/70 mb-1">
          Имя *
        </label>
        <input
          id="inline-name"
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
        <label htmlFor="inline-email" className="block text-sm font-medium text-white/70 mb-1">
          Email *
        </label>
        <input
          id="inline-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="email@example.com"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="inline-phone" className="block text-sm font-medium text-white/70 mb-1">
          Телефон
        </label>
        <input
          id="inline-phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          placeholder="+7 (___) ___-__-__"
        />
      </div>

      <div className="md:col-span-2">
        <label htmlFor="inline-message" className="block text-sm font-medium text-white/70 mb-1">
          Сообщение *
        </label>
        <textarea
          id="inline-message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          required
          minLength={10}
          rows={3}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
          placeholder="Опишите вашу задачу или вопрос..."
        />
      </div>

      <div className="md:col-span-2">
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
      </div>
    </form>
  );
}

