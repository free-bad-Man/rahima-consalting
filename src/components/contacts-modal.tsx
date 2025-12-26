"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, Mail, MapPin, Phone, Twitter, Instagram, type LucideIcon } from "lucide-react";
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

