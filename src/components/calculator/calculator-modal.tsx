"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Calculator, 
  Building2, 
  FileText, 
  Users, 
  Briefcase,
  Check,
  Sparkles,
  TrendingDown,
  Send,
  Loader2
} from "lucide-react";
import { 
  BusinessType, 
  TaxSystem, 
  BusinessParams, 
  SelectedServices,
  calculateTotalPrice,
  compareWithEmployee,
  ServicePackage
} from "@/lib/pricing-config";

interface CalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialService?: string;
}

// Начальные значения
const initialBusinessParams: BusinessParams = {
  businessType: "ooo",
  taxSystem: "usn6",
  employeesCount: "1-5",
  operationsCount: "20-50",
  hasNds: false,
  hasVed: false,
};

const initialServices: SelectedServices = {
  fullAccounting: true,
  reportingOnly: false,
  payroll: false,
  accountingRecovery: false,
  accountingSetup: false,
  registerIp: false,
  registerOoo: false,
  egrul: false,
  ecp: false,
  liquidation: false,
  legalAddress: false,
  legalSupport: false,
  contracts: false,
  tenders: false,
  legalAudit: false,
  crm: false,
  integrations: false,
  aiAssistant: false,
  dashboards: false,
  smm: false,
  advertising: false,
  marketingStrategy: false,
};

