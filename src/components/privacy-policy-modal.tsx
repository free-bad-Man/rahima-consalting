"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Shield } from "lucide-react";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/use-media-query";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const APP_EMAIL = "info@rahima-consulting.ru";
const APP_PHONE = "+7 (978) 998-72-22";
const APP_ADDRESS = "г. Симферополь, ул. имени Мате Залки, д. 1, офис 1";

export default function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const modalContent = (
    <>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 py-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h2 className="text-lg md:text-xl lg:text-2xl font-semibold text-white mb-1 flex items-center gap-2">
                <Shield className="h-5 w-5 md:h-6 md:w-6 text-purple-400" />
                Политика конфиденциальности
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
                Политика конфиденциальности Rahima Consulting
              </h1>
              <p className="text-white/60 text-sm md:text-base">
                Последнее обновление: 26 декабря 2025 года
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
                <p className="text-sm md:text-base leading-relaxed text-white/80">
                  Настоящая Политика определяет порядок обработки и защиты персональных данных, которые компания Rahima Consulting (далее — «Компания») получает от пользователей сайта и клиентов при оказании консалтинговых услуг.
                </p>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mt-3">
                  Мы уважаем вашу частную жизнь и обязуемся защищать ваши данные в соответствии с законодательством (ФЗ-152 «О персональных данных»).
                </p>
              </section>

              {/* Раздел 2 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">2.</span>
                  Какие данные мы собираем
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-3">
                  Мы можем собирать следующие категории данных:
                </p>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Личная информация:</strong> ФИО, должность, название компании.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Контактные данные:</strong> номер телефона, адрес электронной почты, ссылки на профили в мессенджерах.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Технические данные:</strong> IP-адрес, тип браузера, файлы cookie (для аналитики посещаемости сайта).</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Деловая информация:</strong> данные, предоставляемые вами в ходе консультаций или через формы обратной связи для оценки вашего проекта.</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 3 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">3.</span>
                  Цели обработки данных
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-3">
                  Rahima Consulting использует данные исключительно для:
                </p>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Связи с вами и ответа на ваши запросы.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Заключения и исполнения договоров на оказание консалтинговых услуг.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Подготовки коммерческих предложений.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Отправки полезных материалов и новостей компании (только с вашего согласия).</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Улучшения работы нашего сайта и сервисов.</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 4 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">4.</span>
                  Правовые основания
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-3">
                  Обработка данных осуществляется на основании:
                </p>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Вашего согласия, предоставленного при заполнении форм на сайте.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Необходимости заключения и исполнения договора (оферты).</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Требований законодательства.</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 5 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">5.</span>
                  Конфиденциальность и безопасность
                </h2>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Профессиональная тайна:</strong> Мы не раскрываем детали ваших бизнес-процессов третьим лицам.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Защита:</strong> Мы используем протоколы шифрования (SSL) и современное ПО для защиты ваших данных от несанкционированного доступа.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span><strong className="text-white">Доступ:</strong> Доступ к данным имеют только сотрудники Rahima Consulting, непосредственно участвующие в реализации вашего проекта.</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 6 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">6.</span>
                  Передача данных третьим лицам
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-3">
                  Мы не продаем и не передаем ваши данные третьим лицам, за исключением случаев:
                </p>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Прямого требования законодательства.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Использования сервисов рассылок или CRM (в этом случае сервисы выступают обработчиками данных с гарантией безопасности).</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 7 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">7.</span>
                  Сроки хранения
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80">
                  Мы храним данные в течение времени, необходимого для достижения целей, указанных в настоящей Политике, либо до момента вашего отзыва согласия.
                </p>
              </section>

              {/* Раздел 8 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">8.</span>
                  Ваши права
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-3">
                  Вы имеете право:
                </p>
                <ul className="space-y-2 md:space-y-3 ml-4 md:ml-6">
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Запрашивать информацию о том, какие данные о вас у нас хранятся.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Требовать исправления или удаления ваших данных.</span>
                  </li>
                  <li className="text-sm md:text-base leading-relaxed text-white/80 flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Отозвать согласие на обработку данных в любой момент.</span>
                  </li>
                </ul>
              </section>

              {/* Раздел 9 */}
              <section>
                <h2 className="text-xl md:text-2xl font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
                  <span className="text-purple-400">9.</span>
                  Контакты
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-white/80 mb-4">
                  Если у вас есть вопросы или вы хотите отозвать согласие, свяжитесь с нами:
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
                  <p className="text-sm md:text-base text-white/80">
                    Адрес: {APP_ADDRESS}
                  </p>
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
            <Drawer.Title className="sr-only">Политика конфиденциальности</Drawer.Title>
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


