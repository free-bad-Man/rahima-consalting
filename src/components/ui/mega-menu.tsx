"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  BarChart3,
  Box,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  Cpu,
  Eye,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  Key,
  MapPin,
  Megaphone,
  Newspaper,
  Palette,
  Rocket,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";

type IconName =
  | "BarChart3"
  | "Box"
  | "BookOpen"
  | "Briefcase"
  | "Building2"
  | "Calculator"
  | "Cpu"
  | "Eye"
  | "FileCheck"
  | "FileText"
  | "Globe"
  | "GraduationCap"
  | "Key"
  | "MapPin"
  | "Megaphone"
  | "Newspaper"
  | "Palette"
  | "Rocket"
  | "RotateCcw"
  | "Search"
  | "Send"
  | "Settings"
  | "Shield"
  | "Trash2"
  | "TrendingUp"
  | "Users"
  | "Zap";

const iconMap: Record<IconName, React.ElementType> = {
  BarChart3,
  Box,
  BookOpen,
  Briefcase,
  Building2,
  Calculator,
  Cpu,
  Eye,
  FileCheck,
  FileText,
  Globe,
  GraduationCap,
  Key,
  MapPin,
  Megaphone,
  Newspaper,
  Palette,
  Rocket,
  RotateCcw,
  Search,
  Send,
  Settings,
  Shield,
  Trash2,
  TrendingUp,
  Users,
  Zap,
};

export type MegaMenuItem = {
  id: number;
  label: string;
      subMenus?: {
        title: string;
        items: {
          label: string;
          description: string;
          icon: IconName;
        }[];
      }[];
  link?: string;
};

export interface MegaMenuProps extends React.HTMLAttributes<HTMLUListElement> {
  items: MegaMenuItem[];
  className?: string;
  onServiceClick?: (serviceTitle: string) => void;
  onCasesAndReviewsClick?: () => void;
  onContactsClick?: () => void;
}

