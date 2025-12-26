"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "@/components/footer";

export default function DashboardFooter() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const windowHeight = window.innerHeight;
      const mouseY = e.clientY;
      const threshold = 50; // Расстояние от низа экрана в пикселях

      // Проверяем, находится ли курсор в нижней части экрана
      if (windowHeight - mouseY <= threshold) {
        setIsVisible(true);
        setIsHovering(true);
        
        // Очищаем таймер скрытия
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      } else {
        // Если курсор не внизу, начинаем таймер скрытия
        setIsHovering(false);
        
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 500); // Задержка перед скрытием
      }
    };

    // Изначально скрываем футер
    setIsVisible(false);

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onMouseEnter={() => {
            setIsHovering(true);
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
          }}
          onMouseLeave={() => {
            setIsHovering(false);
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
            }
            hideTimeoutRef.current = setTimeout(() => {
              setIsVisible(false);
            }, 500);
          }}
          className="fixed bottom-0 left-0 right-0 z-40"
        >
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

