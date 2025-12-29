# Docker Deployment - Быстрый старт

Краткое руководство по развертыванию проекта в Docker на Beget.

## 🚀 Быстрый старт

### 1. Предварительные требования

- Docker и Docker Compose установлены
- Доступ к серверу по SSH

### 2. Настройка

```bash
# 1. Клонируйте проект
git clone <your-repo-url>
cd project-directory

# 2. Обновите секреты в docker-compose.yml:
#    - POSTGRES_PASSWORD
#    - NEXTAUTH_SECRET (сгенерируйте: openssl rand -base64 32)
#    - N8N_ENCRYPTION_KEY (сгенерируйте: openssl rand -base64 32)
#    - GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET
#    - NEXTAUTH_URL и N8N_HOST

# 3. Запустите сервисы
docker-compose up -d --build

# 4. Примените миграции БД
docker-compose exec main-app npx prisma migrate deploy

# 5. Проверьте логи
docker-compose logs -f
```

### 3. Настройка nginx-proxy-manager

1. Откройте `http://your-server-ip:81`
2. Войдите (по умолчанию: `admin@example.com` / `changeme`)
3. Настройте Proxy Hosts:
   - **Основной домен** → `main-app:3000`
   - **n8n домен** → `n8n:5678`
4. Получите SSL сертификаты через Let's Encrypt

## 📋 Основные команды

```bash
# Запуск
docker-compose up -d

# Остановка
docker-compose down

# Перезапуск
docker-compose restart

# Логи
docker-compose logs -f main-app

# Обновление
git pull && docker-compose up -d --build
```

## 🔧 Настройка переменных окружения

Все переменные настраиваются в `docker-compose.yml` в секции `environment` сервиса `main-app`:

```yaml
environment:
  - DATABASE_URL=postgresql://user:password@db:5432/database
  - PRISMA_DATABASE_URL=postgresql://user:password@db:5432/database
  - NEXTAUTH_SECRET=your-secret-here
  - NEXTAUTH_URL=https://your-domain.com
  - GOOGLE_CLIENT_ID=your-google-client-id
  - GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 📦 Структура сервисов

- **npm** - nginx-proxy-manager (порты 80, 443, 81)
- **db** - PostgreSQL база данных
- **n8n** - Система автоматизации (опционально)
- **main-app** - Next.js приложение (порт 3000, внутренний)

## 💾 Резервное копирование

```bash
# База данных
docker-compose exec db pg_dump -U n8n_admin n8n_db > backup.sql

# Файлы uploads
docker run --rm -v project_uploads_storage:/data -v $(pwd):/backup alpine tar czf /backup/uploads_backup.tar.gz -C /data .
```

## ❓ Проблемы?

См. полную документацию в [DEPLOYMENT_DOCKER.md](./DEPLOYMENT_DOCKER.md)

**Основные проблемы:**
- Приложение не запускается → проверьте логи: `docker-compose logs main-app`
- Ошибки БД → проверьте, что БД запущена: `docker-compose ps db`
- Файлы не сохраняются → проверьте volume: `docker volume ls`

## 📚 Дополнительная документация

- [DEPLOYMENT_DOCKER.md](./DEPLOYMENT_DOCKER.md) - Полная документация по развертыванию
- [CHANGELOG_DOCKER.md](./CHANGELOG_DOCKER.md) - Описание всех изменений

