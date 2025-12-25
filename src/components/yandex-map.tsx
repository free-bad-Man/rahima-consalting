"use client";

import { useEffect, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface YandexMapProps {
  address: string;
  center?: [number, number]; // [долгота, широта]
  zoom?: number;
  height?: string;
  className?: string;
}

export default function YandexMap({
  address,
  center,
  zoom = 15,
  height = "400px",
  className = "",
}: YandexMapProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const mapRef = useRef<HTMLDivElement>(null);
  const ymapsRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let script: HTMLScriptElement | null = null;

    const initMap = () => {
      if (!mapRef.current || !ymapsRef.current) return;

      // Если карта уже создана, уничтожаем её
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }

      const ymaps = ymapsRef.current;

      // Если координаты не указаны, геокодируем адрес
      if (center) {
        createMap(center);
      } else {
        // Геокодирование адреса
        ymaps.geocode(address).then((result: any) => {
          const firstGeoObject = result.geoObjects.get(0);
          if (firstGeoObject) {
            const coordinates = firstGeoObject.geometry.getCoordinates();
            createMap(coordinates);
          } else {
            // Если адрес не найден, используем координаты Симферополя по умолчанию
            createMap([34.1003, 44.9482]);
          }
        }).catch(() => {
          // В случае ошибки используем координаты по умолчанию
          createMap([34.1003, 44.9482]);
        });
      }
    };

    const createMap = (coordinates: [number, number]) => {
      if (!mapRef.current || !ymapsRef.current) return;

      const ymaps = ymapsRef.current;

      // Создаем карту
      // На мобильных отключаем drag, чтобы пользователь мог прокручивать страницу
      const mapOptions: any = {
        center: coordinates,
        zoom: zoom,
        controls: isMobile ? ["zoomControl"] : ["zoomControl", "fullscreenControl"],
        options: {
          suppressMapOpenBlock: true,
        },
      };

      // Отключаем перетаскивание на мобильных устройствах
      if (isMobile) {
        // На мобильных полностью отключаем behaviors (drag, scrollZoom)
        mapOptions.behaviors = [];
      } else {
        // На десктопе включаем стандартное поведение
        mapOptions.behaviors = ["default", "scrollZoom"];
      }

      mapInstanceRef.current = new ymaps.Map(mapRef.current, mapOptions);
      
      // Дополнительно отключаем touch-события для перетаскивания на мобильных
      if (isMobile && mapRef.current) {
        // Разрешаем только вертикальную прокрутку страницы, блокируем перетаскивание карты
        mapRef.current.style.touchAction = 'pan-y';
        mapRef.current.style.userSelect = 'none';
        mapRef.current.style.webkitUserSelect = 'none';
        mapRef.current.style.webkitTouchCallout = 'none';
        
        // Предотвращаем перетаскивание карты через touch-события
        const preventMapDrag = (e: TouchEvent) => {
          // Разрешаем только вертикальную прокрутку
          if (e.touches.length === 1) {
            const touch = e.touches[0];
            const target = e.target as HTMLElement;
            // Если это не элемент управления картой, разрешаем прокрутку страницы
            if (!target.closest('.ymaps-2-1-79-controls__control')) {
              e.stopPropagation();
            }
          }
        };
        
        mapRef.current.addEventListener('touchstart', preventMapDrag, { passive: false });
        mapRef.current.addEventListener('touchmove', preventMapDrag, { passive: false });
      }

      // Добавляем метку
      const placemark = new ymaps.Placemark(
        coordinates,
        {
          balloonContent: address,
          iconCaption: address,
        },
        {
          preset: "islands#violetDotIconWithCaption",
        }
      );

      mapInstanceRef.current.geoObjects.add(placemark);
    };

    // Проверяем, загружен ли уже API Яндекс карт
    if (window.ymaps) {
      ymapsRef.current = window.ymaps;
      window.ymaps.ready(() => {
        initMap();
      });
      return;
    }

    // Проверяем, не загружается ли уже скрипт
    const existingScript = document.querySelector('script[src*="api-maps.yandex.ru"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => {
        if (window.ymaps) {
          ymapsRef.current = window.ymaps;
          window.ymaps.ready(() => {
            initMap();
          });
        }
      });
      return;
    }

    // Загружаем API Яндекс карт
    script = document.createElement("script");
    script.src = "https://api-maps.yandex.ru/2.1/?apikey=&lang=ru_RU";
    script.async = true;
    script.onload = () => {
      if (window.ymaps) {
        ymapsRef.current = window.ymaps;
        window.ymaps.ready(() => {
          initMap();
        });
      }
    };
    document.head.appendChild(script);

    return () => {
      // Очистка при размонтировании
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [address, center, zoom, isMobile]);


  return (
    <div
      ref={mapRef}
      style={{ 
        height: height,
        // На мобильных разрешаем только вертикальную прокрутку страницы
        touchAction: isMobile ? 'pan-y' : 'auto',
        WebkitTouchCallout: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        // Предотвращаем выделение текста при касании
        WebkitTapHighlightColor: 'transparent',
      }}
      className={`w-full rounded-lg md:rounded-xl overflow-hidden border border-white/10 ${className} ${isMobile ? 'select-none touch-none' : ''}`}
    />
  );
}

// Расширяем Window interface для TypeScript
declare global {
  interface Window {
    ymaps: any;
  }
}

