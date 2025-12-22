# Исправление ошибки Configuration в NextAuth

## Проблема

При попытке авторизации вы получаете ошибку:
```
/auth/error?error=Configuration
```

Ошибка Configuration означает, что NextAuth не может правильно инициализироваться из-за проблем с конфигурацией.

## Причины

1. **Отсутствуют обязательные переменные окружения**
2. **Неправильные значения переменных**
3. **Проблемы с базой данных**

## Решение

### Шаг 1: Проверьте переменные окружения на Vercel

Зайдите в Vercel Dashboard → Ваш проект → Settings → Environment Variables и убедитесь, что установлены:

#### Обязательные переменные:

```env
NEXTAUTH_SECRET=ваш-секретный-ключ-минимум-32-символа
NEXTAUTH_URL=https://www.rahima-consulting.ru
GOOGLE_CLIENT_ID=ваш-google-client-id
GOOGLE_CLIENT_SECRET=ваш-google-client-secret
DATABASE_URL=ваша-строка-подключения-к-postgresql
```

**Важно:**
- `NEXTAUTH_URL` должен быть **без** завершающего слеша
- `NEXTAUTH_URL` должен быть **полным URL** с протоколом (https://)
- `NEXTAUTH_SECRET` должен быть длиной минимум 32 символа

### Шаг 2: Генерация NEXTAUTH_SECRET

Если у вас нет секретного ключа, сгенерируйте его:

**В PowerShell:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Или используйте онлайн генератор:**
- https://generate-secret.vercel.app/32

### Шаг 3: Проверка Google OAuth

Убедитесь, что:
1. Google OAuth клиент создан в Google Cloud Console
2. Redirect URI добавлен: `https://www.rahima-consulting.ru/api/auth/callback/google`
3. Client ID и Client Secret скопированы правильно (без лишних пробелов)

### Шаг 4: Проверка базы данных

Убедитесь, что:
1. База данных PostgreSQL создана и доступна
2. `DATABASE_URL` указан правильно
3. Prisma миграции применены: `npx prisma db push`

### Шаг 5: Проверка конфигурации через API

Откройте в браузере:
```
https://www.rahima-consulting.ru/api/auth/check-config
```

Вы должны увидеть JSON с информацией о конфигурации. Проверьте, что все значения `true` и длины больше 0.

### Шаг 6: Перезапуск приложения

После изменения переменных окружения:
1. Сохраните изменения в Vercel
2. Сделайте новый деплой или перезапустите существующий
3. Подождите несколько минут для применения изменений

## Диагностика

### Проверка логов на Vercel

1. Перейдите в Vercel Dashboard
2. Откройте ваш проект → Deployments
3. Откройте последний деплой → Logs
4. Найдите сообщения с префиксом ⚠️ или ❌

### Что искать в логах:

- `⚠️ GOOGLE_CLIENT_ID не установлен` - отсутствует Client ID
- `⚠️ GOOGLE_CLIENT_SECRET не установлен` - отсутствует Client Secret
- `⚠️ NEXTAUTH_SECRET не установлен` - отсутствует секретный ключ
- `⚠️ NEXTAUTH_URL не установлен` - отсутствует URL
- `✅ NEXTAUTH_URL установлен: ...` - URL установлен правильно

## Частые ошибки

❌ **Неправильно:**
```env
NEXTAUTH_URL=https://www.rahima-consulting.ru/
NEXTAUTH_URL=www.rahima-consulting.ru
NEXTAUTH_SECRET=short-key
```

✅ **Правильно:**
```env
NEXTAUTH_URL=https://www.rahima-consulting.ru
NEXTAUTH_SECRET=длинный-случайный-ключ-минимум-32-символа
```

## Если проблема сохраняется

1. Убедитесь, что используете правильную версию NextAuth (v5 beta)
2. Проверьте, что все зависимости установлены: `npm install`
3. Попробуйте очистить кеш: удалите `.next` и пересоберите проект
4. Проверьте документацию NextAuth v5: https://authjs.dev

## Быстрая проверка

Выполните команду для проверки конфигурации:
```bash
curl https://www.rahima-consulting.ru/api/auth/check-config
```

Все значения должны быть `true` и иметь ненулевые длины.


