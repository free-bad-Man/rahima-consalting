# Быстрое исправление: Применение схемы базы данных

## Самый простой способ

### Шаг 1: Получите строку подключения из Vercel

1. Зайдите на https://vercel.com/dashboard
2. Выберите ваш проект
3. Перейдите в **Storage** → выберите вашу базу данных PostgreSQL
4. Найдите **Connection String**
5. Скопируйте значение `POSTGRES_URL_NON_POOLING` (или `POSTGRES_PRISMA_URL`)

### Шаг 2: Примените схему локально

1. **Создайте/обновите файл `.env.local`** в корне проекта:
   ```env
   POSTGRES_PRISMA_URL="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require&pgbouncer=true"
   POSTGRES_URL_NON_POOLING="postgres://default:xxx@xxx.vercel-storage.com:5432/verceldb?sslmode=require"
   ```
   
   Замените `xxx` на реальные значения из Vercel.

2. **Временно измените `prisma/schema.prisma`** (или используйте переменную напрямую):
   
   Используйте `POSTGRES_URL_NON_POOLING` для применения схемы:
   
   Временно замените в `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_URL_NON_POOLING")  // Временно для миграций
   }
   ```

3. **Примените схему**:
   ```bash
   npx prisma db push
   ```

   Это создаст все таблицы в базе данных на Vercel.

4. **Верните обратно `POSTGRES_PRISMA_URL`** в `schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("POSTGRES_PRISMA_URL")  // Для работы приложения
   }
   ```

5. **Проверьте**:
   ```bash
   npx prisma studio
   ```
   
   Должны появиться таблицы: `User`, `Account`, `Session`, `VerificationToken`

### Шаг 3: Проверьте на Vercel

1. Зайдите на ваш сайт на Vercel
2. Попробуйте авторизоваться через Google
3. Должно работать! ✅

---

## Альтернативный способ (через переменную окружения)

Можно не менять `schema.prisma`, а просто использовать переменную окружения:

```bash
# Временно установите DATABASE_URL
export DATABASE_URL="<POSTGRES_URL_NON_POOLING из Vercel>"

# Или в PowerShell:
$env:DATABASE_URL="<POSTGRES_URL_NON_POOLING из Vercel>"

# Примените схему
npx prisma db push

# Уберите переменную
$env:DATABASE_URL=""
```

---

## Что происходит?

- `prisma db push` применяет схему из `schema.prisma` к базе данных
- Создаются таблицы: `User`, `Account`, `Session`, `VerificationToken`
- После этого NextAuth сможет сохранять данные пользователей и сессии

---

## Если не работает

1. Убедитесь, что строка подключения правильная
2. Проверьте, что база данных доступна (не заблокирована)
3. Попробуйте использовать `POSTGRES_URL` вместо `POSTGRES_URL_NON_POOLING`
4. Проверьте логи на Vercel для деталей ошибки






