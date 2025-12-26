"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, FileText } from "lucide-react";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/use-media-query";

interface TermsOfUseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_EMAIL = "info@rahima-consulting.ru";
const APP_PHONE = "+7 (978) 998-72-22";

export default function TermsOfUseModal({ isOpen, onClose }: TermsOfUseModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const modalContent = (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
                Условия использования
              </h2>
              <p className="text-white/70 text-xs md:text-sm">
                Rahima Consulting
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
          <div className="max-w-4xl mx-auto">
            {/* Заголовок */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2">
                Пользовательское соглашение (Условия использования)
              </h1>
              <p className="text-white/60 text-sm md:text-base">
                Дата вступления в силу: 26 декабря 2025 года
              </p>
            </div>

            {/* Вступление */}
            <div className="mb-6 md:mb-8">
              <p className="text-sm md:text-base leading-relaxed text-white/80">
                Добро пожаловать на сайт компании Rahima Consulting. Пользуясь нашим ресурсом, вы соглашаетесь с нижеизложенными условиями. Пожалуйста, внимательно ознакомьтесь с ними.
              </p>
            </div>

            {/* Содержание */}
            <div className="space-y-6 md:space-y-8 text-white/90">
              {/* Раздел 1 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">1.</span>
                  Общие положения
                </h2>
                <div className="space-y-2 md:space-y-3">
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">1.1.</span> Настоящее Соглашение регулирует отношения между Rahima Consulting (далее — «Компания») и пользователем сети Интернет (далее — «Пользователь») по использованию материалов и сервисов сайта.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">1.2.</span> Сайт является информационным ресурсом, предоставляющим сведения об услугах Компании в сфере консалтинга.
                  </p>
                </div>
              </section>

              {/* Раздел 2 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">2.</span>
                  Интеллектуальная собственность
                </h2>
                <div className="space-y-2 md:space-y-3">
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">2.1.</span> Весь контент сайта (тексты, графические изображения, логотипы, методики, аналитические материалы и видео) является интеллектуальной собственностью Rahima Consulting или используется на законных основаниях.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">2.2.</span> Копирование, распространение или цитирование материалов сайта в коммерческих целях без письменного разрешения Компании запрещено. При цитировании в некоммерческих целях ссылка на источник обязательна.
                  </p>
                </div>
              </section>

              {/* Раздел 3 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">3.</span>
                  Отказ от ответственности (Дисклеймер)
                </h2>
                <div className="space-y-2 md:space-y-3">
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">3.1.</span> Информация, размещенная на сайте (статьи, кейсы, советы), носит исключительно ознакомительный характер и не является прямой юридической или финансовой консультацией.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">3.2.</span> Rahima Consulting не несет ответственности за любые убытки (прямые или косвенные), возникшие в результате использования информации с данного сайта без заключения официального договора на оказание услуг.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">3.3.</span> Мы прилагаем все усилия для обеспечения точности данных, но не гарантируем отсутствие технических ошибок или актуальность старых публикаций на текущий момент.
                  </p>
                </div>
              </section>

              {/* Раздел 4 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">4.</span>
                  Правила использования сайта
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-3">
                  Пользователь обязуется:
                </p>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Не использовать сайт для распространения спама или вредоносного ПО.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Не предпринимать действий, направленных на нарушение нормальной работы серверов Компании.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Предоставлять достоверные контактные данные при заполнении форм обратной связи.</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 5 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">5.</span>
                  Ссылки на сторонние ресурсы
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80">
                  Наш сайт может содержать ссылки на сторонние веб-сайты. Rahima Consulting не контролирует их содержание и не несет ответственности за их политику конфиденциальности или условия использования.
                </p>
              </section>

              {/* Раздел 6 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">6.</span>
                  Порядок оказания услуг
                </h2>
                <div className="space-y-2 md:space-y-3">
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">6.1.</span> Информация об услугах и ценах на сайте не является публичной офертой, если иное явно не указано в тексте.
                  </p>
                  <p className="text-sm md:text-base leading-relaxed text-white/80">
                    <span className="text-purple-400 font-semibold">6.2.</span> Порядок, сроки и стоимость консалтинговых услуг определяются индивидуально в соответствующих договорах, заключаемых между Компанией и Клиентом.
                  </p>
                </div>
              </section>

              {/* Раздел 7 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">7.</span>
                  Изменение условий
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80">
                  Компания оставляет за собой право изменять настоящее Соглашение в любое время без предварительного уведомления. Новая редакция вступает в силу с момента ее публикации на этой странице.
                </p>
              </section>

              {/* Раздел 8 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">8.</span>
                  Обратная связь
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-4">
                  Если у вас возникли вопросы по данным условиям, пожалуйста, свяжитесь с нами:
                </p>
                <div className="space-y-2 md:space-y-3">
                  <a
                    href={`mailto:${APP_EMAIL}`}
                    className="block text-sm md:text-base text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Email: {APP_EMAIL}
                  </a>
                  <a
                    href={`tel:${APP_PHONE.replace(/\s/g, "")}`}
                    className="block text-sm md:text-base text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Телефон: {APP_PHONE}
                  </a>
                </div>
              </section>
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
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex flex-col rounded-t-2xl bg-[#0A0A0A]/70 border-t border-white/10 max-h-[90vh]">
            <Drawer.Title className="sr-only">Условия использования</Drawer.Title>
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
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-2 md:inset-4 z-[101] overflow-hidden bg-[#0A0A0A]/70 border border-white/10 rounded-2xl md:rounded-3xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {modalContent}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

