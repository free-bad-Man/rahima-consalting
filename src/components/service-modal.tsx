"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Calculator, FileText, FileCheck, Send, Shield, Users, Clock, Settings, Building2, Briefcase, Eye, Zap, Cpu, BarChart3, TrendingUp, Newspaper, Rocket, MapPin, Key, Trash2, RotateCcw, GraduationCap } from "lucide-react";
import { useMemo } from "react";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceTitle?: string;
}

const iconMap: Record<string, React.ElementType> = {
  FileText,
  Send,
  Calculator,
  Users,
  Settings,
  Building2,
  Briefcase,
  Eye,
  Zap,
  Cpu,
  BarChart3,
  TrendingUp,
  Newspaper,
  Rocket,
  MapPin,
  Key,
  Trash2,
  RotateCcw,
  GraduationCap,
  Shield,
  Clock,
};

// Функция получения контента для услуги
const getServiceContent = (title: string) => {
  const serviceData: Record<string, any> = {
    "Бухгалтерское сопровождение ООО": {
      subtitle: "Полное бухгалтерское сопровождение для обществ с ограниченной ответственностью",
      services: [
        { icon: FileText, title: "Ведение учета", description: "Полное ведение бухгалтерского учета по всем правилам законодательства" },
        { icon: Send, title: "Составление и сдача отчетности", description: "Подготовка и своевременная сдача отчетности в ФНС, ПФР, ФСС" },
        { icon: Calculator, title: "Налоговое планирование", description: "Оптимизация налоговой нагрузки и выбор системы налогообложения" },
        { icon: FileText, title: "Консультации по бухучету", description: "Экспертные консультации по вопросам учета и налогообложения" },
        { icon: FileText, title: "Работа с первичными документами", description: "Обработка и систематизация первичной документации" },
        { icon: Users, title: "Кадровый учет", description: "Ведение кадрового делопроизводства и расчет заработной платы" },
      ],
      advantages: ["Опыт работы более 10 лет", "Команда квалифицированных бухгалтеров", "Гарантия соблюдения всех сроков", "Полная конфиденциальность данных", "Современное ПО и облачные системы", "Персональный менеджер"],
      process: [
        { step: "1", title: "Консультация и оценка", description: "Бесплатная консультация, оценка объема работ и расчет стоимости" },
        { step: "2", title: "Заключение договора", description: "Оформление договора и согласование условий сотрудничества" },
        { step: "3", title: "Передача документов", description: "Безопасная передача документов через защищенные каналы" },
        { step: "4", title: "Ведение учета", description: "Регулярное ведение учета и подготовка отчетности" },
        { step: "5", title: "Регулярная отчетность", description: "Своевременная сдача всех видов отчетности" },
      ],
      faqs: [
        { question: "Что нужно предоставить для начала работы?", answer: "Учредительные документы, данные о деятельности, выписки из банка и первичные документы за текущий период." },
        { question: "Как происходит сдача отчетности?", answer: "Все отчеты подготавливаются и сдаются в электронном виде через систему ЭДО. Вы получите уведомление о сдаче каждого отчета." },
        { question: "Какова стоимость услуг?", answer: "Стоимость зависит от объема операций и системы налогообложения. Предлагаем индивидуальный расчет для каждого клиента." },
        { question: "Можно ли работать удаленно?", answer: "Да, работаем полностью удаленно. Все документы передаются через защищенные каналы, отчетность сдается электронно." },
      ],
    },
    "Бухгалтерское сопровождение ИП": {
      subtitle: "Ведение учета и отчетности для индивидуальных предпринимателей",
      services: [
        { icon: FileText, title: "Ведение учета ИП", description: "Ведение налогового и бухгалтерского учета для ИП" },
        { icon: Send, title: "Сдача отчетности", description: "Подготовка и сдача налоговой отчетности в установленные сроки" },
        { icon: Calculator, title: "Выбор системы налогообложения", description: "Помощь в выборе оптимальной налоговой системы" },
        { icon: FileText, title: "Работа с ККМ", description: "Настройка и сопровождение кассовой техники" },
        { icon: Users, title: "Кадровый учет", description: "Ведение кадров и расчет зарплаты при наличии сотрудников" },
      ],
      advantages: ["Опыт работы с ИП", "Выгодные тарифы", "Соблюдение сроков", "Конфиденциальность", "Удобные каналы связи"],
      process: [
        { step: "1", title: "Консультация", description: "Бесплатная консультация по ведению учета ИП" },
        { step: "2", title: "Договор", description: "Заключение договора на бухгалтерское обслуживание" },
        { step: "3", title: "Передача документов", description: "Передача необходимых документов" },
        { step: "4", title: "Ведение учета", description: "Регулярное ведение учета" },
        { step: "5", title: "Отчетность", description: "Своевременная сдача отчетности" },
      ],
      faqs: [
        { question: "Какие документы нужны?", answer: "Документы о регистрации ИП, выписки из банка, первичные документы, данные о доходах и расходах." },
        { question: "Как часто нужно сдавать отчетность?", answer: "Зависит от системы налогообложения. При УСН - раз в год, при ОСНО - ежеквартально." },
        { question: "Сколько стоит ведение учета ИП?", answer: "От 3000 рублей в месяц в зависимости от системы налогообложения и объема операций." },
      ],
    },
    "Постановка учёта с нуля": {
      subtitle: "Организация системы учета для нового бизнеса",
      services: [
        { icon: Settings, title: "Разработка учетной политики", description: "Создание учетной политики компании" },
        { icon: FileText, title: "Настройка документооборота", description: "Организация системы первичных документов" },
        { icon: Calculator, title: "Выбор системы налогообложения", description: "Оптимальный выбор налогового режима" },
        { icon: Users, title: "Настройка кадрового учета", description: "Организация учета персонала и зарплаты" },
      ],
      advantages: ["Индивидуальный подход", "Опыт работы с новыми компаниями", "Быстрый старт", "Консультации на всех этапах"],
      process: [
        { step: "1", title: "Анализ бизнеса", description: "Изучение специфики вашего бизнеса" },
        { step: "2", title: "Разработка политики", description: "Создание учетной политики" },
        { step: "3", title: "Настройка системы", description: "Настройка документооборота" },
        { step: "4", title: "Обучение", description: "Обучение сотрудников основам учета" },
        { step: "5", title: "Запуск", description: "Запуск системы учета" },
      ],
      faqs: [
        { question: "Сколько времени занимает постановка учета?", answer: "Обычно 2-4 недели в зависимости от сложности бизнеса." },
        { question: "Что входит в услугу?", answer: "Разработка учетной политики, настройка документооборота, обучение персонала." },
      ],
    },
    "Восстановление учёта": {
      subtitle: "Восстановление утерянных или некорректных записей бухгалтерского учета",
      services: [
        { icon: RotateCcw, title: "Анализ текущего состояния", description: "Оценка состояния учета и выявление проблем" },
        { icon: FileText, title: "Восстановление документов", description: "Восстановление первичных документов" },
        { icon: Calculator, title: "Восстановление проводок", description: "Восстановление бухгалтерских проводок" },
        { icon: Send, title: "Сверка с контрагентами", description: "Взаимодействие с контрагентами для сверки" },
      ],
      advantages: ["Опыт восстановления учета", "Работа с любыми объемами", "Минимальные штрафы", "Быстрые сроки"],
      process: [
        { step: "1", title: "Аудит", description: "Анализ текущего состояния учета" },
        { step: "2", title: "План восстановления", description: "Разработка плана восстановления" },
        { step: "3", title: "Сбор документов", description: "Сбор и восстановление документов" },
        { step: "4", title: "Восстановление", description: "Восстановление записей в учете" },
        { step: "5", title: "Сверка", description: "Сверка с контролирующими органами" },
      ],
      faqs: [
        { question: "Сколько стоит восстановление учета?", answer: "Зависит от объема и периода восстановления. Предоставим расчет после анализа." },
        { question: "Сколько времени займет?", answer: "Обычно от 1 до 3 месяцев в зависимости от сложности." },
      ],
    },
    "Кадровый учёт и зарплата": {
      subtitle: "Ведение кадрового делопроизводства и расчет заработной платы",
      services: [
        { icon: Users, title: "Кадровое делопроизводство", description: "Оформление трудовых договоров, приказов, личных дел" },
        { icon: Calculator, title: "Расчет заработной платы", description: "Расчет зарплаты, премий, отпускных, больничных" },
        { icon: FileText, title: "Сдача отчетов", description: "Подготовка и сдача отчетов в ПФР, ФСС, ФНС" },
        { icon: Shield, title: "Соблюдение ТК РФ", description: "Контроль соблюдения трудового законодательства" },
      ],
      advantages: ["Опыт в кадровом учете", "Автоматизация расчетов", "Соблюдение ТК РФ", "Своевременная отчетность"],
      process: [
        { step: "1", title: "Анализ", description: "Изучение структуры персонала" },
        { step: "2", title: "Настройка", description: "Настройка системы расчета" },
        { step: "3", title: "Ведение", description: "Регулярное ведение кадрового учета" },
        { step: "4", title: "Расчеты", description: "Ежемесячный расчет зарплаты" },
        { step: "5", title: "Отчетность", description: "Сдача отчетов в фонды" },
      ],
      faqs: [
        { question: "Какие документы нужны?", answer: "Трудовые договоры, штатное расписание, документы на сотрудников." },
        { question: "Как происходит расчет зарплаты?", answer: "Расчет производится ежемесячно с учетом всех начислений и удержаний." },
      ],
    },
    "Сдача отчётности": {
      subtitle: "Подготовка и сдача всех видов отчетности в срок",
      services: [
        { icon: Send, title: "Налоговая отчетность", description: "Подготовка и сдача налоговых деклараций" },
        { icon: FileText, title: "Бухгалтерская отчетность", description: "Составление бухгалтерской отчетности" },
        { icon: Users, title: "Отчеты в фонды", description: "Сдача отчетов в ПФР, ФСС, ФНС" },
        { icon: Shield, title: "Контроль сроков", description: "Контроль соблюдения сроков сдачи" },
      ],
      advantages: ["Никаких штрафов", "Электронная сдача", "Контроль сроков", "Оперативные уведомления"],
      process: [
        { step: "1", title: "Сбор данных", description: "Сбор необходимых данных для отчетов" },
        { step: "2", title: "Подготовка", description: "Подготовка всех видов отчетности" },
        { step: "3", title: "Проверка", description: "Проверка отчетов на ошибки" },
        { step: "4", title: "Согласование", description: "Согласование отчетов с клиентом" },
        { step: "5", title: "Сдача", description: "Своевременная сдача отчетности" },
      ],
      faqs: [
        { question: "В какие сроки сдаете отчеты?", answer: "Все отчеты сдаются в установленные законодательством сроки, заранее." },
        { question: "Как вы уведомляете о сдаче?", answer: "После сдачи каждого отчета вы получите уведомление с подтверждением." },
      ],
    },
    "Регистрация ИП": { subtitle: "Быстрая регистрация индивидуального предпринимателя", services: [{ icon: Building2, title: "Подготовка документов", description: "Подготовка всех необходимых документов для регистрации" }, { icon: FileText, title: "Подача заявления", description: "Подача заявления в налоговую службу" }, { icon: Key, title: "Получение документов", description: "Получение свидетельства о регистрации" }], advantages: ["Быстрая регистрация", "Минимум документов", "Поддержка на всех этапах"], process: [{ step: "1", title: "Консультация", description: "Консультация по процедуре регистрации" }, { step: "2", title: "Подготовка", description: "Подготовка пакета документов" }, { step: "3", title: "Подача", description: "Подача документов в ФНС" }, { step: "4", title: "Получение", description: "Получение документов о регистрации" }], faqs: [{ question: "Сколько времени занимает регистрация ИП?", answer: "Обычно 3-5 рабочих дней с момента подачи документов." }] },
    "Регистрация ООО": { subtitle: "Полное сопровождение регистрации общества с ограниченной ответственностью", services: [{ icon: Building2, title: "Подготовка учредительных документов", description: "Разработка устава и учредительных документов" }, { icon: FileText, title: "Регистрация в ФНС", description: "Регистрация ООО в налоговой службе" }, { icon: MapPin, title: "Юридический адрес", description: "Помощь в получении юридического адреса" }], advantages: ["Полное сопровождение", "Минимум участия клиента", "Гарантия результата"], process: [{ step: "1", title: "Консультация", description: "Консультация по регистрации ООО" }, { step: "2", title: "Подготовка документов", description: "Разработка учредительных документов" }, { step: "3", title: "Регистрация", description: "Подача документов и регистрация" }, { step: "4", title: "Получение", description: "Получение всех документов ООО" }], faqs: [{ question: "Какие документы нужны для регистрации ООО?", answer: "Паспорта учредителей, решение об учреждении, устав, документы на юридический адрес." }] },
    "Изменения в ЕГРЮЛ/ЕГРИП": { subtitle: "Внесение изменений в единый государственный реестр", services: [{ icon: FileCheck, title: "Подготовка документов", description: "Подготовка документов для внесения изменений" }, { icon: Send, title: "Подача в ФНС", description: "Подача заявления о внесении изменений" }, { icon: FileText, title: "Получение документов", description: "Получение обновленных документов" }], advantages: ["Быстрое внесение изменений", "Опыт работы"], process: [{ step: "1", title: "Анализ изменений", description: "Определение необходимых изменений" }, { step: "2", title: "Подготовка", description: "Подготовка документов" }, { step: "3", title: "Подача", description: "Подача в регистрирующий орган" }, { step: "4", title: "Получение", description: "Получение обновленных документов" }], faqs: [{ question: "Сколько времени занимает внесение изменений?", answer: "Обычно 5 рабочих дней с момента подачи документов." }] },
    "Ликвидация ИП и ООО": { subtitle: "Профессиональное закрытие бизнеса и ликвидация компании", services: [{ icon: Trash2, title: "Подготовка документов", description: "Подготовка документов для ликвидации" }, { icon: FileText, title: "Уведомление кредиторов", description: "Уведомление всех кредиторов" }, { icon: Send, title: "Подача в ФНС", description: "Подача заявления о ликвидации" }], advantages: ["Легальная ликвидация", "Минимум проблем"], process: [{ step: "1", title: "Консультация", description: "Консультация по процедуре ликвидации" }, { step: "2", title: "Подготовка", description: "Подготовка документов" }, { step: "3", title: "Процедура", description: "Прохождение процедуры ликвидации" }, { step: "4", title: "Завершение", description: "Получение документов о ликвидации" }], faqs: [{ question: "Сколько времени занимает ликвидация?", answer: "От 3 до 6 месяцев в зависимости от сложности процедуры." }] },
    "Юридический адрес": { subtitle: "Предоставление юридического адреса для регистрации", services: [{ icon: MapPin, title: "Предоставление адреса", description: "Предоставление юридического адреса" }, { icon: FileText, title: "Документы", description: "Получение необходимых документов" }], advantages: ["Надежный адрес", "Быстрое оформление"], process: [{ step: "1", title: "Выбор адреса", description: "Выбор подходящего адреса" }, { step: "2", title: "Оформление", description: "Оформление документов" }, { step: "3", title: "Получение", description: "Получение документов на адрес" }], faqs: [{ question: "Сколько стоит юридический адрес?", answer: "От 5000 рублей в год в зависимости от региона." }] },
    "Электронная подпись (ЭЦП)": { subtitle: "Получение и настройка электронной цифровой подписи", services: [{ icon: Key, title: "Получение ЭЦП", description: "Получение электронной подписи в удостоверяющем центре" }, { icon: Settings, title: "Настройка", description: "Настройка ЭЦП на вашем компьютере" }, { icon: FileText, title: "Обучение", description: "Обучение работе с ЭЦП" }], advantages: ["Официальные удостоверяющие центры", "Быстрое получение"], process: [{ step: "1", title: "Консультация", description: "Консультация по выбору ЭЦП" }, { step: "2", title: "Подача документов", description: "Подача документов в УЦ" }, { step: "3", title: "Получение", description: "Получение ЭЦП" }, { step: "4", title: "Настройка", description: "Настройка на вашем ПК" }], faqs: [{ question: "Для чего нужна ЭЦП?", answer: "Для электронного документооборота, сдачи отчетности, участия в госзакупках." }] },
    "Абонентское юрсопровождение": { subtitle: "Комплексное юридическое обслуживание на постоянной основе", services: [{ icon: Shield, title: "Юридические консультации", description: "Консультации по всем правовым вопросам" }, { icon: FileText, title: "Договорная работа", description: "Разработка и проверка договоров" }, { icon: Briefcase, title: "Представительство", description: "Представительство в судах и госорганах" }], advantages: ["Постоянная поддержка", "Широкий спектр услуг"], process: [{ step: "1", title: "Консультация", description: "Консультация и оценка потребностей" }, { step: "2", title: "Договор", description: "Заключение договора на обслуживание" }, { step: "3", title: "Обслуживание", description: "Регулярное юридическое обслуживание" }], faqs: [{ question: "Что входит в абонентское обслуживание?", answer: "Консультации, разработка документов, представительство в судах, проверка договоров." }] },
    "Госзакупки под ключ": { subtitle: "Полное сопровождение участия в государственных закупках", services: [{ icon: Briefcase, title: "Поиск тендеров", description: "Поиск подходящих государственных закупок" }, { icon: FileText, title: "Подготовка заявки", description: "Подготовка заявки на участие" }, { icon: Send, title: "Подача заявки", description: "Подача заявки на участие в тендере" }], advantages: ["Опыт в госзакупках", "Повышение шансов на победу"], process: [{ step: "1", title: "Анализ", description: "Анализ возможностей участия" }, { step: "2", title: "Подготовка", description: "Подготовка заявки" }, { step: "3", title: "Подача", description: "Подача заявки" }, { step: "4", title: "Сопровождение", description: "Сопровождение процедуры" }], faqs: [{ question: "Какие гарантии участия в госзакупках?", answer: "Помогаем повысить шансы на победу, но не гарантируем 100% результат." }] },
    "Корпоративное право": { subtitle: "Юридическая поддержка корпоративных отношений и сделок", services: [{ icon: Building2, title: "Корпоративные документы", description: "Разработка корпоративных документов" }, { icon: FileText, title: "Сделки", description: "Юридическое сопровождение сделок" }, { icon: Shield, title: "Защита прав", description: "Защита прав акционеров и участников" }], advantages: ["Опыт в корпоративном праве"], process: [{ step: "1", title: "Консультация", description: "Консультация по вопросу" }, { step: "2", title: "Решение", description: "Разработка решения" }, { step: "3", title: "Реализация", description: "Реализация решения" }], faqs: [] },
    "Договорная работа": { subtitle: "Разработка, проверка и сопровождение договоров", services: [{ icon: FileText, title: "Разработка договоров", description: "Разработка договоров под ваши нужды" }, { icon: Eye, title: "Проверка договоров", description: "Проверка договоров на риски" }, { icon: Shield, title: "Сопровождение", description: "Сопровождение исполнения договоров" }], advantages: ["Защита интересов", "Минимизация рисков"], process: [{ step: "1", title: "Анализ", description: "Анализ потребностей" }, { step: "2", title: "Разработка", description: "Разработка/проверка договора" }, { step: "3", title: "Согласование", description: "Согласование с клиентом" }, { step: "4", title: "Исполнение", description: "Сопровождение исполнения" }], faqs: [] },
    "Правовой аудит бизнеса": { subtitle: "Комплексная проверка правовых аспектов деятельности компании", services: [{ icon: Eye, title: "Анализ документов", description: "Анализ всех корпоративных документов" }, { icon: Shield, title: "Выявление рисков", description: "Выявление правовых рисков" }, { icon: FileText, title: "Рекомендации", description: "Рекомендации по устранению рисков" }], advantages: ["Полный анализ", "Профессиональный подход"], process: [{ step: "1", title: "Сбор документов", description: "Сбор всех необходимых документов" }, { step: "2", title: "Анализ", description: "Комплексный анализ документов" }, { step: "3", title: "Отчет", description: "Подготовка отчета с рекомендациями" }], faqs: [] },
    "Аудит процессов и отдела продаж": { subtitle: "Анализ и оптимизация бизнес-процессов и работы отдела продаж", services: [{ icon: Eye, title: "Анализ процессов", description: "Анализ текущих бизнес-процессов" }, { icon: BarChart3, title: "Анализ продаж", description: "Анализ работы отдела продаж" }, { icon: Zap, title: "Оптимизация", description: "Рекомендации по оптимизации" }], advantages: ["Опыт в оптимизации", "Практические решения"], process: [{ step: "1", title: "Изучение", description: "Изучение процессов" }, { step: "2", title: "Анализ", description: "Анализ эффективности" }, { step: "3", title: "Рекомендации", description: "Разработка рекомендаций" }, { step: "4", title: "Внедрение", description: "Помощь во внедрении" }], faqs: [] },
    "Внедрение и настройка amoCRM": { subtitle: "Полное внедрение и настройка системы amoCRM для вашего бизнеса", services: [{ icon: Settings, title: "Настройка CRM", description: "Настройка amoCRM под ваш бизнес" }, { icon: Users, title: "Интеграции", description: "Настройка интеграций с другими системами" }, { icon: GraduationCap, title: "Обучение", description: "Обучение сотрудников работе с CRM" }], advantages: ["Опыт с amoCRM", "Индивидуальная настройка"], process: [{ step: "1", title: "Анализ", description: "Анализ бизнес-процессов" }, { step: "2", title: "Настройка", description: "Настройка системы" }, { step: "3", title: "Обучение", description: "Обучение персонала" }, { step: "4", title: "Запуск", description: "Запуск системы" }], faqs: [] },
    "Автоматизация отдела продаж": { subtitle: "Автоматизация процессов продаж и повышение эффективности", services: [{ icon: Zap, title: "Автоматизация", description: "Автоматизация процессов продаж" }, { icon: Cpu, title: "Интеграции", description: "Интеграция различных систем" }, { icon: BarChart3, title: "Аналитика", description: "Настройка аналитики продаж" }], advantages: ["Повышение эффективности", "Автоматизация рутины"], process: [{ step: "1", title: "Аудит", description: "Аудит текущих процессов" }, { step: "2", title: "Проектирование", description: "Проектирование автоматизации" }, { step: "3", title: "Внедрение", description: "Внедрение автоматизации" }], faqs: [] },
    "Интеграции на базе n8n": { subtitle: "Создание интеграций между различными системами на базе n8n", services: [{ icon: Cpu, title: "Разработка интеграций", description: "Разработка интеграций между системами" }, { icon: Settings, title: "Настройка", description: "Настройка и тестирование" }, { icon: Shield, title: "Поддержка", description: "Техническая поддержка интеграций" }], advantages: ["Опыт с n8n", "Надежные интеграции"], process: [{ step: "1", title: "Анализ", description: "Анализ требований" }, { step: "2", title: "Разработка", description: "Разработка интеграций" }, { step: "3", title: "Тестирование", description: "Тестирование и запуск" }], faqs: [] },
    "Дашборды и отчёты для руководителя": { subtitle: "Создание информативных дашбордов и аналитических отчётов", services: [{ icon: BarChart3, title: "Дашборды", description: "Создание дашбордов с ключевыми метриками" }, { icon: FileText, title: "Отчеты", description: "Подготовка аналитических отчетов" }, { icon: Eye, title: "Визуализация", description: "Визуализация данных" }], advantages: ["Наглядность", "Актуальные данные"], process: [{ step: "1", title: "Определение метрик", description: "Определение ключевых метрик" }, { step: "2", title: "Разработка", description: "Разработка дашбордов" }, { step: "3", title: "Внедрение", description: "Внедрение и обучение" }], faqs: [] },
    "Обучение сотрудников работе с CRM": { subtitle: "Профессиональное обучение персонала работе с CRM-системами", services: [{ icon: GraduationCap, title: "Обучение", description: "Обучение сотрудников работе с CRM" }, { icon: Users, title: "Индивидуальный подход", description: "Обучение с учетом специфики вашей компании" }], advantages: ["Опытные преподаватели", "Практический подход"], process: [{ step: "1", title: "Анализ", description: "Анализ потребностей в обучении" }, { step: "2", title: "Программа", description: "Разработка программы обучения" }, { step: "3", title: "Проведение", description: "Проведение обучения" }], faqs: [] },
    "Разработка маркетинговой стратегии": { subtitle: "Создание комплексной стратегии продвижения вашего бизнеса", services: [{ icon: TrendingUp, title: "Анализ рынка", description: "Анализ рынка и конкурентов" }, { icon: BarChart3, title: "Стратегия", description: "Разработка маркетинговой стратегии" }, { icon: Rocket, title: "План действий", description: "Составление плана маркетинговых действий" }], advantages: ["Комплексный подход", "Ориентация на результат"], process: [{ step: "1", title: "Исследование", description: "Исследование рынка" }, { step: "2", title: "Стратегия", description: "Разработка стратегии" }, { step: "3", title: "План", description: "Составление плана" }, { step: "4", title: "Реализация", description: "Помощь в реализации" }], faqs: [] },
    "Ведение социальных сетей": { subtitle: "Профессиональное управление аккаунтами в социальных сетях", services: [{ icon: Users, title: "Контент", description: "Создание и публикация контента" }, { icon: Newspaper, title: "SMM", description: "Управление аккаунтами в соцсетях" }, { icon: BarChart3, title: "Аналитика", description: "Анализ эффективности публикаций" }], advantages: ["Опыт в SMM", "Регулярный контент"], process: [{ step: "1", title: "Анализ", description: "Анализ целевой аудитории" }, { step: "2", title: "Стратегия", description: "Разработка контент-стратегии" }, { step: "3", title: "Ведение", description: "Регулярное ведение аккаунтов" }], faqs: [] },
    "Контент-маркетинг": { subtitle: "Создание и распространение ценного контента для привлечения клиентов", services: [{ icon: Newspaper, title: "Создание контента", description: "Создание полезного контента" }, { icon: Rocket, title: "Продвижение", description: "Продвижение контента" }, { icon: TrendingUp, title: "SEO", description: "Оптимизация контента для поиска" }], advantages: ["Привлечение клиентов", "Экспертность"], process: [{ step: "1", title: "Планирование", description: "Планирование контента" }, { step: "2", title: "Создание", description: "Создание контента" }, { step: "3", title: "Публикация", description: "Публикация и продвижение" }], faqs: [] },
    "Реклама в интернете": { subtitle: "Настройка и ведение рекламных кампаний в интернете", services: [{ icon: Rocket, title: "Настройка рекламы", description: "Настройка рекламных кампаний" }, { icon: TrendingUp, title: "Яндекс.Директ", description: "Настройка Яндекс.Директ" }, { icon: Rocket, title: "Google Ads", description: "Настройка Google Ads" }], advantages: ["Опыт в интернет-рекламе", "Результативные кампании"], process: [{ step: "1", title: "Анализ", description: "Анализ целевой аудитории" }, { step: "2", title: "Настройка", description: "Настройка рекламных кампаний" }, { step: "3", title: "Запуск", description: "Запуск и оптимизация" }], faqs: [] },
    "Аналитика и отчёты": { subtitle: "Анализ эффективности маркетинговых кампаний и отчёты", services: [{ icon: BarChart3, title: "Анализ", description: "Анализ эффективности кампаний" }, { icon: FileText, title: "Отчеты", description: "Подготовка отчетов по маркетингу" }, { icon: Eye, title: "Рекомендации", description: "Рекомендации по оптимизации" }], advantages: ["Данные для решений", "Регулярные отчеты"], process: [{ step: "1", title: "Сбор данных", description: "Сбор данных о кампаниях" }, { step: "2", title: "Анализ", description: "Анализ эффективности" }, { step: "3", title: "Отчет", description: "Подготовка отчета" }], faqs: [] },
  };

  // Если для услуги есть специфичный контент, возвращаем его
  if (serviceData[title]) {
    return serviceData[title];
  }

  // Базовый контент для остальных услуг
  return {
    subtitle: `Профессиональная услуга: ${title}`,
    services: [
      { icon: FileText, title: "Профессиональное обслуживание", description: "Полный комплекс услуг согласно вашим требованиям" },
    ],
    advantages: ["Опыт работы более 10 лет", "Команда квалифицированных специалистов", "Гарантия соблюдения сроков", "Полная конфиденциальность", "Современные технологии", "Персональный подход"],
    process: [
      { step: "1", title: "Консультация", description: "Бесплатная консультация и оценка" },
      { step: "2", title: "Договор", description: "Заключение договора" },
      { step: "3", title: "Начало работы", description: "Старт выполнения работ" },
      { step: "4", title: "Выполнение", description: "Регулярное выполнение услуг" },
      { step: "5", title: "Контроль", description: "Контроль качества и отчетность" },
    ],
    faqs: [
      { question: "Что нужно для начала?", answer: "Свяжитесь с нами для получения индивидуальной консультации." },
      { question: "Какова стоимость?", answer: "Стоимость рассчитывается индивидуально в зависимости от объема работ." },
      { question: "Как происходит взаимодействие?", answer: "Работаем удаленно или очно, используя современные средства связи." },
      { question: "Какие гарантии?", answer: "Гарантируем соблюдение обязательств, конфиденциальность и высокое качество." },
    ],
  };
};

