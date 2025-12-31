/**
 * Конфигурация цен для калькулятора услуг
 * Rahima Consulting
 */

// Типы бизнеса
export type BusinessType = "planning" | "ip" | "ooo" | "holding";

// Системы налогообложения
export type TaxSystem = "usn6" | "usn15" | "osno" | "patent" | "unknown";

// Параметры бизнеса
export interface BusinessParams {
  businessType: BusinessType;
  taxSystem: TaxSystem;
  employeesCount: "0" | "1-5" | "6-15" | "16-50" | "50+";
  operationsCount: "0-20" | "20-50" | "50-100" | "100-300" | "300+";
  hasNds: boolean;
  hasVed: boolean; // ВЭД - внешнеэкономическая деятельность
}

// Выбранные услуги
export interface SelectedServices {
  // Бухгалтерия
  fullAccounting: boolean;
  reportingOnly: boolean;
  payroll: boolean;
  accountingRecovery: boolean;
  accountingSetup: boolean;
  
  // Регистрация
  registerIp: boolean;
  registerOoo: boolean;
  egrul: boolean;
  ecp: boolean;
  liquidation: boolean;
  legalAddress: boolean;
  
  // Юридические
  legalSupport: boolean;
  contracts: boolean;
  tenders: boolean;
  legalAudit: boolean;
  
  // Автоматизация
  crm: boolean;
  integrations: boolean;
  aiAssistant: boolean;
  dashboards: boolean;
  
  // Маркетинг
  smm: boolean;
  advertising: boolean;
  marketingStrategy: boolean;
}

// Базовые цены услуг (в рублях/месяц или разово)
export const BASE_PRICES = {
  // Бухгалтерия (ежемесячно)
  accounting: {
    ip: {
      usn6: 8000,
      usn15: 10000,
      osno: 18000,
      patent: 6000,
    },
    ooo: {
      usn6: 12000,
      usn15: 15000,
      osno: 25000,
    },
  },
  
  // Надбавки за сотрудников (в месяц)
  payrollPerEmployee: 500,
  
  // Надбавки за операции
  operationsMultiplier: {
    "0-20": 1.0,
    "20-50": 1.2,
    "50-100": 1.4,
    "100-300": 1.7,
    "300+": 2.0,
  },
  
  // НДС надбавка
  ndsMultiplier: 1.4,
  
  // ВЭД надбавка
  vedMultiplier: 1.3,
  
  // Только отчётность (ежемесячно)
  reportingOnly: {
    ip: 4000,
    ooo: 6000,
  },
  
  // Зарплата и кадры (за сотрудника/мес)
  payroll: {
    base: 2000,
    perEmployee: 400,
  },
  
  // Восстановление учёта (за квартал)
  accountingRecovery: {
    ip: 12000,
    ooo: 18000,
  },
  
  // Постановка учёта с нуля (разово)
  accountingSetup: {
    ip: 15000,
    ooo: 25000,
  },
  
  // Регистрация (разово)
  registration: {
    ip: 5000,
    ooo: 12000,
    egrul: 5000,
    liquidationIp: 8000,
    liquidationOoo: 25000,
    ecp: 3500,
    legalAddress: 15000, // в год
  },
  
  // Юридические услуги (ежемесячно)
  legal: {
    support: 15000,
    contracts: 8000, // до 5 договоров
    contractsExtra: 2000, // за каждый дополнительный
    tenders: 25000,
    audit: 35000, // разово
  },
  
  // Автоматизация (разово/ежемесячно)
  automation: {
    crmSetup: 45000, // разово
    crmSupport: 10000, // ежемесячно
    integrations: 30000, // разово за базовый пакет
    integrationsSupport: 8000, // ежемесячно
    aiAssistant: 5000, // ежемесячно
    dashboards: 20000, // разово
  },
  
  // Маркетинг (ежемесячно)
  marketing: {
    smm: 25000,
    advertising: 15000, // + бюджет
    strategy: 50000, // разово
  },
};

// Скидки за комплекс услуг
export const BUNDLE_DISCOUNTS = {
  // Бухгалтерия + Юрист
  accountingLegal: 0.15,
  // Бухгалтерия + Автоматизация
  accountingAutomation: 0.10,
  // Бухгалтерия + Юрист + Автоматизация
  fullBundle: 0.20,
  // Годовой договор
  yearlyContract: 0.10,
};

// Пакеты услуг
export interface ServicePackage {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
  monthlyPrice: number;
  oneTimePrice: number;
  includes: string[];
  savings?: number;
}

