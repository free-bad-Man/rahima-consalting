import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Сообщение обязательно" },
        { status: 400 }
      );
    }

    // TODO: Здесь будет интеграция с реальным ИИ-ассистентом
    // Например, OpenAI API, Anthropic Claude, или другой сервис
    
    // Временная заглушка для демонстрации
    const responses = [
      "Спасибо за ваш вопрос! Я помогу вам разобраться.",
      "Это интересный вопрос. Давайте рассмотрим его подробнее.",
      "Я понимаю вашу ситуацию. Вот что я могу предложить...",
      "Отличный вопрос! Позвольте мне объяснить...",
    ];

    // Простая логика для демонстрации
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Если в сообщении есть ключевые слова, можно дать более релевантный ответ
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("услуг") || lowerMessage.includes("помощь")) {
      response = "Мы предлагаем широкий спектр услуг: бухгалтерское сопровождение, регистрация бизнеса, юридическое сопровождение, автоматизация и многое другое. Откройте меню 'Услуги' для подробной информации.";
    } else if (lowerMessage.includes("регистрац") || lowerMessage.includes("ип") || lowerMessage.includes("ооо")) {
      response = "Мы помогаем с регистрацией ИП и ООО, внесением изменений в ЕГРЮЛ/ЕГРИП, ликвидацией, а также предоставляем юридические адреса и электронные подписи. Зарегистрируйтесь на сайте для получения полного доступа к услугам.";
    } else if (lowerMessage.includes("цена") || lowerMessage.includes("стоимость") || lowerMessage.includes("сколько")) {
      response = "Стоимость наших услуг зависит от конкретной задачи и объема работ. Для получения точной информации рекомендую связаться с нашими специалистами через форму обратной связи или зарегистрироваться на сайте.";
    } else if (lowerMessage.includes("контакт") || lowerMessage.includes("связаться")) {
      response = "Вы можете связаться с нами через раздел 'Контакты' в главном меню. Также вы можете зарегистрироваться на сайте для получения персональной консультации.";
    }

    // Имитация задержки ответа
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 1000));

    return NextResponse.json({
      response: response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("AI Chat API error:", error);
    return NextResponse.json(
      { error: "Произошла ошибка при обработке запроса" },
      { status: 500 }
    );
  }
}