const MegaMenu = React.forwardRef<HTMLUListElement, MegaMenuProps>(
  ({ items, className, onServiceClick, onCasesAndReviewsClick, onContactsClick, ...props }, ref) => {
    const { data: session } = useSession();
    const [openMenu, setOpenMenu] = React.useState<string | null>(null);
    const [isHover, setIsHover] = React.useState<number | null>(null);
    const [currentPage, setCurrentPage] = React.useState(0);
    const [direction, setDirection] = React.useState<'left' | 'right'>('right');
    const [tooltipHover, setTooltipHover] = React.useState<string | null>(null);
    const [mounted, setMounted] = React.useState(false);
    const isMobile = useMediaQuery("(max-width: 768px)");

    React.useEffect(() => {
      setMounted(true);
    }, []);

    const getTooltipText = (label: string): string | null => {
      const tooltips: Record<string, string> = {
        "Услуги": "Раздел «Услуги» — это каталог отдельных услуг, сгруппированных по направлениям.",
        "Решения": "Раздел «Решения» — это пакеты «под ключ», которые закрывают бизнес-задачи, а не отдельные услуги.",
        "ИИ - Ассистенты": "Раздел для линейки ИИ-продуктов. Это не услуги и не просто чат-боты, а инструменты, встроенные в процессы клиента.",
        "Кейсы и отзывы": "Реальные примеры работы с клиентами и отзывы о наших услугах",
        "Контакты": "Свяжитесь с нами для консультации или получения дополнительной информации"
      };
      return tooltips[label] || null;
    };

    const handleHover = (menuLabel: string | null) => {
      setOpenMenu(menuLabel);
    };

    const handleClick = (menuLabel: string | null) => {
      if (openMenu === menuLabel) {
        setOpenMenu(null);
        setCurrentPage(0);
      } else {
        setOpenMenu(menuLabel);
        setCurrentPage(0);
      }
    };

    const closeModal = () => {
      setOpenMenu(null);
      setCurrentPage(0);
    };

    const nextPage = () => {
      const currentMenu = items.find(item => item.label === openMenu);
      const itemsPerPage = isMobile && openMenu === "Услуги" ? 1 : 2;
      const totalPages = currentMenu?.subMenus ? Math.ceil(currentMenu.subMenus.length / itemsPerPage) : 1;
      setDirection('right');
      setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
    };

    const prevPage = () => {
      setDirection('left');
      setCurrentPage((prev) => Math.max(prev - 1, 0));
    };

    const goToPage = (page: number) => {
      setDirection(page > currentPage ? 'right' : 'left');
      setCurrentPage(page);
    };

    return (
      <React.Fragment>
      <ul
        ref={ref}
        className={`relative flex items-center space-x-0 gap-2 ${className || ""}`}
        {...props}
      >
        {items.map((navItem) => {
          const hasSubmenu = !!navItem.subMenus?.length;
          const isOpen = openMenu === navItem.label;
          const isModalMenu = ["Услуги", "Решения", "ИИ - Ассистенты"].includes(navItem.label);

          const showChevron = hasSubmenu && !["Услуги", "Решения", "ИИ - Ассистенты"].includes(navItem.label);
          
          const triggerContent = (
            <span className="relative flex cursor-pointer items-center justify-center gap-1 py-1.5 px-2 md:py-2 md:px-3 text-[10px] md:text-xs font-medium text-white transition-all duration-200 hover:bg-gray-900/40 group whitespace-nowrap rounded-md border border-white/20 bg-gray-900/30 shadow-sm hover:shadow-md">
              <span>{navItem.label}</span>
              {showChevron && (
                <ChevronDown
                  className={`h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 group-hover:rotate-180 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              )}
            </span>
          );

          return (
            <li
              key={navItem.label}
              className="relative"
              onMouseEnter={!isModalMenu ? () => handleHover(navItem.label) : undefined}
              onMouseLeave={!isModalMenu ? () => handleHover(null) : undefined}
            >
              <div className="relative">
                {isModalMenu ? (
                  <button
                    type="button"
                    className="relative"
                    onMouseEnter={() => {
                      setIsHover(navItem.id);
                      setTooltipHover(navItem.label);
                    }}
                    onMouseLeave={() => {
                      setIsHover(null);
                      setTooltipHover(null);
                    }}
                    onClick={() => handleClick(navItem.label)}
                  >
                    {triggerContent}
                  </button>
                ) : navItem.label === "Кейсы и отзывы" && onCasesAndReviewsClick ? (
                  <button
                    type="button"
                    className="relative"
                    onMouseEnter={() => {
                      setIsHover(navItem.id);
                      setTooltipHover(navItem.label);
                    }}
                    onMouseLeave={() => {
                      setIsHover(null);
                      setTooltipHover(null);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onCasesAndReviewsClick();
                    }}
                  >
                    {triggerContent}
                  </button>
                ) : navItem.label === "Контакты" && onContactsClick ? (
                  <button
                    type="button"
                    className="relative"
                    onMouseEnter={() => {
                      setIsHover(navItem.id);
                      setTooltipHover(navItem.label);
                    }}
                    onMouseLeave={() => {
                      setIsHover(null);
                      setTooltipHover(null);
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      onContactsClick();
                    }}
                  >
                    {triggerContent}
                  </button>
                ) : (
                  <div
                    onMouseEnter={() => {
                      setIsHover(navItem.id);
                      if (["Кейсы и отзывы", "Контакты"].includes(navItem.label)) {
                        setTooltipHover(navItem.label);
                      }
                    }}
                    onMouseLeave={() => {
                      setIsHover(null);
                      setTooltipHover(null);
                    }}
                  >
                    {triggerContent}
                  </div>
                )}
                {!isMobile && ["Кейсы и отзывы", "Контакты"].includes(navItem.label) && tooltipHover === navItem.label && getTooltipText(navItem.label) && (
                  <div className="absolute top-full right-0 mt-2 z-50 w-[calc(100vw-2rem)] md:w-[400px] max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-280px)]">
                    <div className="bg-black/90 text-white text-[10px] md:text-xs rounded-lg px-3 md:px-4 py-2 md:py-3 shadow-lg border border-white/10">
                      <p className="whitespace-normal leading-relaxed break-words">
                        {getTooltipText(navItem.label)}
                      </p>
                      <div className="absolute bottom-full right-4 md:right-8 -mb-1">
                        <div className="w-2 h-2 bg-black/90 border-r border-t border-white/10 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                )}
                {!isMobile && isModalMenu && tooltipHover === navItem.label && getTooltipText(navItem.label) && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-[calc(100vw-2rem)] md:w-[600px] max-w-[calc(100vw-2rem)] md:max-w-[calc(100vw-280px)]">
                    <div className="bg-black/90 text-white text-[10px] md:text-xs rounded-lg px-3 md:px-4 py-2 md:py-3 shadow-lg border border-white/10">
                      <p className="whitespace-normal leading-relaxed break-words">
                        {getTooltipText(navItem.label)}
                      </p>
                      <div className="absolute bottom-full left-4 md:left-8 -mb-1">
                        <div className="w-2 h-2 bg-black/90 border-l border-t border-white/10 rotate-45"></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {navItem.subMenus && (
                <AnimatePresence mode="wait">
                  {(isOpen || (isModalMenu && openMenu === navItem.label)) && (
                    <div className="absolute left-0 top-full w-auto pt-2 z-10 hidden md:block">
                      <motion.div
                        key={navItem.label}
                        className="w-full md:w-[900px] max-w-[90vw] border border-white/10 bg-[#0A0A0A]/95 p-3 md:p-4"
                        style={{
                          borderRadius: 16,
                        }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                      >
                        <div className="flex w-full shrink-0 items-start gap-4 md:gap-6 lg:gap-9">
                          {navItem.subMenus.map((sub) => (
                            <motion.div layout="position" className="w-full" key={sub.title}>
                              <h3 className="mb-3 md:mb-4 text-xs md:text-sm font-medium capitalize text-white/50">
                                {sub.title}
                              </h3>
                              <ul className="space-y-3 md:space-y-4 lg:space-y-6">
                                {sub.items.map((item) => {
                                  const Icon = iconMap[item.icon];
                                  const handleClick = (e: React.MouseEvent) => {
                                    e.preventDefault();
                                    if (onServiceClick) {
                                      onServiceClick(item.label);
                                      handleHover(null);
                                    }
                                  };
                                  return (
                                    <li key={item.label}>
                                      <button
                                        type="button"
                                        onClick={handleClick}
                                        className="w-full text-left flex items-start space-x-3 group"
                                      >
                                        <div className="flex size-8 md:size-9 shrink-0 items-center justify-center rounded-md border border-white/30 text-white transition-colors duration-300 group-hover:bg-white group-hover:text-[#0A0A0A]">
                                          <Icon className="h-4 w-4 md:h-5 md:w-5 flex-none" />
                                        </div>
                                        <div className="w-max leading-4 md:leading-5">
                                          <p className="shrink-0 text-xs md:text-sm font-medium text-white">
                                            {item.label}
                                          </p>
                                          <p className="shrink-0 text-[10px] md:text-xs text-white/50 transition-colors duration-300 group-hover:text-white">
                                            {item.description}
                                          </p>
                                        </div>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              )}
            </li>
          );
        })}
      </ul>
      {mounted && typeof window !== 'undefined' && createPortal(
        <AnimatePresence>
          {openMenu && ["Услуги", "Решения", "ИИ - Ассистенты"].includes(openMenu) && items.find(item => item.label === openMenu)?.subMenus && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
                onClick={closeModal}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="fixed z-[101] bg-[#0A0A0A]/95 md:bg-[#0A0A0A]/85 border-0 md:border border-white/10 rounded-none md:rounded-3xl flex flex-col overflow-hidden"
                style={isMobile ? { 
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '100vh',
                  width: '100vw',
                  maxHeight: '100vh',
                  maxWidth: '100vw',
                  position: 'fixed',
                  margin: 0,
                  padding: 0,
                  inset: 0
                } : {
                  top: '1rem',
                  left: '1rem',
                  right: '1rem',
                  bottom: '1rem',
                  position: 'fixed'
                }}
                onClick={(e) => e.stopPropagation()}
              >
              <div className="flex-shrink-0 px-4 md:px-6 lg:px-12 xl:px-20 py-4 md:py-6 border-b border-white/10 bg-[#0A0A0A]/95 md:bg-transparent">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg md:text-xl font-semibold text-white">
                    {items.find(item => item.label === openMenu)?.label}
                  </h2>
                  <button
                    onClick={closeModal}
                    className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    aria-label="Закрыть"
                  >
                    <X className="h-4 w-4 md:h-5 md:w-5" />
                  </button>
                </div>
                {!session && (
                  <div className="w-full text-center mt-4">
                    <p className="text-xs md:text-sm text-white/60 italic">
                      Некоторые функции доступны только зарегистрированным пользователям.
                    </p>
                  </div>
                )}
              </div>
              <div 
                className="flex-1 overflow-y-auto overscroll-contain" 
                style={{ 
                  WebkitOverflowScrolling: 'touch', 
                  minHeight: 0,
                  touchAction: 'pan-y',
                  position: 'relative'
                }}
              >
                <div className="container mx-auto px-4 md:px-6 lg:px-12 xl:px-20 py-4 md:py-6 lg:py-8 pb-8">
                  <div className="absolute bottom-4 right-4 md:right-24 z-10 hidden md:block">
                    <img
                      src="/logo.png"
                      alt="Логотип компании"
                      className="h-10 md:h-12 w-auto object-contain opacity-60"
                      style={{ 
                        backgroundColor: 'transparent',
                        background: 'transparent',
                        display: 'block',
                        filter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(2000%) hue-rotate(250deg) brightness(1.5) contrast(1.1)',
                        WebkitFilter: 'brightness(0) saturate(100%) invert(27%) sepia(100%) saturate(2000%) hue-rotate(250deg) brightness(1.5) contrast(1.1)'
                      }}
                    />
                  </div>
                  <div className="relative" style={{ minHeight: '100%' }}>
                    <AnimatePresence mode="wait" custom={direction}>
                      <motion.div
                        key={currentPage}
                        custom={direction}
                        initial={direction === 'right' ? { x: '100%', opacity: 0 } : { x: '-100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={direction === 'right' ? { x: '-100%', opacity: 0 } : { x: '100%', opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className={`grid ${isMobile && openMenu === "Услуги" ? 'grid-cols-1' : currentPage === 2 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'} gap-4 md:gap-6 lg:gap-12`}
                      >
                        {items.find(item => item.label === openMenu)?.subMenus
                          ?.slice(
                            isMobile && openMenu === "Услуги" 
                              ? currentPage * 1 
                              : currentPage * 2, 
                            isMobile && openMenu === "Услуги" 
                              ? currentPage * 1 + 1 
                              : currentPage * 2 + 2
                          )
                          .map((sub) => (
                            <div key={sub.title} className={currentPage === 2 ? 'w-full max-w-2xl mx-auto' : 'w-full'}>
                              <h3 className={`mb-4 font-medium capitalize text-white/80 ${currentPage === 2 ? 'text-base' : 'text-sm'}`}>
                                {sub.title}
                              </h3>
                              <ul className={currentPage === 2 ? 'space-y-6' : 'space-y-4'}>
                                {sub.items.map((item) => {
                                  const Icon = iconMap[item.icon];
                                  const handleClick = (e: React.MouseEvent) => {
                                    e.preventDefault();
                                    if (onServiceClick) {
                                      onServiceClick(item.label);
                                      closeModal();
                                    }
                                  };
                                  return (
                                    <li key={item.label}>
                                      <button
                                        type="button"
                                        onClick={handleClick}
                                        className={`w-full text-left flex items-start group ${currentPage === 2 ? 'space-x-4' : 'space-x-3'}`}
                                      >
                                        <div className={`flex shrink-0 items-center justify-center rounded-lg border border-white/30 bg-gradient-to-br from-purple-500/20 to-blue-500/20 transition-all duration-300 group-hover:from-purple-500/40 group-hover:to-blue-500/40 group-hover:border-purple-400/50 ${currentPage === 2 ? 'size-12' : 'size-10'}`}>
                                          <Icon className={`flex-none ${currentPage === 2 ? 'h-6 w-6' : 'h-5 w-5'} stroke-purple-400`} />
                                        </div>
                                        <div className="flex-1 leading-4">
                                          <p className={`shrink-0 font-medium text-white mb-1 ${currentPage === 2 ? 'text-sm' : 'text-xs'}`}>
                                            {item.label}
                                          </p>
                                          <p className={`shrink-0 text-white/60 transition-colors duration-300 group-hover:text-white/80 ${currentPage === 2 ? 'text-xs' : 'text-[10px]'}`}>
                                            {item.description}
                                          </p>
                                        </div>
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                            </div>
                          ))}
                      </motion.div>
                    </AnimatePresence>
                    {(() => {
                      const currentMenu = items.find(item => item.label === openMenu);
                      const itemsPerPage = isMobile && openMenu === "Услуги" ? 1 : 2;
                      const totalPages = currentMenu?.subMenus ? Math.ceil(currentMenu.subMenus.length / itemsPerPage) : 1;
                      return (
                        <>
                          {currentPage > 0 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                prevPage();
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                prevPage();
                              }}
                              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white transition-colors z-[102] shadow-lg touch-manipulation"
                              aria-label="Предыдущая страница"
                              style={{ touchAction: 'manipulation', pointerEvents: 'auto' }}
                            >
                              <ChevronLeft className="h-5 w-5 md:h-7 md:w-7" />
                            </button>
                          )}
                          {currentPage < totalPages - 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                nextPage();
                              }}
                              onTouchStart={(e) => {
                                e.stopPropagation();
                              }}
                              onTouchEnd={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                nextPage();
                              }}
                              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/40 text-white transition-colors z-[102] shadow-lg touch-manipulation"
                              aria-label="Следующая страница"
                              style={{ touchAction: 'manipulation', pointerEvents: 'auto' }}
                            >
                              <ChevronRight className="h-5 w-5 md:w-7 md:h-7" />
                            </button>
                          )}
                        </>
                      );
                    })()}
                  </div>
                  {(() => {
                    const currentMenu = items.find(item => item.label === openMenu);
                    const itemsPerPage = isMobile && openMenu === "Услуги" ? 1 : 2;
                    const totalPages = currentMenu?.subMenus ? Math.ceil(currentMenu.subMenus.length / itemsPerPage) : 1;
                    return (
                      <div className="flex justify-center items-center gap-1.5 md:gap-2 mt-4 md:mt-8 pb-2 md:pb-4">
                        {Array.from({ length: totalPages }).map((_, index) => (
                          <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`h-1.5 md:h-2 rounded-full transition-all ${
                              currentPage === index
                                ? 'bg-white w-6 md:w-8'
                                : 'bg-white/30 hover:bg-white/50 w-1.5 md:w-2'
                            }`}
                            aria-label={`Страница ${index + 1}`}
                          />
                        ))}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>,
      document.body
      )}
    </React.Fragment>
    );
  }
);

MegaMenu.displayName = "MegaMenu";

export default MegaMenu;

