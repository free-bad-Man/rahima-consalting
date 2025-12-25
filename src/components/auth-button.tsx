"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import Image from "next/image";

interface AuthButtonProps {
  onSignInClick?: () => void;
  onRegisterClick?: () => void;
}

export default function AuthButton({ onSignInClick, onRegisterClick }: AuthButtonProps) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 animate-pulse" />
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 text-white/70 text-xs sm:text-sm">
          {session.user.image ? (
            <Image
              src={session.user.image}
              alt={session.user.name || session.user.email || "User"}
              width={32}
              height={32}
              className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-white/20 object-cover"
              unoptimized
            />
          ) : (
            <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <User className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white/70" />
            </div>
          )}
          <span className="hidden sm:inline text-white/90 truncate max-w-[120px] md:max-w-none">
            {session.user.name || session.user.email}
          </span>
        </div>
        <button
          onClick={() => signOut()}
          className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white text-xs sm:text-sm transition-colors touch-manipulation"
          title="Выйти"
          aria-label="Выйти из аккаунта"
        >
          <LogOut className="w-4 h-4 sm:w-4 md:w-5 md:h-5" />
          <span className="hidden sm:inline">Выйти</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => signIn("google")}
        className="flex items-center justify-center gap-1.5 sm:gap-2 min-h-[44px] sm:min-h-0 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 bg-gray-900/30 text-white text-[11px] sm:text-xs font-medium rounded-md border border-white/20 hover:bg-gray-900/40 active:bg-gray-900/50 shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap w-full touch-manipulation"
        aria-label="Войти через Google"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" viewBox="0 0 24 24">
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
        <span className="truncate">Войти с Google</span>
      </button>
      <button
        onClick={onRegisterClick || (() => window.location.href = "/auth/register")}
        className="flex items-center justify-center min-h-[44px] sm:min-h-0 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 bg-gray-900/30 text-white text-[11px] sm:text-xs font-medium rounded-md border border-white/20 hover:bg-gray-900/40 active:bg-gray-900/50 shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap w-full touch-manipulation"
        aria-label="Зарегистрироваться"
      >
        Регистрация
      </button>
      <button
        onClick={onSignInClick || (() => window.location.href = "/auth/signin")}
        className="flex items-center justify-center min-h-[44px] sm:min-h-0 px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-2 bg-gray-900/30 text-white text-[11px] sm:text-xs font-medium rounded-md border border-white/20 hover:bg-gray-900/40 active:bg-gray-900/50 shadow-sm transition-all duration-200 hover:shadow-md whitespace-nowrap w-full touch-manipulation"
        aria-label="Войти в аккаунт"
      >
        Вход
      </button>
    </>
  );
}

