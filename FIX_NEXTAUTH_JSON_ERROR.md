# Исправление ошибки: Unexpected token '<', "<!DOCTYPE "... is not valid JSON

## Проблема

При попытке авторизации через NextAuth получаете ошибку:
```
Console ClientFetchError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```

Это означает, что NextAuth ожидает получить JSON от API, но вместо этого получает HTML страницу (обычно страницу ошибки 404 или 500).

## Причины

1. **Неправильная настройка NEXTAUTH_URL** на продакшене
2. **Проблемы с маршрутизацией** на Vercel
3. **API роут не работает** правильно

## Решение

### Шаг 1: Проверьте переменные окружения на Vercel

Убедитесь, что в настройках проекта Vercel установлены следующие переменные:

```env
NEXTAUTH_URL=https://www.rahima-consulting.ru
NEXTAUTH_SECRET=ваш-секретный-ключ
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
```

**Важно:**
- `NEXTAUTH_URL` должен быть **без** завершающего слеша
- `NEXTAUTH_URL` должен быть **полным URL** с протоколом (https://)
- Не используйте `VERCEL_URL` для `NEXTAUTH_URL` на продакшене

### Шаг 2: Проверьте структуру API роута

Убедитесь, что файл находится по пути:
```
src/app/api/auth/[...nextauth]/route.ts
```

И содержит:
```typescript
import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;
```

### Шаг 3: Проверьте настройки маршрутизации на Vercel

Если у вас есть файл `vercel.json`, убедитесь, что он не перенаправляет API запросы:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```

Или удалите файл `vercel.json`, если он не нужен.

### Шаг 4: Проверьте логи на Vercel

1. Перейдите в Vercel Dashboard
2. Откройте ваш проект
3. Перейдите в раздел "Deployments"
4. Откройте последний деплой
5. Проверьте логи на наличие ошибок

### Шаг 5: Перезапустите приложение

После изменения переменных окружения:
1. Сохраните изменения
2. Сделайте новый деплой или перезапустите существующий
3. Подождите несколько минут для применения изменений

## Проверка работы

После исправления:

1. Откройте консоль браузера (F12)
2. Попробуйте войти через Google или email/password
3. Проверьте Network tab - запросы к `/api/auth/*` должны возвращать JSON, а не HTML

## Дополнительная диагностика

Если проблема сохраняется, проверьте:

1. **Правильность URL в запросах:**
   - Откройте Network tab в DevTools
   - Найдите запросы к `/api/auth/*`
   - Убедитесь, что они идут на правильный домен

2. **Проверьте ответы сервера:**
   - В Network tab посмотрите на Response для запросов к `/api/auth/*`
   - Если видите HTML вместо JSON, значит проблема в маршрутизации

3. **Проверьте middleware:**
   - Убедитесь, что `src/middleware.ts` не блокирует API запросы
   - Проверьте matcher в конфигурации middleware

## Частые ошибки

❌ **Неправильно:**
```env
NEXTAUTH_URL=https://www.rahima-consulting.ru/
NEXTAUTH_URL=www.rahima-consulting.ru
NEXTAUTH_URL=https://rahima-consulting.ru
```

✅ **Правильно:**
```env
NEXTAUTH_URL=https://www.rahima-consulting.ru
```

## Если ничего не помогает

1. Проверьте, что используете правильную версию NextAuth (v5 beta)
2. Убедитесь, что все зависимости установлены: `npm install`
3. Попробуйте очистить кеш: `rm -rf .next` и пересобрать проект
4. Проверьте документацию NextAuth v5: https://authjs.dev



