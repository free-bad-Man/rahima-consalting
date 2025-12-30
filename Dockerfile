FROM node:20-alpine AS base

# Установка зависимостей для сборки
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json ./
COPY prisma ./prisma/

# Устанавливаем зависимости
RUN npm ci

# Стадия сборки
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Аргументы сборки (передаются из docker-compose)
ARG DATABASE_URL
ARG PRISMA_DATABASE_URL
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET

# Устанавливаем переменные окружения для сборки
ENV DATABASE_URL=$DATABASE_URL
ENV PRISMA_DATABASE_URL=$PRISMA_DATABASE_URL
ENV NEXTAUTH_SECRET=$NEXTAUTH_SECRET
ENV NEXTAUTH_URL=$NEXTAUTH_URL
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV NEXT_TELEMETRY_DISABLED=1

# Генерируем Prisma клиент и собираем приложение
RUN npm run build

# Стадия запуска
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Устанавливаем OpenSSL для Prisma
RUN apk add --no-cache openssl openssl-dev

# Создаем пользователя без root прав для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из стадии сборки
# В standalone режиме Next.js создает все необходимое в .next/standalone, включая node_modules
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Создаем директорию для uploads с правильными правами
RUN mkdir -p /app/uploads && chown -R nextjs:nodejs /app/uploads

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]

