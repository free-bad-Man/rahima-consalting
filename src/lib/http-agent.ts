import { HttpsProxyAgent } from 'https-proxy-agent';

// Создаем HTTP агент с прокси для fetch запросов
export function getProxyAgent() {
  const proxyUrl = process.env.HTTP_PROXY || process.env.HTTPS_PROXY;
  if (proxyUrl) {
    return new HttpsProxyAgent(proxyUrl);
  }
  return undefined;
}

