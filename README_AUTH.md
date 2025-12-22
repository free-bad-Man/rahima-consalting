# Настройка аутентификации

## Шаги для настройки:

### 1. Установите пакеты (в PowerShell):
```powershell
npm install next-auth@beta @prisma/client prisma @auth/prisma-adapter bcryptjs @types/bcryptjs
```

### 2. Настройте базу данных:

#### Вариант A: SQLite (для начала, проще всего)
- Не требует установки дополнительного ПО
- Создайте файл `.env.local` в корне проекта:
```env
DATABASE_URL="file:./dev.db"
```

#### Вариант B: PostgreSQL (для продакшена)
- Установите PostgreSQL локально или используйте облачный сервис:
  - [Supabase](https://supabase.com) (бесплатный план)
  - [Neon](https://neon.tech) (бесплатный план)
  - [Railway](https://railway.app)
- В `.env.local`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"
```

**Примечание:** Если используете PostgreSQL, измените в `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"  // вместо "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Настройте переменные окружения:

Создайте файл `.env.local` в корне проекта:

```env
# Database (SQLite для начала)
DATABASE_URL="file:./dev.db"
# Или для PostgreSQL:
# DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="сгенерируйте-случайную-строку-здесь"

# Google OAuth
GOOGLE_CLIENT_ID="ваш-google-client-id"
GOOGLE_CLIENT_SECRET="ваш-google-client-secret"
```

**Для генерации NEXTAUTH_SECRET:**
```powershell
openssl rand -base64 32
```

### 4. Настройте Google OAuth:

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API
4. Перейдите в "Credentials" → "Create Credentials" → "OAuth client ID"
5. Выберите "Web application"
6. Добавьте **Authorized JavaScript origins**:
   - `http://localhost:3000` (для разработки)
   - `https://yourdomain.com` (для продакшена, **без** завершающего слеша)
7. Добавьте **Authorized redirect URIs**:
   - `http://localhost:3000/api/auth/callback/google` (для разработки)
   - `https://yourdomain.com/api/auth/callback/google` (для продакшена)
   - **Важно:** URI должен точно совпадать с форматом `{NEXTAUTH_URL}/api/auth/callback/google`
8. Скопируйте Client ID и Client Secret в `.env.local`

**Для продакшена на Vercel:**
- Установите переменные окружения в настройках проекта Vercel
- Убедитесь, что `NEXTAUTH_URL` установлен как `https://yourdomain.com` (без слеша в конце)
- См. также `FIX_GOOGLE_OAUTH_REDIRECT.md` для решения проблем с redirect_uri_mismatch

### 5. Инициализируйте Prisma:

```powershell
npx prisma generate
npx prisma db push
```

### 6. Используйте аутентификацию:

#### На клиенте:
```tsx
import { signIn, signOut, useSession } from "next-auth/react";

// Вход
await signIn("google");

// Выход
await signOut();

// Получение сессии
const { data: session, status } = useSession();
```

#### На сервере:
```tsx
import { getSession } from "@/lib/get-session";

const session = await getSession();
if (!session) {
  // Пользователь не авторизован
}
```

### 7. Защита страниц:

Страницы, указанные в `middleware.ts`, автоматически защищены:
- `/dashboard/*`
- `/profile/*`

Для защиты других страниц добавьте проверку:
```tsx
import { getSession } from "@/lib/get-session";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/signin");
  }
  // Ваш контент
}
```

## Готово! 🎉

Теперь у вас есть полноценная система аутентификации с Google OAuth.