export default function CalculatorModal({ isOpen, onClose, initialService }: CalculatorModalProps) {
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState(1);
  const [businessParams, setBusinessParams] = useState<BusinessParams>(initialBusinessParams);
  const [services, setServices] = useState<SelectedServices>(initialServices);
  const [contactData, setContactData] = useState({ name: "", phone: "", email: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Сброс при открытии
      setStep(1);
      setBusinessParams(initialBusinessParams);
      setServices(initialServices);
      setSubmitted(false);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const result = calculateTotalPrice(businessParams, services);
  const comparison = compareWithEmployee(result.monthly);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          message: `Заявка из калькулятора:\n\nТип бизнеса: ${businessParams.businessType}\nСистема налогообложения: ${businessParams.taxSystem}\nСотрудников: ${businessParams.employeesCount}\nОпераций/мес: ${businessParams.operationsCount}\n\nРасчётная стоимость: ${result.monthly.toLocaleString()} ₽/мес + ${result.oneTime.toLocaleString()} ₽ разово\n\nВыбранные услуги:\n${result.packages.map(p => `- ${p.name}`).join("\n")}`,
          service: "Калькулятор услуг",
        }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            className="fixed inset-0 z-[102] bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed z-[103] inset-2 sm:inset-4 md:inset-6 lg:inset-8 xl:inset-12 bg-[#0A0A0A] border border-white/10 rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex-shrink-0 px-4 md:px-6 py-4 border-b border-white/10 bg-gradient-to-r from-purple-900/30 to-blue-900/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-lg md:text-xl font-semibold text-white">
                      Калькулятор услуг
                    </h2>
                    <p className="text-white/60 text-sm hidden sm:block">
                      Шаг {step} из {totalSteps}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                  aria-label="Закрыть"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              {/* Progress bar */}
              <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <StepBusinessType 
                    key="step1"
                    value={businessParams.businessType}
                    onChange={(v) => setBusinessParams({ ...businessParams, businessType: v })}
                  />
                )}
                {step === 2 && (
                  <StepTaxSystem 
                    key="step2"
                    value={businessParams.taxSystem}
                    onChange={(v) => setBusinessParams({ ...businessParams, taxSystem: v })}
                    businessType={businessParams.businessType}
                  />
                )}
                {step === 3 && (
                  <StepBusinessParams 
                    key="step3"
                    params={businessParams}
                    onChange={setBusinessParams}
                  />
                )}
                {step === 4 && (
                  <StepServices 
                    key="step4"
                    services={services}
                    onChange={setServices}
                    businessType={businessParams.businessType}
                  />
                )}
                {step === 5 && (
                  <StepResult 
                    key="step5"
                    result={result}
                    comparison={comparison}
                    params={businessParams}
                    contactData={contactData}
                    setContactData={setContactData}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    submitted={submitted}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 px-4 md:px-6 py-4 border-t border-white/10 bg-black/50">
              <div className="flex items-center justify-between">
                <button
                  onClick={prevStep}
                  disabled={step === 1}
                  className="flex items-center gap-2 px-4 py-2 text-white/70 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span className="hidden sm:inline">Назад</span>
                </button>
                
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        s === step ? "bg-purple-500" : s < step ? "bg-purple-500/50" : "bg-white/20"
                      }`}
                    />
                  ))}
                </div>

                {step < 5 ? (
                  <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    <span>Далее</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="text-right">
                    <div className="text-white font-semibold text-lg">
                      {result.monthly.toLocaleString()} ₽<span className="text-white/60 text-sm">/мес</span>
                    </div>
                    {result.oneTime > 0 && (
                      <div className="text-white/60 text-sm">
                        + {result.oneTime.toLocaleString()} ₽ разово
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}

// ==================== ШАГ 1: Тип бизнеса ====================
function StepBusinessType({ value, onChange }: { value: BusinessType; onChange: (v: BusinessType) => void }) {
  const options: { id: BusinessType; label: string; description: string; icon: React.ReactNode }[] = [
    { id: "planning", label: "Планирую открыть бизнес", description: "Нужна регистрация и консультация", icon: <Sparkles className="w-6 h-6" /> },
    { id: "ip", label: "ИП", description: "Индивидуальный предприниматель", icon: <Users className="w-6 h-6" /> },
    { id: "ooo", label: "ООО", description: "Общество с ограниченной ответственностью", icon: <Building2 className="w-6 h-6" /> },
    { id: "holding", label: "Несколько компаний", description: "Группа компаний или холдинг", icon: <Briefcase className="w-6 h-6" /> },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Какой у вас бизнес?</h3>
        <p className="text-white/60">Выберите форму вашей организации</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`p-6 rounded-2xl border-2 text-left transition-all ${
              value === opt.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10 hover:border-white/30 bg-white/5"
            }`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
              value === opt.id ? "bg-purple-500 text-white" : "bg-white/10 text-white/70"
            }`}>
              {opt.icon}
            </div>
            <h4 className="text-white font-semibold mb-1">{opt.label}</h4>
            <p className="text-white/60 text-sm">{opt.description}</p>
            {value === opt.id && (
              <div className="mt-3 flex items-center gap-1 text-purple-400 text-sm">
                <Check className="w-4 h-4" /> Выбрано
              </div>
            )}
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ==================== ШАГ 2: Система налогообложения ====================
function StepTaxSystem({ value, onChange, businessType }: { value: TaxSystem; onChange: (v: TaxSystem) => void; businessType: BusinessType }) {
  const options: { id: TaxSystem; label: string; description: string }[] = [
    { id: "usn6", label: "УСН 6% (Доходы)", description: "Упрощённая система, налог с доходов" },
    { id: "usn15", label: "УСН 15% (Доходы-Расходы)", description: "Упрощённая система, налог с прибыли" },
    { id: "osno", label: "ОСНО", description: "Общая система с НДС и налогом на прибыль" },
    { id: "patent", label: "Патент", description: "Только для ИП, фиксированная сумма" },
    { id: "unknown", label: "Не знаю", description: "Нужна консультация по выбору" },
  ];

  // Фильтруем опции для разных типов бизнеса
  const filteredOptions = options.filter(opt => {
    if (businessType === "ooo" || businessType === "holding") {
      return opt.id !== "patent"; // Патент только для ИП
    }
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Система налогообложения</h3>
        <p className="text-white/60">Влияет на объём работы и стоимость услуг</p>
      </div>

      <div className="space-y-3 max-w-xl mx-auto">
        {filteredOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange(opt.id)}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
              value === opt.id
                ? "border-purple-500 bg-purple-500/10"
                : "border-white/10 hover:border-white/30 bg-white/5"
            }`}
          >
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              value === opt.id ? "border-purple-500 bg-purple-500" : "border-white/30"
            }`}>
              {value === opt.id && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <h4 className="text-white font-medium">{opt.label}</h4>
              <p className="text-white/60 text-sm">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ==================== ШАГ 3: Параметры бизнеса ====================
function StepBusinessParams({ params, onChange }: { params: BusinessParams; onChange: (p: BusinessParams) => void }) {
  const employeesOptions = [
    { id: "0", label: "0" },
    { id: "1-5", label: "1-5" },
    { id: "6-15", label: "6-15" },
    { id: "16-50", label: "16-50" },
    { id: "50+", label: "50+" },
  ];

  const operationsOptions = [
    { id: "0-20", label: "до 20" },
    { id: "20-50", label: "20-50" },
    { id: "50-100", label: "50-100" },
    { id: "100-300", label: "100-300" },
    { id: "300+", label: "300+" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-white mb-2">Параметры бизнеса</h3>
        <p className="text-white/60">Расскажите о масштабе вашей деятельности</p>
      </div>

      <div className="max-w-xl mx-auto space-y-8">
        {/* Сотрудники */}
        <div>
          <label className="block text-white font-medium mb-3">
            Количество сотрудников
          </label>
          <div className="flex flex-wrap gap-2">
            {employeesOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange({ ...params, employeesCount: opt.id as BusinessParams["employeesCount"] })}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  params.employeesCount === opt.id
                    ? "border-purple-500 bg-purple-500 text-white"
                    : "border-white/20 text-white/70 hover:border-white/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Операции */}
        <div>
          <label className="block text-white font-medium mb-3">
            Операций в месяц (платежи, документы)
          </label>
          <div className="flex flex-wrap gap-2">
            {operationsOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => onChange({ ...params, operationsCount: opt.id as BusinessParams["operationsCount"] })}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  params.operationsCount === opt.id
                    ? "border-purple-500 bg-purple-500 text-white"
                    : "border-white/20 text-white/70 hover:border-white/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Чекбоксы */}
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div 
              onClick={() => onChange({ ...params, hasNds: !params.hasNds })}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                params.hasNds ? "border-purple-500 bg-purple-500" : "border-white/30 group-hover:border-white/50"
              }`}
            >
              {params.hasNds && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <span className="text-white">Работаете с НДС</span>
              <p className="text-white/50 text-sm">Увеличивает объём документооборота</p>
            </div>
          </label>

          <label className="flex items-center gap-3 cursor-pointer group">
            <div 
              onClick={() => onChange({ ...params, hasVed: !params.hasVed })}
              className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                params.hasVed ? "border-purple-500 bg-purple-500" : "border-white/30 group-hover:border-white/50"
              }`}
            >
              {params.hasVed && <Check className="w-4 h-4 text-white" />}
            </div>
            <div>
              <span className="text-white">ВЭД (импорт/экспорт)</span>
              <p className="text-white/50 text-sm">Внешнеэкономическая деятельность</p>
            </div>
          </label>
        </div>
      </div>
    </motion.div>
  );
}

// ==================== ШАГ 4: Выбор услуг ====================
function StepServices({ services, onChange, businessType }: { services: SelectedServices; onChange: (s: SelectedServices) => void; businessType: BusinessType }) {
  const isPlanning = businessType === "planning";

  const categories = [
    {
      title: "📊 Бухгалтерия",
      items: [
        { key: "fullAccounting", label: "Полное бухгалтерское сопровождение", description: "Ведение учёта, расчёт налогов, сдача отчётности" },
        { key: "reportingOnly", label: "Только сдача отчётности", description: "Если ведёте учёт сами" },
        { key: "payroll", label: "Кадровый учёт и зарплата", description: "Расчёт зарплаты и кадровое делопроизводство" },
        { key: "accountingSetup", label: "Постановка учёта с нуля", description: "Для нового бизнеса" },
        { key: "accountingRecovery", label: "Восстановление учёта", description: "Если были пробелы в ведении" },
      ],
    },
    {
      title: "📝 Регистрация",
      items: [
        { key: "registerIp", label: "Регистрация ИП", description: "Полное сопровождение" },
        { key: "registerOoo", label: "Регистрация ООО", description: "Подготовка документов и подача" },
        { key: "ecp", label: "Электронная подпись (ЭЦП)", description: "Для работы с госорганами" },
      ],
    },
    {
      title: "⚖️ Юридические услуги",
      items: [
        { key: "legalSupport", label: "Абонентское юрсопровождение", description: "Постоянная юридическая поддержка" },
        { key: "contracts", label: "Договорная работа", description: "Разработка и проверка договоров" },
      ],
    },
    {
      title: "🤖 Автоматизация",
      items: [
        { key: "crm", label: "Внедрение CRM", description: "Настройка amoCRM" },
        { key: "aiAssistant", label: "ИИ-ассистент", description: "Умный помощник для бизнеса" },
      ],
    },
    {
      title: "📈 Маркетинг",
      items: [
        { key: "smm", label: "Ведение соцсетей", description: "SMM продвижение" },
      ],
    },
  ];

  const toggleService = (key: string) => {
    onChange({ ...services, [key]: !services[key as keyof SelectedServices] });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Какие услуги вас интересуют?</h3>
        <p className="text-white/60">Выберите все подходящие варианты</p>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {categories.map((cat) => (
          <div key={cat.title} className="space-y-2">
            <h4 className="text-white font-semibold text-lg">{cat.title}</h4>
            <div className="grid sm:grid-cols-2 gap-2">
              {cat.items.map((item) => {
                const isSelected = services[item.key as keyof SelectedServices];
                return (
                  <button
                    key={item.key}
                    onClick={() => toggleService(item.key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-purple-500 bg-purple-500/10"
                        : "border-white/10 hover:border-white/30 bg-white/5"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center mt-0.5 ${
                        isSelected ? "border-purple-500 bg-purple-500" : "border-white/30"
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div>
                        <div className="text-white text-sm font-medium">{item.label}</div>
                        <div className="text-white/50 text-xs">{item.description}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ==================== ШАГ 5: Результат ====================
function StepResult({ 
  result, 
  comparison, 
  params,
  contactData,
  setContactData,
  onSubmit,
  isSubmitting,
  submitted
}: { 
  result: { monthly: number; oneTime: number; packages: ServicePackage[] };
  comparison: { employeeCost: number; savings: number; savingsPercent: number };
  params: BusinessParams;
  contactData: { name: string; phone: string; email: string };
  setContactData: (d: { name: string; phone: string; email: string }) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  submitted: boolean;
}) {
  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
          <Check className="w-10 h-10 text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Заявка отправлена!</h3>
        <p className="text-white/60 mb-6">Мы свяжемся с вами в ближайшее время для уточнения деталей</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2">Ваш расчёт готов!</h3>
        <p className="text-white/60">Персональное предложение для вашего бизнеса</p>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Левая колонка — услуги */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Выбранные услуги:</h4>
            {result.packages.length > 0 ? (
              <div className="space-y-3">
                {result.packages.map((pkg) => (
                  <div key={pkg.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-medium">{pkg.name}</h5>
                      <div className="text-right">
                        {pkg.monthlyPrice > 0 && (
                          <div className="text-purple-400 font-semibold">
                            {pkg.monthlyPrice.toLocaleString()} ₽/мес
                          </div>
                        )}
                        {pkg.oneTimePrice > 0 && (
                          <div className="text-white/60 text-sm">
                            {pkg.oneTimePrice.toLocaleString()} ₽ разово
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-white/50 text-sm">{pkg.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-white/50">Выберите услуги на предыдущем шаге</p>
            )}

            {/* Сравнение со штатным */}
            {result.monthly > 0 && comparison.savings > 0 && (
              <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <TrendingDown className="w-5 h-5" />
                  <span className="font-semibold">Ваша экономия</span>
                </div>
                <p className="text-white/70 text-sm">
                  Штатный бухгалтер: ~{comparison.employeeCost.toLocaleString()} ₽/мес
                </p>
                <p className="text-green-400 font-semibold">
                  Экономия: {comparison.savings.toLocaleString()} ₽/мес ({comparison.savingsPercent}%)
                </p>
              </div>
            )}
          </div>

          {/* Правая колонка — итого и форма */}
          <div className="space-y-4">
            {/* Итого */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/50 to-blue-900/50 border border-purple-500/30">
              <h4 className="text-white/70 text-sm mb-2">Итого:</h4>
              <div className="text-3xl font-bold text-white mb-1">
                {result.monthly.toLocaleString()} ₽<span className="text-lg text-white/60">/месяц</span>
              </div>
              {result.oneTime > 0 && (
                <div className="text-white/60">
                  + {result.oneTime.toLocaleString()} ₽ разовые услуги
                </div>
              )}
            </div>

            {/* Форма */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
              <h4 className="text-white font-semibold">Получить точный расчёт:</h4>
              <input
                type="text"
                placeholder="Ваше имя"
                value={contactData.name}
                onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                placeholder="Телефон"
                value={contactData.phone}
                onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={contactData.email}
                onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={onSubmit}
                disabled={isSubmitting || !contactData.name || !contactData.phone}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
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
          </div>
        </div>
      </div>
    </motion.div>
  );
}
