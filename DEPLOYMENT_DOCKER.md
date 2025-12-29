# Развертывание проекта на Beget с Docker

Этот документ описывает процесс развертывания проекта на Beget с использованием Docker и docker-compose.

## Предварительные требования

- Ubuntu сервер на Beget с доступом SSH
- Docker и Docker Compose установлены
- Домен настроен и указывает на IP сервера

## Структура проекта

Проект состоит из следующих сервисов:
- **nginx-proxy-manager** - обратный прокси для управления доменами и SSL
- **PostgreSQL** - база данных (общая для n8n и основного приложения)
- **n8n** - система автоматизации (опционально)
- **main-app** - основное Next.js приложение

## Быстрый старт

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker (если не установлен)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose (если не установлен)
sudo apt install docker-compose -y

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Клонирование и настройка проекта

```bash
# Клонируем репозиторий (замените на ваш путь)
cd /path/to/your/projects
git clone <your-repo-url> docker-deployment

# Переходим в директорию с docker-compose
cd docker-deployment/docker  # или где находится docker-compose.yml
```

### 3. Настройка переменных окружения

**Важно:** Перед запуском необходимо обновить следующие значения в `docker-compose.yml`:

1. **Пароли и секреты:**
   - `POSTGRES_PASSWORD` - пароль для PostgreSQL
   - `NEXTAUTH_SECRET` - секретный ключ для NextAuth (сгенерируйте случайную строку)
   - `N8N_ENCRYPTION_KEY` - ключ шифрования для n8n

2. **Домены:**
   - `NEXTAUTH_URL` - основной домен приложения (например: `https://rahima-consulting.ru`)
   - `N8N_HOST` - домен для n8n (например: `ai.rahima-consulting.ru`)

3. **Google OAuth:**
   - `GOOGLE_CLIENT_ID` - ID клиента Google OAuth
   - `GOOGLE_CLIENT_SECRET` - секрет Google OAuth

### 4. Генерация секретов

```bash
# Генерация NEXTAUTH_SECRET
openssl rand -base64 32

# Генерация N8N_ENCRYPTION_KEY
openssl rand -base64 32
```

### 5. Применение миграций базы данных

Перед первым запуском необходимо применить миграции Prisma:

```bash
# Вариант 1: Вручную через docker exec (после запуска контейнера)
docker-compose up -d db
docker-compose exec main-app npx prisma migrate deploy

# Вариант 2: Через отдельный запуск
docker-compose run --rm main-app npx prisma migrate deploy

# Вариант 3: Если используете prisma db push (не рекомендуется для production)
docker-compose run --rm main-app npx prisma db push
```

### 6. Запуск сервисов

```bash
# Сборка и запуск всех сервисов
docker-compose up -d --build

# Просмотр логов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f main-app
docker-compose logs -f db
```

### 7. Настройка nginx-proxy-manager

1. Откройте панель управления nginx-proxy-manager: `http://your-server-ip:81`
2. Войдите с учетными данными по умолчанию:
   - Email: `admin@example.com`
   - Password: `changeme`
3. Настройте прокси-хосты для ваших доменов:
   - **Основной домен** (`rahima-consulting.ru`) → `main-app:3000`
   - **n8n домен** (`ai.rahima-consulting.ru`) → `n8n:5678`
4. Настройте SSL сертификаты через Let's Encrypt

## Управление сервисами

### Остановка сервисов

```bash
docker-compose down
```

### Перезапуск сервисов

```bash
docker-compose restart
# или
docker-compose restart main-app
```

### Обновление приложения

```bash
# Остановка текущей версии
docker-compose down

# Получение обновлений из git
git pull

# Пересборка и запуск
docker-compose up -d --build
```

### Просмотр статуса

```bash
docker-compose ps
```

### Просмотр использования ресурсов

```bash
docker stats
```

## Резервное копирование

### База данных

```bash
# Создание резервной копии
docker-compose exec db pg_dump -U n8n_admin n8n_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из резервной копии
docker-compose exec -T db psql -U n8n_admin n8n_db < backup_20240101_120000.sql
```

