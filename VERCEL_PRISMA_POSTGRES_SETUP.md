# Настройка Prisma Postgres на Vercel

## Что такое "Prisma Postgres" на Vercel?

**Prisma Postgres** (или "Instant Serverless Postgres") на Vercel - это специальная интеграция, которая:
- ✅ Автоматически создает PostgreSQL базу данных
- ✅ Автоматически настраивает переменные окружения для Prisma
- ✅ Оптимизирована для работы с Prisma
- ✅ Идеально подходит для Next.js + Prisma проектов

**Это именно то, что вам нужно!**

---

## Пошаговая инструкция

### Шаг 1: Создание базы данных на Vercel

1. Зайдите на https://vercel.com/dashboard
2. Выберите ваш проект **rahima-consalting**
3. Перейдите в раздел **Storage** (или найдите вкладку с базами данных)
4. Нажмите **Create Database**
5. Выберите **Prisma Postgres** (или "Instant Serverless Postgres")
6. Выберите план:
   - **Hobby** (бесплатный) - для начала достаточно
   - **Pro** - для продакшена
7. Выберите регион (ближайший к вашим пользователям)
8. Нажмите **Create**

### Шаг 2: Автоматическая настройка

После создания базы данных Vercel **автоматически**:

1. **Создаст переменные окружения:**
   - `POSTGRES_URL` - основная строка подключения
   - `POSTGRES_PRISMA_URL` - строка подключения для Prisma (с connection pooling)
   - `POSTGRES_URL_NON_POOLING` - для миграций

2. **Интегрирует с вашим проектом:**
   - Переменные окружения будут доступны в проекте
   - Автоматически настроены для работы с Prisma

### Шаг 3: Настройка Prisma Schema

Ваш `prisma/schema.prisma` уже настроен правильно:
```prisma
datasource db {
  provider = "postgresql"  // ✅ Уже изменено
  url      = env("DATABASE_URL")
}
```

### Шаг 4: Настройка переменной DATABASE_URL

**Вариант A: Использовать POSTGRES_PRISMA_URL (Рекомендуется)**

Измените `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")  // Используем специальную переменную для Prisma
}
```

**Вариант B: Использовать DATABASE_URL**

В настройках проекта Vercel (Settings → Environment Variables):
- Добавьте новую переменную `DATABASE_URL`
- Значение: скопируйте из `POSTGRES_PRISMA_URL`
- Или просто используйте `POSTGRES_PRISMA_URL` в schema (Вариант A)

### Шаг 5: Локальная разработка

Создайте файл `.env.local` в корне проекта:

```env
# Скопируйте значение POSTGRES_PRISMA_URL из Vercel
DATABASE_URL="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"

# Или если используете POSTGRES_PRISMA_URL в schema:
POSTGRES_PRISMA_URL="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15"

# Остальные переменные
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

**Где найти строку подключения:**
1. Vercel Dashboard → Ваш проект → Storage
2. Выберите созданную базу данных
3. В разделе **Connection String** скопируйте `POSTGRES_PRISMA_URL`

### Шаг 6: Применение схемы к базе данных

```bash
# Установите зависимости (если еще не установили)
npm install

# Примените схему Prisma к базе данных
npx prisma db push

# Или создайте миграцию (рекомендуется для продакшена)
npx prisma migrate dev --name init_postgresql

# Сгенерируйте Prisma Client
npx prisma generate
```

### Шаг 7: Проверка локально

```bash
# Запустите приложение
npm run dev

# Откройте Prisma Studio для просмотра данных
npx prisma studio
```

### Шаг 8: Деплой на Vercel

```bash
git add .
git commit -m "Configure Prisma Postgres for Vercel"
git push origin main
```

Vercel автоматически:
- Установит зависимости
- Запустит `prisma generate` (благодаря `postinstall` скрипту)
- Применит миграции (если используете `prisma migrate`)
- Задеплоит приложение

---

## Проверка после деплоя

1. **Проверьте авторизацию:**
   - Зайдите на ваш сайт
   - Попробуйте зарегистрироваться
   - Попробуйте войти

2. **Проверьте базу данных:**
   - Vercel Dashboard → Storage → Ваша база данных
   - Должны появиться таблицы: `User`, `Account`, `Session`, `VerificationToken`

3. **Проверьте логи:**
   - Vercel Dashboard → Ваш проект → Logs
   - Не должно быть ошибок подключения к базе данных

---

## Важные моменты

### Connection Pooling

Vercel Postgres использует **PgBouncer** для connection pooling:
- `POSTGRES_PRISMA_URL` - с pooling (для Prisma Client)
- `POSTGRES_URL_NON_POOLING` - без pooling (для миграций)

**Всегда используйте `POSTGRES_PRISMA_URL` для Prisma!**

### Миграции

Для миграций используйте `POSTGRES_URL_NON_POOLING`:
```bash
# Временно измените DATABASE_URL для миграций
DATABASE_URL="<POSTGRES_URL_NON_POOLING>" npx prisma migrate deploy
```

Или используйте Vercel CLI:
```bash
vercel env pull .env.local
npx prisma migrate deploy
```

### Бесплатный план (Hobby)

- **256 MB** storage
- **60 hours** compute/month
- Достаточно для начала и небольших проектов

---

## Устранение проблем

### Ошибка: "Prisma Client not generated"
```bash
npx prisma generate
```

### Ошибка: "Connection timeout"
- Проверьте, что используете `POSTGRES_PRISMA_URL` (не `POSTGRES_URL`)
- Проверьте, что переменные окружения правильно настроены на Vercel

### Ошибка: "Table does not exist"
```bash
npx prisma db push
# или
npx prisma migrate deploy
```

---

## Резюме

✅ **Prisma Postgres на Vercel** - это правильный выбор  
✅ Автоматически настраивается  
✅ Оптимизирована для Prisma  
✅ Идеально для Next.js проектов  

Просто создайте базу данных на Vercel, и все будет работать!






