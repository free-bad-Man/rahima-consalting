import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output для Docker (оптимизированный размер образа)
  output: 'standalone',
  
  // Разрешаем загрузку изображений из Google
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Современные форматы для лучшего сжатия
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Оптимизация размеров для разных устройств
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Оптимизация компиляции
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Оптимизация для мобильных устройств
  poweredByHeader: false,
  compress: true,
  // Настройка прокси для внешних запросов
  async rewrites() {
    return [];
  },
};

export default nextConfig;
