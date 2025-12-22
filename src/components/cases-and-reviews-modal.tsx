"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Building2, Calculator, Briefcase, Zap, TrendingUp, Star, CheckCircle } from "lucide-react";
import { useState } from "react";
import { TestimonialCarousel, TestimonialData } from "@/components/ui/testimonial";

interface CasesAndReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "cases" | "reviews";

export default function CasesAndReviewsModal({ isOpen, onClose }: CasesAndReviewsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("cases");

  const cases = [
    {
      id: 1,
      title: "Постановка учета с нуля для сети кофеен",
      category: "Бухгалтерия",
      icon: Calculator,
      problem: "Сеть из 5 кофеен без налаженного бухгалтерского учета. Руководитель тратил много времени на финансовые вопросы.",
      solution: "Разработали учетную политику, настроили документооборот, обучили сотрудников, внедрили облачную систему учета.",
      results: [
        "Снижение времени на финансовые вопросы на 80%",
        "Соблюдение всех сроков сдачи отчетности",
        "Оптимизация налоговой нагрузки на 25%",
      ],
      duration: "2 месяца",
      company: "Сеть кофеен",
    },
    {
      id: 2,
      title: "Автоматизация отдела продаж в IT-компании",
      category: "Автоматизация",
      icon: Zap,
      problem: "IT-компания с растущим отделом продаж не могла отслеживать эффективность менеджеров и конверсию по воронке.",
      solution: "Внедрили amoCRM, настроили воронку продаж, интегрировали с телефонией и мессенджерами, создали дашборды для руководителя.",
      results: [
        "Увеличение конверсии на 35%",
        "Сокращение времени на ввод данных на 60%",
        "Прозрачность воронки продаж",
      ],
      duration: "1.5 месяца",
      company: "IT-компания",
    },
    {
      id: 3,
      title: "Восстановление учета после смены бухгалтера",
      category: "Бухгалтерия",
      icon: Calculator,
      problem: "Компания осталась без бухгалтера на 3 месяца, учет не велся, отчетность не сдавалась, накопились долги по налогам.",
      solution: "Провели полный аудит, восстановили первичные документы, свершили с контрагентами, восстановили учет за 3 месяца, сдали все просроченные отчеты.",
      results: [
        "Восстановлен учет за 3 месяца",
        "Сдана вся просроченная отчетность",
        "Минимизированы штрафы и пени",
      ],
      duration: "3 месяца",
      company: "Производственная компания",
    },
    {
      id: 4,
      title: "Регистрация ООО и настройка бухгалтерии",
      category: "Регистрация бизнеса",
      icon: Building2,
      problem: "Новый бизнес нуждался в регистрации ООО и одновременной настройке всей системы учета.",
      solution: "Зарегистрировали ООО под ключ, получили юридический адрес, настроили учетную политику, выбрали оптимальную систему налогообложения.",
      results: [
        "Регистрация ООО за 5 рабочих дней",
        "Готовая система учета с первого дня",
        "Экономия времени и средств",
      ],
      duration: "2 недели",
      company: "Стартап",
    },
    {
      id: 5,
      title: "Участие в госзакупках для производственной компании",
      category: "Юридическое сопровождение",
      icon: Briefcase,
      problem: "Производственная компания хотела участвовать в госзакупках, но не имела опыта и боялась ошибок в документации.",
      solution: "Подготовили всю необходимую документацию, обучили сотрудников, сопроводили первые 5 тендеров, помогли выиграть 3 из них.",
      results: [
        "Выиграно 3 тендера из 5",
        "Объем закупок на 15 млн рублей",
        "Новый канал продаж",
      ],
      duration: "4 месяца",
      company: "Производственная компания",
    },
    {
      id: 6,
      title: "Маркетинговая стратегия для e-commerce",
      category: "Маркетинг",
      icon: TrendingUp,
      problem: "Интернет-магазин тратил много на рекламу, но конверсия была низкой, а стоимость привлечения клиента высокой.",
      solution: "Провели аудит рекламных кампаний, разработали новую маркетинговую стратегию, настроили сквозную аналитику, оптимизировали воронку продаж.",
      results: [
        "Снижение стоимости привлечения на 40%",
        "Увеличение конверсии на 28%",
        "ROI рекламы вырос в 2 раза",
      ],
      duration: "2 месяца",
      company: "E-commerce компания",
    },
  ];

  const testimonials: TestimonialData[] = [
    {
      id: 1,
      name: "Александр Петров",
      role: "Директор сети кофеен",
      accent: "#8b5cf6",
      quote: "Работаем с компанией уже год. Благодаря их помощи смог полностью сосредоточиться на развитии бизнеса, а не на бухгалтерии. Все отчеты сдаются вовремя, никаких штрафов. Очень доволен качеством работы!",
    },
    {
      id: 2,
      name: "Мария Иванова",
      role: "Основатель IT-стартапа",
      accent: "#3b82f6",
      quote: "Внедрили amoCRM буквально за месяц. Команда очень профессиональная, всё настроили под наши процессы, обучили сотрудников. Конверсия в продажах выросла значительно. Рекомендую!",
    },
    {
      id: 3,
      name: "Дмитрий Соколов",
      role: "Генеральный директор",
      accent: "#10b981",
      quote: "Спасли нашу компанию от огромных штрафов. Восстановили учет за несколько месяцев, разобрались со всеми проблемами. Очень благодарен за профессионализм и оперативность.",
    },
    {
      id: 4,
      name: "Елена Козлова",
      role: "Финансовый директор",
      accent: "#f59e0b",
      quote: "Работаем уже второй год. Всегда на связи, быстро реагируют на вопросы, консультации очень полезные. Наша бухгалтерия теперь работает как часы. Спасибо команде!",
    },
    {
      id: 5,
      name: "Сергей Волков",
      role: "Владелец производственной компании",
      accent: "#ef4444",
      quote: "Помогли выиграть первые госзакупки. Без их помощи не справились бы - слишком сложная документация. Теперь регулярно участвуем в тендерах и выигрываем. Отличная работа!",
    },
    {
      id: 6,
      name: "Анна Морозова",
      role: "Маркетинг-директор",
      accent: "#ec4899",
      quote: "Разработали маркетинговую стратегию, которая реально работает. Конверсия выросла, расходы на рекламу снизились. Получили именно то, что нужно было бизнесу. Спасибо!",
    },
  ];

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
            className="fixed inset-4 z-[101] overflow-hidden bg-[#0A0A0A]/85 border border-white/10 rounded-3xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-white/10">
              <div className="container mx-auto px-6 md:px-12 lg:px-20 py-3">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="text-xl md:text-2xl font-semibold text-white mb-1">
                      Кейсы и отзывы
                    </h2>
                    <p className="text-white/70 text-xs md:text-sm">
                      Реальные примеры нашей работы и отзывы клиентов
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-4 flex-shrink-0"
                    aria-label="Закрыть"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-white/10">
                  <button
                    onClick={() => setActiveTab("cases")}
                    className={`px-4 py-2 text-xs md:text-sm font-medium transition-colors relative ${
                      activeTab === "cases"
                        ? "text-white"
                        : "text-white/60 hover:text-white/80"
                    }`}
                  >
                    Наши кейсы
                    {activeTab === "cases" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`px-4 py-2 text-xs md:text-sm font-medium transition-colors relative ${
                      activeTab === "reviews"
                        ? "text-white"
                        : "text-white/60 hover:text-white/80"
                    }`}
                  >
                    Отзывы
                    {activeTab === "reviews" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="container mx-auto px-6 md:px-12 lg:px-20 py-8">
                {/* Content */}
                <AnimatePresence mode="wait">
                  {activeTab === "cases" && (
                    <motion.div
                      key="cases"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="grid md:grid-cols-2 gap-6">
                        {cases.map((caseItem) => {
                          const Icon = caseItem.icon;
                          return (
                            <motion.div
                              key={caseItem.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                              className="p-6 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
                            >
                              <div className="flex items-start gap-4 mb-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center">
                                  <Icon className="h-6 w-6 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                  <span className="inline-block px-3 py-1 text-xs font-medium text-purple-300 bg-purple-500/20 rounded-full mb-2">
                                    {caseItem.category}
                                  </span>
                                  <h3 className="text-lg font-semibold text-white mb-2">
                                    {caseItem.title}
                                  </h3>
                                  <p className="text-xs text-white/50">
                                    {caseItem.company} • {caseItem.duration}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <div>
                                  <h4 className="text-sm font-medium text-white/80 mb-2">
                                    Задача:
                                  </h4>
                                  <p className="text-sm text-white/60">
                                    {caseItem.problem}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-white/80 mb-2">
                                    Решение:
                                  </h4>
                                  <p className="text-sm text-white/60">
                                    {caseItem.solution}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="text-sm font-medium text-white/80 mb-2 flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                    Результаты:
                                  </h4>
                                  <ul className="space-y-2">
                                    {caseItem.results.map((result, idx) => (
                                      <li
                                        key={idx}
                                        className="text-sm text-white/60 flex items-start gap-2"
                                      >
                                        <span className="text-purple-400 mt-1">
                                          •
                                        </span>
                                        <span>{result}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "reviews" && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="max-w-4xl mx-auto"
                    >
                      <TestimonialCarousel
                        items={testimonials}
                        variant="card"
                        autoplay={true}
                        autoplayMs={6000}
                        loop={true}
                        className="bg-white/10 border-white/20 ring-white/20"
                        nameClassName="text-white"
                        roleClassName="text-purple-300"
                        quoteClassName="text-white/80"
                        cardClassName="px-4 py-3"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