// Функция расчёта стоимости бухгалтерского сопровождения
export function calculateAccountingPrice(params: BusinessParams): number {
  const { businessType, taxSystem, employeesCount, operationsCount, hasNds, hasVed } = params;
  
  if (businessType === "planning") return 0;
  
  // Базовая цена
  let basePrice = 0;
  
  if (businessType === "ip") {
    basePrice = BASE_PRICES.accounting.ip[taxSystem as keyof typeof BASE_PRICES.accounting.ip] || 10000;
  } else if (businessType === "ooo" || businessType === "holding") {
    basePrice = BASE_PRICES.accounting.ooo[taxSystem as keyof typeof BASE_PRICES.accounting.ooo] || 15000;
  }
  
  // Множитель за количество операций
  const opsMultiplier = BASE_PRICES.operationsMultiplier[operationsCount] || 1;
  basePrice *= opsMultiplier;
  
  // Надбавка за НДС
  if (hasNds) {
    basePrice *= BASE_PRICES.ndsMultiplier;
  }
  
  // Надбавка за ВЭД
  if (hasVed) {
    basePrice *= BASE_PRICES.vedMultiplier;
  }
  
  // Надбавка за сотрудников
  const employeesMap: Record<string, number> = {
    "0": 0,
    "1-5": 3,
    "6-15": 10,
    "16-50": 30,
    "50+": 50,
  };
  const avgEmployees = employeesMap[employeesCount] || 0;
  basePrice += avgEmployees * BASE_PRICES.payrollPerEmployee;
  
  // Холдинг = x1.5
  if (businessType === "holding") {
    basePrice *= 1.5;
  }
  
  return Math.round(basePrice / 1000) * 1000; // Округляем до тысяч
}