export default function ServiceModal({ isOpen, onClose, serviceTitle = "" }: ServiceModalProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const content = useMemo(() => {
    if (!serviceTitle) return null;
    return getServiceContent(serviceTitle);
  }, [serviceTitle]);

  if (!content) return null;

  const { subtitle, services, advantages, process, faqs } = content;

  const modalContent = (
    <>
      {/* Header */}
      <div className="flex items-start justify-between mb-4 md:mb-6 lg:mb-8">
        <div className="flex-1 pr-2">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-semibold text-white mb-1 md:mb-2">
            {serviceTitle}
          </h2>
          <p className="text-white/70 text-xs md:text-sm lg:text-base">
            {subtitle}
          </p>
        </div>
        {!isMobile && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors ml-2 md:ml-4 flex-shrink-0"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4 md:h-5 md:w-5" />
          </button>
        )}
      </div>

        {/* Что входит в услугу */}
        <section className="mb-6 md:mb-8 lg:mb-12">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold text-white mb-3 md:mb-4 lg:mb-6 flex items-center gap-2">
            <Calculator className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
            Что входит в услугу
          </h3>
          <div className="grid md:grid-cols-2 gap-3 md:gap-4">
                    {services.map((service: { icon: React.ElementType; title: string; description: string }, index: number) => {
                      const Icon = service.icon;
                      return (
            <div
              key={index}
              className="flex items-start gap-2 md:gap-3 p-3 md:p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-400/30 flex items-center justify-center">
                <Icon className="h-4 w-4 md:h-5 md:w-5 text-purple-400" />
              </div>
              <div>
                <h4 className="text-white font-medium mb-1 text-sm md:text-base">{service.title}</h4>
                <p className="text-white/60 text-xs md:text-sm">{service.description}</p>
              </div>
            </div>
                      );
                    })}
                  </div>
                </section>

                {/* Преимущества */}
                <section className="mb-12">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-purple-400" />
                    Почему выбирают нас
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {advantages.map((advantage: string, index: number) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                        <p className="text-white/80 text-sm">{advantage}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Процесс работы */}
                <section className="mb-12">
                  <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-purple-400" />
                    Процесс работы
                  </h3>
                  <div className="space-y-4">
                    {process.map((item: { step: string; title: string; description: string }, index: number) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-lg border border-white/10 bg-white/5"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                          {item.step}
                        </div>
                        <div>
                          <h4 className="text-white font-medium mb-1">{item.title}</h4>
                          <p className="text-white/60 text-sm">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* FAQ */}
                <section className="mb-12">
                  <h3 className="text-xl font-semibold text-white mb-6">Частые вопросы</h3>
                  <div className="space-y-4">
                    {faqs.map((faq: { question: string; answer: string }, index: number) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border border-white/10 bg-white/5"
                      >
                        <h4 className="text-white font-medium mb-2">{faq.question}</h4>
                        <p className="text-white/60 text-sm">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* CTA */}
                <section className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-8 text-center">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    Готовы начать сотрудничество?
                  </h3>
                  <p className="text-white/70 mb-6">
                    Получите бесплатную консультацию и расчет стоимости услуг
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => {
                        // Здесь можно добавить логику открытия формы обратной связи
                        console.log("Получить консультацию");
                      }}
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-300"
                    >
                      Получить консультацию
                    </button>
                    <button
                      onClick={() => {
                        // Здесь можно добавить логику расчета стоимости
                        console.log("Рассчитать стоимость");
                      }}
                      className="px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-300"
                    >
                      Рассчитать стоимость
                    </button>
                  </div>
                </section>
    </>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex flex-col rounded-t-2xl bg-[#0A0A0A]/95 border-t border-white/10 max-h-[90vh]">
            <Drawer.Title className="sr-only">{serviceTitle || "Информация об услуге"}</Drawer.Title>
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-4 mt-3" />
            <div className="px-4 py-4 overflow-y-auto">
              {modalContent}
            </div>
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
            className="fixed inset-2 md:inset-4 z-[101] overflow-hidden bg-[#0A0A0A]/85 border border-white/10 rounded-2xl md:rounded-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-full w-full overflow-y-auto">
              <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 py-4 md:py-6 lg:py-8 h-full flex flex-col">
                {modalContent}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

