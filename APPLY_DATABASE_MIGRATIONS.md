# Применение миграций базы данных на Vercel

## Проблема
База данных PostgreSQL создана на Vercel, но таблицы (схема) еще не применены. Из-за этого авторизация через Google не работает.

## Решение

### Вариант 1: Через Vercel CLI (Рекомендуется)

1. **Установите Vercel CLI** (если еще не установлен):
   ```bash
   npm i -g vercel
   ```

2. **Войдите в Vercel**:
   ```bash
   vercel login
   ```

3. **Подключите проект** (если нужно):
   ```bash
   vercel link
   ```

4. **Скачайте переменные окружения**:
   ```bash
   vercel env pull .env.local
   ```

5. **Создайте миграцию локально** (если еще не создана):
   ```bash
   npx prisma migrate dev --name init_postgresql
   ```
   
   Это создаст папку `prisma/migrations` с файлами миграций.

6. **Примените миграции к базе на Vercel**:
   ```bash
   # Используйте POSTGRES_URL_NON_POOLING для миграций
   DATABASE_URL="<значение POSTGRES_URL_NON_POOLING из Vercel>" npx prisma migrate deploy
   ```
   
   Или временно измените `.env.local`:
   ```env
   DATABASE_URL="<POSTGRES_URL_NON_POOLING из Vercel>"
   ```
   Затем:
   ```bash
   npx prisma migrate deploy
   ```

7. **Закоммитьте миграции** (если создали новые):
   ```bash
   git add prisma/migrations
   git commit -m "Add Prisma migrations"
   git push origin main
   ```

---

### Вариант 2: Использовать prisma db push (Быстро, но без миграций)

**Внимание:** Этот вариант проще, но не создает файлы миграций.

1. **Получите строку подключения** из Vercel:
   - Vercel Dashboard → Ваш проект → Storage → Ваша база данных
   - Скопируйте `POSTGRES_PRISMA_URL` или `POSTGRES_URL_NON_POOLING`

2. **Создайте `.env.local`** (или обновите существующий):
   ```env
   POSTGRES_PRISMA_URL="postgres://..."
   ```

3. **Примените схему**:
   ```bash
   npx prisma db push
   ```

   Это создаст все таблицы в базе данных без создания файлов миграций.

4. **Проверьте**:
   ```bash
   npx prisma studio
   ```
   
   Должны появиться таблицы: `User`, `Account`, `Session`, `VerificationToken`

---

### Вариант 3: Через Vercel Dashboard + Vercel CLI

1. **Установите Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Скачайте переменные окружения**:
   ```bash
   vercel env pull .env.local
   ```

3. **Создайте миграцию**:
   ```bash
   npx prisma migrate dev --name init_postgresql
   ```

4. **Примените миграцию** (используя POSTGRES_URL_NON_POOLING):
   ```bash
   # Временно измените DATABASE_URL в .env.local на POSTGRES_URL_NON_POOLING
   npx prisma migrate deploy
   ```

5. **Верните обратно POSTGRES_PRISMA_URL** в `.env.local` для работы приложения

6. **Закоммитьте и запушьте миграции**:
   ```bash
   git add prisma/migrations
   git commit -m "Add database migrations"
   git push origin main
   ```

---

## Автоматическое применение миграций при деплое

Чтобы миграции применялись автоматически при каждом деплое, добавьте в `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

**Внимание:** Для миграций в `build` скрипте нужно использовать `POSTGRES_URL_NON_POOLING`, но его нет в окружении сборки по умолчанию.

Лучше использовать отдельный скрипт или применять миграции вручную один раз.

---

## Проверка работы

После применения миграций:

1. **Проверьте таблицы в базе**:
   - Vercel Dashboard → Storage → Ваша база данных
   - Или используйте `npx prisma studio` локально с подключением к Vercel

2. **Попробуйте авторизацию через Google**:
   - Должно работать без ошибок
   - Пользователь должен создаваться в таблице `User`
   - Сессия должна создаваться в таблице `Session`

---

## Если что-то пошло не так

1. **Проверьте переменные окружения на Vercel**:
   - Settings → Environment Variables
   - Должны быть: `POSTGRES_PRISMA_URL`, `POSTGRES_URL`, `POSTGRES_URL_NON_POOLING`

2. **Проверьте логи Vercel**:
   - Ваш проект → Logs
   - Ищите ошибки подключения к базе данных

3. **Убедитесь, что схема Prisma правильная**:
   - `prisma/schema.prisma` использует `provider = "postgresql"`
   - `url = env("POSTGRES_PRISMA_URL")`