// Функция расчёта полной стоимости
export function calculateTotalPrice(
  params: BusinessParams,
  services: SelectedServices
): { monthly: number; oneTime: number; packages: ServicePackage[] } {
  let monthly = 0;
  let oneTime = 0;
  const packages: ServicePackage[] = [];
  
  const isIp = params.businessType === "ip";
  const isPlanning = params.businessType === "planning";
  
  // === БУХГАЛТЕРИЯ ===
  if (services.fullAccounting && !isPlanning) {
    const accountingPrice = calculateAccountingPrice(params);
    monthly += accountingPrice;
    
    packages.push({
      id: "accounting",
      name: "Бухгалтерское сопровождение",
      description: isIp ? "Полное ведение учёта ИП" : "Полное ведение учёта ООО",
      monthlyPrice: accountingPrice,
      oneTimePrice: 0,
      includes: [
        "Ведение бухгалтерского учёта",
        "Расчёт налогов",
        "Сдача отчётности",
        "Консультации бухгалтера",
      ],
    });
  }
  
  if (services.reportingOnly && !isPlanning) {
    const price = isIp ? BASE_PRICES.reportingOnly.ip : BASE_PRICES.reportingOnly.ooo;
    monthly += price;
    
    packages.push({
      id: "reporting",
      name: "Сдача отчётности",
      description: "Подготовка и сдача всех видов отчётности",
      monthlyPrice: price,
      oneTimePrice: 0,
      includes: ["Налоговая отчётность", "Статистика", "ПФР и ФСС"],
    });
  }
  
  if (services.payroll && !isPlanning) {
    const employeesMap: Record<string, number> = { "0": 0, "1-5": 3, "6-15": 10, "16-50": 30, "50+": 50 };
    const avgEmployees = employeesMap[params.employeesCount] || 0;
    const price = BASE_PRICES.payroll.base + avgEmployees * BASE_PRICES.payroll.perEmployee;
    monthly += price;
    
    packages.push({
      id: "payroll",
      name: "Кадровый учёт и зарплата",
      description: `Расчёт зарплаты для ${avgEmployees} сотрудников`,
      monthlyPrice: price,
      oneTimePrice: 0,
      includes: ["Расчёт зарплаты", "Кадровый учёт", "Отчётность в фонды"],
    });
  }
  
  if (services.accountingRecovery) {
    const price = isIp ? BASE_PRICES.accountingRecovery.ip : BASE_PRICES.accountingRecovery.ooo;
    oneTime += price;
    
    packages.push({
      id: "recovery",
      name: "Восстановление учёта",
      description: "Восстановление бухгалтерского учёта за квартал",
      monthlyPrice: 0,
      oneTimePrice: price,
      includes: ["Анализ документов", "Восстановление проводок", "Сверка с ФНС"],
    });
  }
  
  if (services.accountingSetup) {
    const price = isIp ? BASE_PRICES.accountingSetup.ip : BASE_PRICES.accountingSetup.ooo;
    oneTime += price;
    
    packages.push({
      id: "setup",
      name: "Постановка учёта с нуля",
      description: "Организация системы учёта для нового бизнеса",
      monthlyPrice: 0,
      oneTimePrice: price,
      includes: ["Настройка учётной политики", "Создание плана счетов", "Обучение"],
    });
  }
  
  // === РЕГИСТРАЦИЯ ===
  if (services.registerIp || (isPlanning && params.businessType === "planning")) {
    oneTime += BASE_PRICES.registration.ip;
    packages.push({
      id: "register-ip",
      name: "Регистрация ИП",
      description: "Полное сопровождение регистрации",
      monthlyPrice: 0,
      oneTimePrice: BASE_PRICES.registration.ip,
      includes: ["Подготовка документов", "Подача в ФНС", "Получение документов"],
    });
  }
  
  if (services.registerOoo) {
    oneTime += BASE_PRICES.registration.ooo;
    packages.push({
      id: "register-ooo",
      name: "Регистрация ООО",
      description: "Полное сопровождение регистрации",
      monthlyPrice: 0,
      oneTimePrice: BASE_PRICES.registration.ooo,
      includes: ["Подготовка устава", "Подача в ФНС", "Открытие счёта"],
    });
  }
  
  if (services.ecp) {
    oneTime += BASE_PRICES.registration.ecp;
    packages.push({
      id: "ecp",
      name: "Электронная подпись (ЭЦП)",
      description: "Получение и настройка ЭЦП",
      monthlyPrice: 0,
      oneTimePrice: BASE_PRICES.registration.ecp,
      includes: ["Выпуск сертификата", "Настройка на компьютере"],
    });
  }
  
  // === ЮРИДИЧЕСКИЕ ===
  if (services.legalSupport) {
    monthly += BASE_PRICES.legal.support;
    packages.push({
      id: "legal-support",
      name: "Абонентское юрсопровождение",
      description: "Комплексная юридическая поддержка",
      monthlyPrice: BASE_PRICES.legal.support,
      oneTimePrice: 0,
      includes: ["Консультации юриста", "Проверка документов", "Претензионная работа"],
    });
  }
  
  if (services.contracts) {
    monthly += BASE_PRICES.legal.contracts;
    packages.push({
      id: "contracts",
      name: "Договорная работа",
      description: "Разработка и проверка договоров",
      monthlyPrice: BASE_PRICES.legal.contracts,
      oneTimePrice: 0,
      includes: ["До 5 договоров в месяц", "Правовая экспертиза", "Шаблоны договоров"],
    });
  }
  
  // === АВТОМАТИЗАЦИЯ ===
  if (services.crm) {
    oneTime += BASE_PRICES.automation.crmSetup;
    monthly += BASE_PRICES.automation.crmSupport;
    packages.push({
      id: "crm",
      name: "Внедрение CRM",
      description: "Настройка и поддержка amoCRM",
      monthlyPrice: BASE_PRICES.automation.crmSupport,
      oneTimePrice: BASE_PRICES.automation.crmSetup,
      includes: ["Настройка воронок", "Интеграция с сайтом", "Обучение"],
    });
  }
  
  if (services.aiAssistant) {
    monthly += BASE_PRICES.automation.aiAssistant;
    packages.push({
      id: "ai",
      name: "ИИ-ассистент",
      description: "Умный помощник для бизнеса",
      monthlyPrice: BASE_PRICES.automation.aiAssistant,
      oneTimePrice: 0,
      includes: ["Ответы на вопросы", "Анализ документов", "Автоматизация рутины"],
    });
  }
  
  // === МАРКЕТИНГ ===
  if (services.smm) {
    monthly += BASE_PRICES.marketing.smm;
    packages.push({
      id: "smm",
      name: "Ведение соцсетей",
      description: "SMM продвижение бизнеса",
      monthlyPrice: BASE_PRICES.marketing.smm,
      oneTimePrice: 0,
      includes: ["Контент-план", "Публикации", "Модерация"],
    });
  }
  
  // === СКИДКИ ===
  let discount = 0;
  
  // Бухгалтерия + Юрист
  if (services.fullAccounting && services.legalSupport) {
    discount = Math.max(discount, BUNDLE_DISCOUNTS.accountingLegal);
  }
  
  // Бухгалтерия + Автоматизация
  if (services.fullAccounting && (services.crm || services.aiAssistant)) {
    discount = Math.max(discount, BUNDLE_DISCOUNTS.accountingAutomation);
  }
  
  // Полный пакет
  if (services.fullAccounting && services.legalSupport && services.aiAssistant) {
    discount = BUNDLE_DISCOUNTS.fullBundle;
  }
  
  // Применяем скидку
  const savings = Math.round(monthly * discount);
  monthly = monthly - savings;
  
  return {
    monthly: Math.round(monthly / 100) * 100,
    oneTime: Math.round(oneTime / 100) * 100,
    packages,
  };
}

// Сравнение со штатным бухгалтером
export function compareWithEmployee(monthlyPrice: number): {
  employeeCost: number;
  savings: number;
  savingsPercent: number;
} {
  // Средняя стоимость штатного бухгалтера
  // Зарплата ~50 000 + налоги 30% + рабочее место ~10 000
  const employeeCost = 80000;
  const savings = employeeCost - monthlyPrice;
  const savingsPercent = Math.round((savings / employeeCost) * 100);
  
  return { employeeCost, savings, savingsPercent };
}
