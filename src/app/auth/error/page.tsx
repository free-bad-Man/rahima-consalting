"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return (
          <>
            <p className="mb-2">Проблема с конфигурацией сервера.</p>
            <p className="text-xs text-white/50">
              Проверьте, что в настройках Vercel установлены переменные окружения:
              <br />• GOOGLE_CLIENT_ID
              <br />• GOOGLE_CLIENT_SECRET
              <br />• NEXTAUTH_SECRET
              <br />• NEXTAUTH_URL=https://www.rahima-consulting.ru
            </p>
          </>
        );
      case "AccessDenied":
        return "Доступ запрещен";
      case "Verification":
        return "Ошибка верификации";
      case "OAuthAccountNotLinked":
        return "Аккаунт с таким email уже существует. Пожалуйста, войдите через email и пароль, или используйте другой Google аккаунт.";
      default:
        return "Произошла ошибка при входе";
    }
  };

  return (
    <p className="text-white/70 text-center mb-8">
      {getErrorMessage(error)}
    </p>
  );
}

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 p-8 shadow-2xl max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">
          Ошибка входа
        </h1>
        <Suspense fallback={<p className="text-white/70 text-center mb-8">Загрузка...</p>}>
          <ErrorContent />
        </Suspense>
        <Link
          href="/auth/signin"
          className="block w-full text-center bg-white text-gray-900 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Попробовать снова
        </Link>
      </div>
    </div>
  );
}

