"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import { Drawer } from "vaul";
import { useMediaQuery } from "@/hooks/use-media-query";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: "signin" | "register";
}

export default function AuthModal({ isOpen, onClose, initialType = "signin" }: AuthModalProps) {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [currentForm, setCurrentForm] = useState<"signin" | "register">(initialType);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  // Обновляем форму при изменении initialType
  useEffect(() => {
    if (isOpen) {
      setCurrentForm(initialType);
      setFormData({
        email: "",
        password: "",
        name: "",
        confirmPassword: "",
      });
      setError("");
    }
  }, [initialType, isOpen]);

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
        onClose();
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
    signIn("google", { callbackUrl: window.location.pathname });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (formData.password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Ошибка при регистрации");
        setIsLoading(false);
        return;
      }

      // После успешной регистрации автоматически входим
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        setError("Регистрация успешна, но вход не удался. Попробуйте войти вручную.");
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        onClose();
        router.refresh();
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("Произошла ошибка при регистрации");
      setIsLoading(false);
    }
  };

  const formContent = (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          {currentForm === "signin" ? "Вход в систему" : "Регистрация"}
        </h2>
        {!isMobile && (
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <p className="text-white/70 text-xs md:text-sm mb-6">
        {currentForm === "signin" ? "Войдите в свой аккаунт" : "Создайте новый аккаунт"}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-xs">
          {error}
        </div>
      )}

      {currentForm === "signin" ? (
        <form onSubmit={handleEmailSignIn} className="space-y-3 mb-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="block text-xs font-medium text-white/50">
                Пароль
              </label>
              <a 
                href="/auth/forgot-password" 
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                onClick={onClose}
              >
                Забыли пароль?
              </a>
            </div>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="Введите пароль"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-3 py-2 bg-white/10 border border-white/30 text-white text-xs font-medium rounded-lg hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Вход..." : "Войти"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3 mb-4">
          <div>
            <label htmlFor="name" className="block text-xs font-medium text-white/50 mb-1.5">
              Имя
            </label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="Введите ваше имя"
              required
            />
          </div>

          <div>
            <label htmlFor="register-email" className="block text-xs font-medium text-white/50 mb-1.5">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="register-password" className="block text-xs font-medium text-white/50 mb-1.5">
              Пароль
            </label>
            <input
              id="register-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="Введите пароль"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-medium text-white/50 mb-1.5">
              Подтвердите пароль
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="w-full px-3 py-2 bg-white/5 border border-white/30 rounded-lg text-white text-xs placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/50 transition-colors"
              placeholder="Повторите пароль"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center px-3 py-2 bg-white/10 border border-white/30 text-white text-xs font-medium rounded-lg hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Регистрация..." : "Зарегистрироваться"}
          </button>
        </form>
      )}

      <div className="relative mb-4">
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
        className="w-full flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white text-xs font-medium rounded-lg hover:bg-white hover:text-[#0A0A0A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed py-2"
      >
        {isGoogleLoading ? (
          <span>Загрузка...</span>
        ) : (
          <>
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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

      <div className="mt-4 text-center">
        <p className="text-white/50 text-xs">
          {currentForm === "signin" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
          <button
            onClick={() => setCurrentForm(currentForm === "signin" ? "register" : "signin")}
            className="text-white/80 hover:text-white underline"
          >
            {currentForm === "signin" ? "Зарегистрироваться" : "Войти"}
          </button>
        </p>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm" />
          <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[101] mt-24 flex flex-col rounded-t-2xl bg-[#0A0A0A]/95 border-t border-white/10 max-h-[90vh]">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/20 mb-4 mt-3" />
            <div className="px-4 py-4 overflow-y-auto">
              {formContent}
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full max-w-md bg-[#0A0A0A]/95 border border-white/10 rounded-2xl overflow-hidden">
              <div className="relative w-full overflow-y-auto max-h-[90vh]">
                <div className="px-6 py-6">
                  {formContent}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

