// Конфигурация для framer-motion с учетом производительности
import { shouldReduceMotion } from "./performance";

/**
 * Получает конфигурацию анимации с учетом производительности устройства
 */
export const getAnimationConfig = () => {
  const reduceMotion = shouldReduceMotion();
  
  return {
    duration: reduceMotion ? 0.15 : 0.3,
    ease: reduceMotion ? "easeOut" : [0.4, 0, 0.2, 1],
    transition: {
      duration: reduceMotion ? 0.15 : 0.3,
      ease: reduceMotion ? "easeOut" : [0.4, 0, 0.2, 1],
    },
  };
};

/**
 * Получает начальные и финальные состояния для анимации
 */
export const getMotionVariants = () => {
  const reduceMotion = shouldReduceMotion();
  
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  
  return {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  };
};

/**
 * Получает варианты для slide анимации
 */
export const getSlideVariants = (direction: "up" | "down" | "left" | "right" = "up") => {
  const reduceMotion = shouldReduceMotion();
  
  if (reduceMotion) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
    };
  }
  
  const directions = {
    up: { y: "100%" },
    down: { y: "-100%" },
    left: { x: "100%" },
    right: { x: "-100%" },
  };
  
  return {
    initial: { ...directions[direction], opacity: 0 },
    animate: { x: 0, y: 0, opacity: 1 },
    exit: { ...directions[direction], opacity: 0 },
  };
};







