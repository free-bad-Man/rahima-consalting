"use client";

import { MapPin } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";

interface MapLoaderProps {
  height?: string;
  className?: string;
}

export default function MapLoader({ height = "400px", className = "" }: MapLoaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div
      style={{ height }}
      className={`w-full rounded-lg md:rounded-xl overflow-hidden border border-white/10 bg-white/5 flex items-center justify-center ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Индикатор загрузки Orbit */}
        <div className={`orbit-loader ${isMobile ? 'small' : ''}`}>
          {Array.from({ length: 13 }).map((_, i) => (
            <div key={i} className="orbit-particle" />
          ))}
        </div>
        
        {/* Иконка и текст */}
        <div className="flex flex-col items-center gap-2">
          <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-purple-400 animate-pulse" />
          <p className="text-white/70 text-xs sm:text-sm">Загрузка карты...</p>
        </div>
      </div>
    </div>
  );
}

