// Этот файл выполняется при инициализации Next.js сервера
// Настройка прокси для undici

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
    
    if (proxyUrl) {
      try {
        const { setGlobalDispatcher, ProxyAgent } = await import('undici');
        const agent = new ProxyAgent(proxyUrl);
        setGlobalDispatcher(agent);
        console.log('✅ Прокси настроен для undici через instrumentation:', proxyUrl);
      } catch (error: any) {
        console.warn('⚠️ Не удалось настроить прокси:', error?.message);
      }
    }
  }
}

