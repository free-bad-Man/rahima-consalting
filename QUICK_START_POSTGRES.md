# Быстрый старт: Переключение на PostgreSQL

## Самый простой способ (Vercel Postgres)

### 1. Создайте базу данных на Vercel

1. Зайдите на https://vercel.com/dashboard
2. Выберите ваш проект
3. Перейдите в **Storage** → **Create Database** → **Postgres**
4. Создайте базу данных (бесплатный план доступен)

### 2. Vercel автоматически создаст переменные окружения:
- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL` ← **Используйте эту для Prisma**
- `POSTGRES_URL_NON_POOLING`

### 3. Настройте переменные окружения на Vercel

В настройках проекта (Settings → Environment Variables):
- Добавьте `DATABASE_URL` = значение из `POSTGRES_PRISMA_URL`
- Или измените `schema.prisma` на использование `POSTGRES_PRISMA_URL`

### 4. Обновите Prisma Schema (уже сделано)

Файл `prisma/schema.prisma` уже обновлен:
```prisma
datasource db {
  provider = "postgresql"  // ✅ Уже изменено
  url      = env("DATABASE_URL")
}
```

### 5. Установите PostgreSQL драйвер (если нужно)

```bash
npm install pg
npm install --save-dev @types/pg
```

### 6. Создайте миграцию

```bash
# Удалите старую SQLite базу (если есть)
rm prisma/dev.db
rm prisma/dev.db-journal

# Примените схему к PostgreSQL
npx prisma db push

# Или создайте миграцию
npx prisma migrate dev --name init_postgresql
```

### 7. Настройте локальную разработку

Создайте `.env.local`:
```env
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
```

**Для Vercel Postgres:**
- Скопируйте `POSTGRES_PRISMA_URL` из настроек Vercel
- Вставьте в `.env.local` как `DATABASE_URL`

### 8. Запустите локально

```bash
npx prisma generate
npm run dev
```

### 9. Деплой

```bash
git add .
git commit -m "Switch to PostgreSQL"
git push origin main
```

---

## Альтернатива: Supabase (бесплатно)

Если хотите использовать Supabase вместо Vercel Postgres:

1. Создайте проект на https://supabase.com
2. Settings → Database → Connection string → URI
3. Скопируйте строку подключения
4. Добавьте в `.env.local` и на Vercel как `DATABASE_URL`
5. Выполните шаги 6-9 выше

---

## Проверка

После деплоя проверьте:
- ✅ Регистрация работает
- ✅ Авторизация работает
- ✅ Данные сохраняются

---

Подробная инструкция: см. `MIGRATION_TO_POSTGRESQL.md`






