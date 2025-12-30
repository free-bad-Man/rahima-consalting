"use client";

import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import ContactForm from "./contact-form";
import { useEffect, useState } from "react";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  service?: string;
}

export default function ContactModal({ isOpen, onClose, service }: ContactModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[102] bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed z-[103] inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-4xl md:w-full bg-[#0A0A0A]/95 border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <h2 className="text-xl font-semibold text-white">Связаться с нами</h2>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Закрыть"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(100vh-10rem)] md:max-h-[70vh]">
              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Contact Info */}
                <div className="p-6 md:p-8 bg-gradient-to-br from-purple-900/30 to-blue-900/30">
                  <h3 className="text-lg font-medium text-white mb-6">
                    Контактная информация
                  </h3>

                  <div className="space-y-6">
                    <a
                      href="mailto:info@rahima-consulting.ru"
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Email</p>
                        <p className="text-white group-hover:text-purple-300 transition-colors">
                          info@rahima-consulting.ru
                        </p>
                      </div>
                    </a>

                    <a
                      href="tel:+79789987222"
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                        <Phone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Телефон</p>
                        <p className="text-white group-hover:text-purple-300 transition-colors">
                          +7 (978) 998-72-22
                        </p>
                      </div>
                    </a>

                    <a
                      href="https://t.me/centr_reg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-4 group"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Telegram</p>
                        <p className="text-white group-hover:text-purple-300 transition-colors">
                          @centr_reg
                        </p>
                      </div>
                    </a>

                    <div className="flex items-start gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-white/50 text-sm">Адрес</p>
                        <p className="text-white">
                          Россия, Крым
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Social links */}
                  <div className="mt-8 pt-6 border-t border-white/10">
                    <p className="text-white/50 text-sm mb-4">Мы в социальных сетях</p>
                    <div className="flex gap-3">
                      <a
                        href="https://vk.com/rahimabiz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="ВКонтакте"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M12.785 16.241s.287-.029.435-.18c.135-.137.132-.392.132-.392s-.02-1.123.515-1.29c.526-.164 1.2 1.09 1.916 1.571.54.36.95.281.95.281l1.914-.028s1-.062.525-.85c-.039-.065-.277-.58-1.427-1.644-1.207-1.12-1.044-.47.408-1.44.279-.186 1.97-1.726 2.194-2.33.202-.54.144-.78-.144-.78h-1.87s-1.36.08-1.57.515c-.11.23-.86 1.01-1.06 1.216-.193.193-.28.248-.39.082-.11-.166-.84-1.01-1.17-1.36-.237-.28-.334-.39-.47-.4-.135-.01-.234-.01-.234-.01l-1.78.012s-.264.015-.36.12c-.09.1-.01.31-.01.31s.7 1.65 1.5 3.11c.73 1.35.99 1.78.99 2.14 0 .2-.05.3-.15.39-.15.15-.43.18-.43.18h-.91s-1.28.08-1.8-.24c-.4-.25-.71-.72-1.07-1.29-.38-.6-1.34-2.82-1.88-3.87-.13-.26-.26-.36-.35-.36-.09 0-.18-.01-.18-.01l-1.35.01s-.2.01-.27.09c-.07.07-.01.22-.01.22s1.12 2.65 2.38 3.99c1.16 1.23 2.48 1.15 2.48 1.15h.6z" />
                        </svg>
                      </a>
                      <a
                        href="https://t.me/centr_reg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Telegram"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                        </svg>
                      </a>
                      <a
                        href="https://www.instagram.com/reel/DRuRZO6iPMu/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        aria-label="Instagram"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right: Contact Form */}
                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-medium text-white mb-6">
                    Оставить заявку
                    {service && (
                      <span className="block text-sm text-purple-400 font-normal mt-1">
                        Услуга: {service}
                      </span>
                    )}
                  </h3>
                  <ContactForm service={service} onSuccess={onClose} />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}
