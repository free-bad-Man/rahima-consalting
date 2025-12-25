"use client";

import { useEffect, useState, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const isHiddenRef = useRef(false); // Флаг для предотвращения множественного скрытия
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let loadTimeoutId: NodeJS.Timeout;

    // Функция для скрытия загрузчика (вызывается только один раз)
    const hideLoader = () => {
      if (isHiddenRef.current) return;
      isHiddenRef.current = true;
      
      // Небольшая задержка для плавности анимации исчезновения
      timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Обработчик события загрузки страницы
    const handleLoad = () => {
      // Даем время для инициализации всех компонентов React
      loadTimeoutId = setTimeout(() => {
        hideLoader();
      }, 500);
    };

    // Проверяем текущее состояние загрузки
    if (document.readyState === 'complete') {
      // Страница уже загружена
      handleLoad();
    } else {
      // Ждем события загрузки
      window.addEventListener('load', handleLoad, { once: true });
    }

    // Дополнительная проверка через задержку на случай проблем с событием load
    const fallbackTimeout = setTimeout(() => {
      if (document.readyState === 'complete' && !isHiddenRef.current) {
        hideLoader();
      }
    }, 2000);

    // Очистка при размонтировании
    return () => {
      window.removeEventListener('load', handleLoad);
      if (timeoutId) clearTimeout(timeoutId);
      if (loadTimeoutId) clearTimeout(loadTimeoutId);
      if (fallbackTimeout) clearTimeout(fallbackTimeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-[#0A0A0A] flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 px-4">
        {/* Логотип или название сайта */}
        <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2 text-center">
          Консалтинг под ключ
        </div>
        
        {/* Индикатор загрузки Orbit */}
        <div className={`orbit-loader ${isMobile ? 'medium' : 'large'}`}>
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="orbit-particle" />
          ))}
        </div>
        
        {/* Текст загрузки */}
        <p className="text-white/70 text-sm sm:text-base animate-pulse">Загрузка...</p>
      </div>
    </div>
  );
}

