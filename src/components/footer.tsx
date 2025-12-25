"use client";

import { useState, Suspense } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Mail, Phone, Github, Twitter, Linkedin, Instagram, MessageCircle } from "lucide-react";

const APP_EMAIL = "info@rahima-consulting.ru";
const APP_PHONE = "+7 (978) 998-72-22";

// Динамическая загрузка чат-помощника
const AIChatAssistant = dynamic(() => import("@/components/ai-chat-assistant"), {
  ssr: false,
});

const socialLinks = [
  {
    icon: Github,
    href: "https://github.com",
    label: "GitHub",
  },
  {
    icon: Twitter,
    href: "https://twitter.com",
    label: "Twitter",
  },
  {
    icon: Linkedin,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
  {
    icon: Instagram,
    href: "https://instagram.com",
    label: "Instagram",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-40 px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl md:rounded-2xl bg-black/75 backdrop-blur-sm border border-white/10 px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 md:gap-6">
              {/* Блок 1: Контакты (слева) - скрыт на мобильных */}
              <div className="hidden md:flex flex-col items-start gap-1.5 sm:gap-2 w-full md:w-auto">
                <a
                  href={`mailto:${APP_EMAIL}`}
                  className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm hover:text-purple-400 transition-colors break-all"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                  <span className="truncate max-w-[200px] sm:max-w-none">{APP_EMAIL}</span>
                </a>
                <a
                  href={`tel:${APP_PHONE.replace(/\s/g, "")}`}
                  className="flex items-center gap-1.5 sm:gap-2 text-white text-xs sm:text-sm hover:text-purple-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400 flex-shrink-0" />
                  <span>{APP_PHONE}</span>
                </a>
              </div>

              {/* Блок 2: Соц сети + кнопки ИИ + копирайт (по центру) */}
              <div className="flex flex-col items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  {socialLinks.map((link) => {
                    const Icon = link.icon;
                    const isTwitter = link.label === "Twitter";
                    
                    return (
                      <div key={link.label} className="contents">
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
                          aria-label={link.label}
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </a>
                        {/* Кнопка чата между Twitter и LinkedIn - больше остальных */}
                        {isTwitter && (
                          <button
                            type="button"
                            onClick={() => setIsChatOpen(true)}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:scale-110 transition-transform shadow-lg shadow-purple-500/50"
                            aria-label="Открыть чат помощника"
                          >
                            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                <span className="text-white/50 text-[10px] sm:text-xs md:text-sm">
                  © {currentYear} Rahima Consulting
                </span>
              </div>

              {/* Блок 3: Правовая информация (справа) */}
              <div className="flex flex-col items-center md:items-end gap-1.5 sm:gap-2 w-full md:w-auto">
                <Link href="#" className="text-white/70 hover:text-white text-[10px] sm:text-xs md:text-sm transition-colors text-center md:text-right">
                  Политика конфиденциальности
                </Link>
                <Link href="#" className="text-white/70 hover:text-white text-[10px] sm:text-xs md:text-sm transition-colors text-center md:text-right">
                  Условия использования
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Чат помощник */}
      <Suspense fallback={null}>
        <AIChatAssistant isOpen={isChatOpen} onOpenChange={setIsChatOpen} hideButton={true} />
      </Suspense>
    </>
  );
}


