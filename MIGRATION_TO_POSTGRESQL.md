# Миграция с SQLite на PostgreSQL для Vercel

## Почему нужно переключаться?

SQLite использует файловую систему для хранения данных, но Vercel использует serverless-функции, которые:
- Не имеют постоянной файловой системы
- Перезапускаются при каждом запросе
- Не могут сохранять файлы базы данных

PostgreSQL - это облачная база данных, которая идеально подходит для serverless окружений.

---

## Вариант 1: Vercel Postgres (Рекомендуется)

### Шаг 1: Создание базы данных на Vercel

1. Зайдите в ваш проект на Vercel: https://vercel.com/dashboard
2. Перейдите в раздел **Storage** (или **Data Storage**)
3. Нажмите **Create Database** → выберите **Postgres**
4. Выберите план (есть бесплатный план для начала)
5. Создайте базу данных

### Шаг 2: Получение строки подключения

После создания базы данных Vercel автоматически:
- Создаст переменную окружения `POSTGRES_URL`
- Создаст переменную окружения `POSTGRES_PRISMA_URL` (для Prisma)
- Создаст переменную окружения `POSTGRES_URL_NON_POOLING` (для миграций)

### Шаг 3: Обновление Prisma Schema

Измените `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Изменено с "sqlite"
  url      = env("DATABASE_URL")
}
```

### Шаг 4: Обновление переменных окружения

В настройках проекта Vercel (Settings → Environment Variables):
- `DATABASE_URL` = значение из `POSTGRES_PRISMA_URL` (для Prisma)
- Или используйте `POSTGRES_PRISMA_URL` напрямую в schema.prisma

---

## Вариант 2: Supabase (Бесплатный альтернативный вариант)

### Шаг 1: Создание проекта на Supabase

1. Зайдите на https://supabase.com
2. Создайте аккаунт (если нет)
3. Создайте новый проект
4. Выберите регион (ближайший к вам)
5. Дождитесь создания проекта (1-2 минуты)

### Шаг 2: Получение строки подключения

1. В проекте Supabase перейдите в **Settings** → **Database**
2. Найдите секцию **Connection string**
3. Выберите **URI** и скопируйте строку подключения
4. Формат: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`

### Шаг 3: Обновление Prisma Schema

Измените `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### Шаг 4: Настройка переменных окружения

**Локально (.env.local):**
```env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**На Vercel:**
1. Settings → Environment Variables
2. Добавьте `DATABASE_URL` со значением из Supabase

---

## Вариант 3: Neon (Serverless PostgreSQL)

### Шаг 1: Создание проекта на Neon

1. Зайдите на https://neon.tech
2. Создайте аккаунт
3. Создайте новый проект
4. Выберите регион

### Шаг 2: Получение строки подключения

1. В проекте Neon найдите **Connection string**
2. Скопируйте строку подключения

### Шаг 3: Обновление Prisma Schema

Аналогично варианту 2, измените provider на `postgresql`

---

## Общие шаги для всех вариантов

### Шаг 1: Обновление Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // Изменено
  url      = env("DATABASE_URL")
}

// Модели остаются без изменений
model Account {
  // ... существующие поля
}

model Session {
  // ... существующие поля
}

model User {
  // ... существующие поля
}

model VerificationToken {
  // ... существующие поля
}
```

### Шаг 2: Установка PostgreSQL драйвера (если нужно)

```bash
npm install pg
npm install --save-dev @types/pg
```

### Шаг 3: Создание миграции

```bash
# Удалите старую базу SQLite (если есть)
rm prisma/dev.db
rm prisma/dev.db-journal

# Создайте новую миграцию для PostgreSQL
npx prisma migrate dev --name init_postgresql

# Или если база уже создана на Vercel/Supabase
npx prisma db push
```

### Шаг 4: Генерация Prisma Client

```bash
npx prisma generate
```

### Шаг 5: Настройка переменных окружения

**Локально (.env.local):**
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**На Vercel:**
1. Settings → Environment Variables
2. Добавьте все необходимые переменные:
   - `DATABASE_URL` (строка подключения к PostgreSQL)
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (ваш домен на Vercel)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

### Шаг 6: Тестирование локально

```bash
# Проверьте подключение
npx prisma studio

# Запустите приложение
npm run dev
```

### Шаг 7: Деплой на Vercel

```bash
git add .
git commit -m "Migrate from SQLite to PostgreSQL"
git push origin main
```

Vercel автоматически запустит сборку с новой конфигурацией.

---

## Миграция данных (если есть существующие данные)

Если у вас уже есть данные в SQLite, их нужно перенести:

### Вариант 1: Экспорт/Импорт через Prisma Studio

1. Откройте SQLite базу: `npx prisma studio` (старая база)
2. Экспортируйте данные вручную или через скрипт
3. Импортируйте в PostgreSQL через Prisma Studio (новая база)

### Вариант 2: SQL скрипт

```bash
# Экспорт из SQLite
sqlite3 prisma/dev.db .dump > backup.sql

# Адаптация SQL для PostgreSQL (вручную или через инструменты)
# Импорт в PostgreSQL
psql $DATABASE_URL < backup_adapted.sql
```

---

## Проверка работы

После деплоя проверьте:

1. **Авторизация работает?** - Попробуйте зарегистрироваться/войти
2. **Данные сохраняются?** - Создайте тестового пользователя
3. **Сессии работают?** - Проверьте, что сессии сохраняются

---

## Откат на SQLite (если нужно)

Если что-то пошло не так, можно вернуться:

1. Измените `provider = "sqlite"` в `schema.prisma`
2. Верните `DATABASE_URL="file:./dev.db"` в `.env.local`
3. Запустите `npx prisma migrate reset`

---

## Полезные ссылки

- [Vercel Postgres Docs](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase Docs](https://supabase.com/docs)
- [Neon Docs](https://neon.tech/docs)
- [Prisma PostgreSQL Guide](https://www.prisma.io/docs/concepts/database-connectors/postgresql)

---

## Рекомендации

1. **Для начала:** Используйте Vercel Postgres (самый простой вариант)
2. **Для продакшена:** Рассмотрите Supabase или Neon для большей гибкости
3. **Бесплатные лимиты:**
   - Vercel Postgres: 256 MB storage, 60 hours compute/month
   - Supabase: 500 MB database, 2 GB bandwidth
   - Neon: 0.5 GB storage, unlimited compute (с ограничениями)