### Файлы uploads

```bash
# Создание резервной копии volume
docker run --rm -v docker-deployment_uploads_storage:/data -v $(pwd):/backup alpine tar czf /backup/uploads_backup_$(date +%Y%m%d).tar.gz -C /data .

# Восстановление volume
docker run --rm -v docker-deployment_uploads_storage:/data -v $(pwd):/backup alpine sh -c "cd /data && tar xzf /backup/uploads_backup_20240101.tar.gz"
```

## Решение проблем

### Приложение не запускается

1. Проверьте логи:
   ```bash
   docker-compose logs main-app
   ```

2. Проверьте, что база данных доступна:
   ```bash
   docker-compose exec db pg_isready -U n8n_admin
   ```

3. Проверьте переменные окружения:
   ```bash
   docker-compose exec main-app env | grep -E "DATABASE|NEXTAUTH|GOOGLE"
   ```

### Ошибки подключения к базе данных

1. Убедитесь, что база данных запущена:
   ```bash
   docker-compose ps db
   ```

2. Проверьте строку подключения в docker-compose.yml

3. Проверьте healthcheck базы данных:
   ```bash
   docker-compose exec db pg_isready -U n8n_admin -d n8n_db
   ```

### Файлы не сохраняются

1. Проверьте, что volume подключен:
   ```bash
   docker-compose exec main-app ls -la /app/uploads
   ```

2. Проверьте права доступа:
   ```bash
   docker-compose exec main-app ls -ld /app/uploads
   ```

3. Пересоздайте volume при необходимости:
   ```bash
   docker-compose down -v
   docker-compose up -d
   ```

### Проблемы с Prisma миграциями

```bash
# Просмотр статуса миграций
docker-compose exec main-app npx prisma migrate status

# Применение миграций вручную
docker-compose exec main-app npx prisma migrate deploy

# Сброс базы данных (ОСТОРОЖНО: удалит все данные!)
docker-compose exec main-app npx prisma migrate reset
```

## Оптимизация производительности

### Ограничение ресурсов

Добавьте в `docker-compose.yml` для каждого сервиса:

```yaml
deploy:
  resources:
    limits:
      cpus: '1'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M
```

### Настройка PostgreSQL

Для production рекомендуется создать отдельную базу данных для приложения или настроить connection pooling.

## Безопасность

1. **Измените все пароли по умолчанию**
2. **Используйте сильные секретные ключи**
3. **Настройте firewall** для ограничения доступа к портам
4. **Регулярно обновляйте** Docker образы
5. **Используйте SSL сертификаты** для всех доменов
6. **Не коммитьте** секреты в git

## Мониторинг

### Логи

```bash
# Все логи
docker-compose logs -f

# Логи за последний час
docker-compose logs --since 1h

# Логи с фильтрацией
docker-compose logs main-app | grep ERROR
```

### Мониторинг ресурсов

```bash
# Использование диска
docker system df

# Использование ресурсов в реальном времени
docker stats
```

## Обновление проекта

1. Получите последние изменения из git
2. Остановите сервисы
3. Пересоберите образы
4. Примените миграции базы данных (если есть)
5. Запустите сервисы

```bash
git pull
docker-compose down
docker-compose build --no-cache
docker-compose up -d
docker-compose exec main-app npx prisma migrate deploy
```

## Полезные команды

```bash
# Просмотр всех контейнеров
docker ps -a

# Очистка неиспользуемых ресурсов
docker system prune -a

# Просмотр информации о volume
docker volume ls
docker volume inspect docker-deployment_uploads_storage

# Подключение к контейнеру для отладки
docker-compose exec main-app sh
docker-compose exec db psql -U n8n_admin n8n_db
```

## Поддержка

При возникновении проблем проверьте:
1. Логи сервисов
2. Статус контейнеров
3. Переменные окружения
4. Доступность базы данных
5. Настройки nginx-proxy-manager

