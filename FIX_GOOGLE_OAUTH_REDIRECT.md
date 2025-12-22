# Исправление ошибки Google OAuth: redirect_uri_mismatch

## Проблема
При попытке авторизации через Google вы получаете ошибку:
```
Ошибка 400: redirect_uri_mismatch
redirect_uri=https://www.rahima-consulting.ru/api/auth/callback/google
```

## Решение

### Шаг 1: Проверьте переменные окружения

Убедитесь, что в вашем `.env.local` (или переменных окружения на Vercel) установлено:

```env
NEXTAUTH_URL="https://www.rahima-consulting.ru"
GOOGLE_CLIENT_ID="ваш-client-id"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
```

**Важно:** `NEXTAUTH_URL` должен быть **без** завершающего слеша и **без** `/api/auth/callback/google`

### Шаг 2: Настройте Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Выберите ваш проект
3. Перейдите в **APIs & Services** → **Credentials**
4. Найдите ваш OAuth 2.0 Client ID и нажмите на него для редактирования
5. В разделе **Authorized redirect URIs** добавьте следующие URI:

#### Для продакшена:
```
https://www.rahima-consulting.ru/api/auth/callback/google
```

#### Для разработки (если нужно):
```
http://localhost:3000/api/auth/callback/google
```

6. Нажмите **Save**

### Шаг 3: Проверьте настройки OAuth клиента

Убедитесь, что:
- **Application type**: Web application
- **Authorized JavaScript origins** содержит:
  ```
  https://www.rahima-consulting.ru
  ```
  (для разработки также можно добавить `http://localhost:3000`)

### Шаг 4: Перезапустите приложение

После изменения настроек в Google Cloud Console:
- Подождите несколько минут (изменения могут применяться с задержкой)
- Перезапустите ваше приложение на Vercel (если используете)
- Очистите кеш браузера и попробуйте снова

## Проверка правильности настройки

Redirect URI, который использует NextAuth, формируется автоматически:
```
{NEXTAUTH_URL}/api/auth/callback/{provider}
```

Где:
- `NEXTAUTH_URL` = `https://www.rahima-consulting.ru`
- `{provider}` = `google`

Итого: `https://www.rahima-consulting.ru/api/auth/callback/google`

Этот URI **должен точно совпадать** с тем, что указан в Google Cloud Console.

## Частые ошибки

❌ **Неправильно:**
- `NEXTAUTH_URL="https://www.rahima-consulting.ru/"` (лишний слеш в конце)
- `NEXTAUTH_URL="https://www.rahima-consulting.ru/api/auth/callback/google"` (включает путь callback)
- В Google Console указан `https://rahima-consulting.ru/api/auth/callback/google` (без www)

✅ **Правильно:**
- `NEXTAUTH_URL="https://www.rahima-consulting.ru"`
- В Google Console: `https://www.rahima-consulting.ru/api/auth/callback/google`

## Если проблема сохраняется

1. Проверьте, что изменения в Google Cloud Console сохранены
2. Убедитесь, что используете правильный OAuth Client ID (для продакшена может быть отдельный клиент)
3. Проверьте логи на Vercel для дополнительной информации
4. Убедитесь, что домен `www.rahima-consulting.ru` правильно настроен в Vercel

---

## Ошибка OAuthAccountNotLinked

Если вы получаете ошибку `OAuthAccountNotLinked` после исправления redirect_uri, это означает, что:

1. Аккаунт с таким email уже существует в базе данных (например, был создан через регистрацию с email/password)
2. NextAuth не может автоматически связать OAuth аккаунт с существующим аккаунтом

### Решение

В конфигурации NextAuth добавлен callback `signIn`, который автоматически связывает аккаунты с одинаковым email. Это означает:

- Если пользователь регистрировался через email/password, он сможет войти через Google с тем же email
- Аккаунты будут автоматически связаны в базе данных при первом входе через Google
- Google аккаунт будет привязан к существующему пользователю

**Важно:** После деплоя изменений на Vercel, пользователи смогут входить через Google даже если они ранее регистрировались через email/password. При первом входе через Google аккаунты автоматически свяжутся.

