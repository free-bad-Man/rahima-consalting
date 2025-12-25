"use client";

import { useEffect, useRef, useState } from "react";
import MapLoader from "@/components/ui/map-loader";
import { MapPin } from "lucide-react";

interface YandexMapProps {
  address: string;
  center?: [number, number]; // [широта, долгота]
  zoom?: number;
  height?: string;
  className?: string;
}

// ID конструктора из предоставленного скрипта
const CONSTRUCTOR_ID = "126df85cd26de115228ceddeb2958488cb30323393e8ac9b8518d873641bf6ca";

export default function YandexMap({
  address,
  center,
  zoom = 15,
  height = "400px",
  className = "",
}: YandexMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Проверяем, не загружен ли уже скрипт для этого контейнера
    if (scriptLoadedRef.current || !mapContainerRef.current) {
      return;
    }

    const container = mapContainerRef.current;
    
    // Проверяем, не добавлен ли уже скрипт в этот контейнер
    if (container.querySelector('script')) {
      scriptLoadedRef.current = true;
      setIsLoading(false);
      return;
    }

    // Получаем числовое значение высоты для URL
    const heightNum = parseInt(height) || 400;

    // Создаем и добавляем скрипт в контейнер
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    script.async = true;
    script.src = `https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A${CONSTRUCTOR_ID}&width=100%25&height=${heightNum}&lang=ru_RU&scroll=true`;
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      // Даем небольшое время на рендеринг карты перед скрытием загрузчика
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    };

    script.onerror = () => {
      setHasError(true);
      setIsLoading(false);
      if (process.env.NODE_ENV === 'development') {
        console.warn('Не удалось загрузить скрипт Яндекс.Карт');
      }
    };

    container.appendChild(script);

    // Очистка при размонтировании
    return () => {
      scriptLoadedRef.current = false;
      if (script.parentNode === container) {
        container.removeChild(script);
      }
    };
  }, [height]);

  return (
    <div
      style={{ 
        height: height,
        width: '100%',
        position: 'relative',
      }}
      className={`w-full rounded-lg md:rounded-xl overflow-hidden border border-white/10 ${className}`}
    >
      {/* Заглушка загрузки */}
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <MapLoader height={height} />
        </div>
      )}

      {/* Ошибка загрузки */}
      {hasError && (
        <div className="w-full h-full flex items-center justify-center bg-white/5 rounded-lg md:rounded-xl">
          <div className="flex flex-col items-center gap-3 px-4">
            <MapPin className="h-8 w-8 text-white/50" />
            <p className="text-white/70 text-sm text-center">Не удалось загрузить карту</p>
            <a
              href={`https://yandex.ru/maps/?text=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 text-sm underline transition-colors"
            >
              Открыть в Яндекс.Картах
            </a>
          </div>
        </div>
      )}

      {/* Контейнер для карты */}
      <div
        ref={mapContainerRef}
        style={{
          width: '100%',
          height: '100%',
          opacity: isLoading || hasError ? 0 : 1,
          transition: 'opacity 0.3s ease-in-out',
        }}
      />
      
      {/* Кликабельная ссылка на Яндекс.Карты (поверх карты) */}
      {!hasError && (
        <a
          href={`https://yandex.ru/maps/?text=${encodeURIComponent(address)}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'block',
            zIndex: 1,
          }}
          aria-label={`Открыть карту ${address} в Яндекс.Картах`}
        />
      )}
    </div>
  );
}

