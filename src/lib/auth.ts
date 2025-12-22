// Настройка прокси должна быть выполнена первой
import './setup-proxy';

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Проверка обязательных переменных окружения
if (!process.env.GOOGLE_CLIENT_ID) {
  console.warn("⚠️ GOOGLE_CLIENT_ID не установлен");
}
if (!process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("⚠️ GOOGLE_CLIENT_SECRET не установлен");
}
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ NEXTAUTH_SECRET не установлен");
}
if (!process.env.NEXTAUTH_URL) {
  console.warn("⚠️ NEXTAUTH_URL не установлен - это может вызвать проблемы с OAuth");
  console.warn("⚠️ Установите NEXTAUTH_URL=https://www.rahima-consulting.ru в переменных окружения Vercel");
} else {
  console.log("✅ NEXTAUTH_URL установлен:", process.env.NEXTAUTH_URL);
}

// Проверяем наличие обязательных переменных для Google провайдера
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
const nextAuthSecret = process.env.NEXTAUTH_SECRET;
const nextAuthUrl = process.env.NEXTAUTH_URL;

// Формируем провайдеры только если есть необходимые переменные
const providers = [];

if (googleClientId && googleClientSecret) {
  providers.push(
    Google({
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  );
} else {
  console.error("❌ Google OAuth не настроен: отсутствуют GOOGLE_CLIENT_ID или GOOGLE_CLIENT_SECRET");
}

providers.push(
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      },
    })
);

if (!nextAuthSecret) {
  console.error("❌ NEXTAUTH_SECRET не установлен - это критическая ошибка!");
  throw new Error("NEXTAUTH_SECRET должен быть установлен в переменных окружения");
}

if (providers.length === 0) {
  console.error("❌ Нет настроенных провайдеров аутентификации!");
  throw new Error("Должен быть настроен хотя бы один провайдер аутентификации");
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  providers: providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      // Если это OAuth провайдер (Google) и у пользователя есть email
      if (account?.provider === "google" && user.email) {
        // Проверяем, существует ли пользователь с таким email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // Если пользователь существует, но не имеет аккаунта Google
        if (existingUser) {
          // Проверяем, есть ли уже привязанный Google аккаунт
          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: "google",
            },
          });

          // Если Google аккаунт не привязан, создаем связь
          if (!existingAccount && account.providerAccountId) {
            try {
              await prisma.account.create({
                data: {
                  userId: existingUser.id,
                  type: account.type || "oauth",
                  provider: account.provider,
                  providerAccountId: account.providerAccountId,
                  refresh_token: account.refresh_token || null,
                  access_token: account.access_token || null,
                  expires_at: account.expires_at || null,
                  token_type: account.token_type || null,
                  scope: account.scope || null,
                  id_token: account.id_token || null,
                  session_state: typeof account.session_state === "string" ? account.session_state : null,
                },
              });
              console.log(`✅ Google аккаунт связан с существующим пользователем: ${user.email}`);
            } catch (error) {
              console.error("❌ Ошибка при связывании аккаунта:", error);
              // Продолжаем, так как аккаунт может уже существовать
            }
          }
          // Разрешаем вход, так как аккаунты теперь связаны
          return true;
        }
      }
      // Для всех остальных случаев разрешаем вход
      return true;
    },
    async session({ session, token, user }) {
      // Для JWT strategy используем token
      if (token) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.image as string;
      }
      // Для database strategy используем user
      if (user) {
        (session.user as any).id = user.id;
        if (user.image) session.user.image = user.image;
        if (user.name) session.user.name = user.name;
        if (user.email) session.user.email = user.email;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt", // Используем JWT для поддержки Credentials провайдера
  },
  secret: nextAuthSecret || "fallback-secret-change-in-production",
  trustHost: true,
  // Добавляем явную проверку конфигурации
  debug: process.env.NODE_ENV === "development",
});

