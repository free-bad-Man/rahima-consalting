"use client";

import { useState, useEffect } from "react";

/**
 * Хук для определения размера экрана
 * @param query - медиа-запрос (например, '(max-width: 768px)')
 * @returns boolean - соответствует ли текущий экран запросу
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Проверяем, что мы в браузере
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia(query);
    
    // Устанавливаем начальное значение
    setMatches(mediaQuery.matches);

    // Создаем обработчик изменений
    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Подписываемся на изменения (современный API)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      // Fallback для старых браузеров
      mediaQuery.addListener(handler);
      return () => mediaQuery.removeListener(handler);
    }
  }, [query]);

  return matches;
}

