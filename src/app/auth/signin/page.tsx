"use client";

import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import Link from "next/link";
import { X } from "lucide-react";

function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleClose = () => {
    router.push("/");
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Неверный email или пароль");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Произошла ошибка при входе");
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsGoogleLoading(true);
    signIn("google", { callbackUrl });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-[101] bg-[#0A0A0A]/85 border border-white/10 rounded-3xl p-8 shadow-2xl max-w-md w-full mx-4">
        {/* Кнопка закрытия */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Закрыть"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Логотип */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo.png"
            alt="Rahima Consulting"
            className="h-12 w-auto object-contain"
            style={{ 
              filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(2000%) hue-rotate(250deg) brightness(1.5) contrast(1.1)',
            }}
          />
        </div>

        <h1 className="text-xl font-semibold text-white mb-2 text-center">
          Вход в систему
        </h1>
        <p className="text-white/70 text-sm mb-8 text-center">
          Войдите в свой аккаунт
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs">
            {error}
          </div>
        )}

        {searchParams.get("error") === "OAuthAccountNotLinked" && (
          <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200 text-xs">
            Аккаунт с таким email уже существует. Пожалуйста, войдите через email и пароль, или используйте другой Google аккаунт.
          </div>
        )}

        <form onSubmit={handleEmailSignIn} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/30 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="block text-xs font-medium text-white/50">
                Пароль
              </label>
              <Link 
                href="/auth/forgot-password" 
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                Забыли пароль?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/30 rounded-lg text-white text-sm placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="Введите пароль"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-2.5 bg-white/10 border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-[#0A0A0A] text-white/50">или</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/30 text-white text-sm font-medium rounded-lg hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed py-2.5"
        >
          {isGoogleLoading ? (
            <span>Загрузка...</span>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Войти через Google
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-white/50 text-xs">
            Нет аккаунта?{" "}
            <Link href="/auth/register" className="text-white/80 hover:text-white underline">
              Зарегистрироваться
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-white">Загрузка...</div>
      </div>
    }>
      <SignInForm />
    </Suspense>
  );
}

