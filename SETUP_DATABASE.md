# Настройка базы данных - пошаговая инструкция

## Шаг 1: Скопируйте строку подключения из Vercel

1. Зайдите на https://vercel.com/dashboard
2. Ваш проект → **Storage** → ваша база данных
3. Скопируйте значение **`POSTGRES_URL`** (без pooling, для миграций)

## Шаг 2: Создайте .env.local

Создайте файл `.env.local` в корне проекта:

```env
# Для миграций (скопируйте POSTGRES_URL из Vercel)
DATABASE_URL="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require"

# Для работы приложения (скопируйте PRISMA_DATABASE_URL из Vercel)
PRISMA_DATABASE_URL="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true"
```

**Замените `xxx` на реальные значения из Vercel!**

## Шаг 3: Примените схему

```powershell
npx prisma db push
```

Это создаст все таблицы в базе данных на Vercel.

## Шаг 4: После применения схемы

На Vercel переменные уже настроены автоматически:
- `PRISMA_DATABASE_URL` - для работы приложения ✅
- `POSTGRES_URL` - для миграций ✅
- `DATABASE_URL` - может быть любая из них

Приложение на Vercel будет использовать `DATABASE_URL`, который вы можете настроить как `PRISMA_DATABASE_URL` в настройках проекта.

Или оставьте `schema.prisma` с `DATABASE_URL`, а на Vercel добавьте:
- `DATABASE_URL` = значение из `PRISMA_DATABASE_URL`

## Проверка

После применения схемы попробуйте авторизоваться через Google на Vercel - должно работать! ✅






