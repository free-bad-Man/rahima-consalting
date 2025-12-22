// Утилиты для определения производительности устройства

/**
 * Определяет, является ли устройство мобильным
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Определяет, является ли устройство слабым (мобильное + медленное соединение или низкая производительность)
 */
export const isLowEndDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Проверка на мобильное устройство
  const mobile = isMobile();
  
  // Проверка на медленное соединение (если доступно)
  const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
  const slowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');
  
  // Проверка количества ядер процессора (если доступно)
  const hardwareConcurrency = navigator.hardwareConcurrency || 0;
  const lowCores = hardwareConcurrency > 0 && hardwareConcurrency <= 2;
  
  // Проверка памяти (если доступно)
  const deviceMemory = (navigator as any).deviceMemory || 0;
  const lowMemory = deviceMemory > 0 && deviceMemory <= 2;
  
  return mobile && (slowConnection || lowCores || lowMemory || hardwareConcurrency === 0);
};

/**
 * Определяет, нужно ли снизить качество анимаций
 */
export const shouldReduceMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  // Проверка системной настройки prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return prefersReducedMotion || isLowEndDevice();
};

/**
 * Определяет, нужно ли отключить тяжелые эффекты (WebGL шейдеры)
 */
export const shouldDisableHeavyEffects = (): boolean => {
  return isLowEndDevice();
};







