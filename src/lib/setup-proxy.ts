// Настройка прокси для undici (fetch в Node.js)
// Этот файл должен быть импортирован до использования NextAuth

if (typeof window === 'undefined') {
  // Только на сервере
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  
  if (proxyUrl) {
    try {
      // Используем require для синхронной загрузки
      const { setGlobalDispatcher, ProxyAgent } = require('undici');
      const agent = new ProxyAgent(proxyUrl);
      setGlobalDispatcher(agent);
      console.log('✅ Прокси настроен для undici:', proxyUrl);
    } catch (error: any) {
      // Если undici недоступен, пробуем через переменные окружения
      console.warn('⚠️ Не удалось настроить прокси через undici, используем переменные окружения');
      console.warn('   Убедитесь, что HTTP_PROXY и HTTPS_PROXY установлены:', error?.message);
    }
  } else {
    console.log('ℹ️ Прокси не настроен (HTTP_PROXY/HTTPS_PROXY не установлены)');
  }
}

