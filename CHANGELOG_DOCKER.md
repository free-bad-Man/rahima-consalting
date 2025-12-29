# Changelog - Миграция на Docker

Этот файл описывает все изменения, внесенные в проект для работы в Docker окружении на Beget.

## Дата: 2025-01-XX

### Основные изменения

Проект был адаптирован для работы в Docker контейнерах с использованием docker-compose. Все костыли и заглушки из рабочей версии на Beget были проанализированы и заменены на правильные решения.

---

## Изменения в конфигурации

### 1. `next.config.ts`

**Было (на Beget):**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true }, // ❌ КОСТЫЛЬ
};
```

**Стало:**
```typescript
const nextConfig: NextConfig = {
  output: 'standalone', // ✅ Правильно для Docker
  // Все настройки изображений, компилятора и оптимизации сохранены
  images: { ... },
  compiler: { ... },
  // typescript: { ignoreBuildErrors: true } - УДАЛЕНО ✅
};
```

**Изменения:**
- ✅ Сохранен `output: 'standalone'` для Docker
- ✅ Удален костыль `ignoreBuildErrors: true`
- ✅ Сохранены все важные настройки (images, compiler, poweredByHeader, compress)

---

### 2. `package.json`

**Было (локально):**
```json
"build": "prisma generate && prisma db push && next build"
```

**Стало:**
```json
"build": "prisma generate && next build",
"db:push": "prisma db push",
"db:migrate": "prisma migrate deploy"
```

**Изменения:**
- ✅ Убран `prisma db push` из build скрипта (правильно для production)
- ✅ Добавлены отдельные скрипты для работы с БД
- ✅ Миграции теперь применяются отдельно через `db:migrate`

---

### 3. API Routes - Добавлены директивы кэширования

**Изменение:** Во всех API routes добавлены директивы для работы в Docker:

```typescript
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
```

**Затронутые файлы (14 файлов):**
- `src/app/api/documents/route.ts`
- `src/app/api/documents/[id]/route.ts`
- `src/app/api/orders/route.ts`
- `src/app/api/orders/[id]/route.ts`
- `src/app/api/notifications/route.ts`
- `src/app/api/notifications/[id]/route.ts`
- `src/app/api/notifications/settings/route.ts`
- `src/app/api/profile/route.ts`
- `src/app/api/profile/avatar/route.ts`
- `src/app/api/profile/avatar/[...path]/route.ts`
- `src/app/api/auth/register/route.ts`
- `src/app/api/auth/[...nextauth]/route.ts`
- `src/app/api/auth/check-config/route.ts`
- `src/app/api/ai/chat/route.ts`

**Причина:** Эти директивы необходимы для корректной работы Next.js в Docker окружении, принудительно отключая кэширование для динамических роутов.

---

### 4. Логика работы с файлами (uploads)

**Проблема:** Код использовал разные пути для разных окружений (Vercel `/tmp`, локально `process.cwd()`), но для Docker нужен `/app/uploads`.

**Решение:** Унифицирована логика определения базовой директории во всех файлах работы с загрузками.

**Измененные файлы:**
- `src/app/api/documents/route.ts`
- `src/app/api/documents/[id]/route.ts`
- `src/app/api/profile/avatar/route.ts`
- `src/app/api/profile/avatar/[...path]/route.ts`

**Новая логика:**
```typescript
const baseDir = process.env.UPLOADS_DIR || 
  (process.env.VERCEL === "1" ? "/tmp" : null) ||
  (process.env.NODE_ENV === 'production' ? "/app" : null) ||
  process.cwd();
```

**Результат:**
- Docker: `/app/uploads` ✅
- Vercel: `/tmp/uploads` ✅
- Локально: `process.cwd()/uploads` ✅

---

## Новые файлы

### 1. `Dockerfile`

Создан оптимизированный multi-stage Dockerfile:
- **Стадия deps:** Установка зависимостей
- **Стадия builder:** Сборка приложения
- **Стадия runner:** Финальный образ для production

**Особенности:**
- Использует `node:20-alpine` для минимального размера
- Standalone output Next.js
- Безопасный запуск от пользователя `nextjs` (не root)
- Создана директория `/app/uploads` с правильными правами

---

### 2. `docker-compose.yml`

Создана конфигурация для запуска всех сервисов:

**Сервисы:**
- `npm` - nginx-proxy-manager для управления доменами
- `db` - PostgreSQL база данных
- `n8n` - Система автоматизации (опционально)
- `main-app` - Основное Next.js приложение

**Ключевые настройки:**
- ✅ Volume для uploads: `uploads_storage:/app/uploads`
- ✅ Healthcheck для БД и приложения
- ✅ `depends_on` с условием готовности БД
- ✅ `NODE_ENV=production` для всех сервисов
- ✅ Все необходимые переменные окружения

---

### 3. `.dockerignore`

Создан файл для оптимизации сборки Docker образа:
- Исключает `node_modules`, `.next`, тесты, документацию
- Исключает `uploads` (хранится в volume)
- Уменьшает размер контекста сборки

---

### 4. `DEPLOYMENT_DOCKER.md`

Создана полная документация по развертыванию:
- Инструкции по установке
- Настройка переменных окружения
- Применение миграций
- Управление сервисами
- Резервное копирование
- Решение проблем

---

## Удаленные костыли

### ❌ Удалено из `next.config.ts`:
- `typescript: { ignoreBuildErrors: true }` - скрывало ошибки TypeScript

### ✅ Исправлено в логике файлов:
- Унифицирована логика определения путей для разных окружений
- Убрана зависимость от `/tmp` для Docker

### ✅ Улучшено в `package.json`:
- Убран `prisma db push` из build скрипта (не подходит для production)

---

## Улучшения безопасности

1. ✅ Приложение запускается от непривилегированного пользователя `nextjs`
2. ✅ Все пароли и секреты должны быть изменены в `docker-compose.yml`
3. ✅ Healthcheck для проверки работоспособности сервисов
4. ✅ Зависимости сервисов настроены правильно

---

## Миграция данных

Если у вас уже есть рабочая версия на Beget:

1. **Экспортируйте базу данных:**
   ```bash
   # С текущего сервера
   pg_dump -U user -d database > backup.sql
   ```

2. **Импортируйте в новую БД:**
   ```bash
   docker-compose exec -T db psql -U n8n_admin n8n_db < backup.sql
   ```

3. **Скопируйте файлы uploads:**
   ```bash
   # Со старого сервера
   tar czf uploads_backup.tar.gz uploads/
   
   # На новом сервере
   docker run --rm -v docker-deployment_uploads_storage:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/uploads_backup.tar.gz"
   ```

---

## Обратная совместимость

✅ Все изменения обратно совместимы:
- Код работает локально (через `npm run dev`)
- Код работает на Vercel (если нужно)
- Код работает в Docker (новый вариант)

Единственное отличие - применение миграций БД теперь делается отдельно через `npm run db:migrate` или `npx prisma migrate deploy`.

---

## Следующие шаги

1. ✅ Обновить секреты в `docker-compose.yml`
2. ✅ Настроить домены в nginx-proxy-manager
3. ✅ Применить миграции БД
4. ✅ Настроить резервное копирование
5. ✅ Настроить мониторинг

Подробные инструкции см. в `DEPLOYMENT_DOCKER.md`.

