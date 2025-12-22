'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuPopup,
  NavigationMenuPositioner,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu-1';
import { FileTextIcon, CalculatorIcon, UsersIcon, PhoneIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChevronDownIcon } from 'lucide-react';

const services: { title: string; href: string; description: string }[] = [
  {
    title: 'Бухгалтерия в Симферополе',
    href: '#',
    description: 'Полный аутсорс: учет, отчётность, налоги.',
  },
  {
    title: 'Регистрация и сопровождение',
    href: '#',
    description: 'ООО/ИП под ключ, выбор системы налогообложения.',
  },
  {
    title: 'Отчётность и сдача в сроки',
    href: '#',
    description: 'ФНС, ПФР, ФСС — без просрочек и штрафов.',
  },
  {
    title: 'Консалтинг',
    href: '#',
    description: 'Оптимизация налогов, проверка контрагентов, договоры.',
  },
];

export default function MainNavigation() {
  const [openServices, setOpenServices] = React.useState(false);
  const [openAbout, setOpenAbout] = React.useState(false);

  return (
    <NavigationMenu className="text-white">
      <NavigationMenuList>
        <NavigationMenuItem>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenServices(!openServices);
                setOpenAbout(false);
              }}
              className="text-white hover:text-white/80 bg-transparent hover:bg-transparent inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              Услуги
              <ChevronDownIcon
                className={`relative top-[1px] ms-1 size-3 transition duration-300 ${openServices ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {openServices && (
              <div
                className="absolute top-full left-0 mt-2 z-50"
                onMouseEnter={() => setOpenServices(true)}
                onMouseLeave={() => setOpenServices(false)}
              >
                <div className="bg-transparent p-2">
                  <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    {services.map((service) => (
                      <ListItem key={service.title} title={service.title} href={service.href}>
                        {service.description}
                      </ListItem>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setOpenAbout(!openAbout);
                setOpenServices(false);
              }}
              className="text-white hover:text-white/80 bg-transparent hover:bg-transparent inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors"
            >
              О компании
              <ChevronDownIcon
                className={`relative top-[1px] ms-1 size-3 transition duration-300 ${openAbout ? 'rotate-180' : ''}`}
                aria-hidden="true"
              />
            </button>
            {openAbout && (
              <div
                className="absolute top-full left-0 mt-2 z-50"
                onMouseEnter={() => setOpenAbout(true)}
                onMouseLeave={() => setOpenAbout(false)}
              >
                <div className="bg-transparent p-2">
                  <ul className="grid w-[300px] gap-2">
                    <li>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('О нас clicked');
                        }}
                        className="w-full text-left rounded-lg border border-white/20 bg-black/50 backdrop-blur-md p-4 hover:bg-black/70 hover:border-white/40 transition-all mb-2 cursor-pointer"
                      >
                        <div className="font-medium flex items-center gap-2 text-white mb-1">
                          <FileTextIcon className="size-4" />
                          О нас
                        </div>
                        <div className="text-white/70 text-sm">Узнайте больше о нашей компании.</div>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Команда clicked');
                        }}
                        className="w-full text-left rounded-lg border border-white/20 bg-black/50 backdrop-blur-md p-4 hover:bg-black/70 hover:border-white/40 transition-all mb-2 cursor-pointer"
                      >
                        <div className="font-medium flex items-center gap-2 text-white mb-1">
                          <UsersIcon className="size-4" />
                          Команда
                        </div>
                        <div className="text-white/70 text-sm">Наши специалисты.</div>
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          console.log('Калькулятор clicked');
                        }}
                        className="w-full text-left rounded-lg border border-white/20 bg-black/50 backdrop-blur-md p-4 hover:bg-black/70 hover:border-white/40 transition-all cursor-pointer"
                      >
                        <div className="font-medium flex items-center gap-2 text-white mb-1">
                          <CalculatorIcon className="size-4" />
                          Калькулятор услуг
                        </div>
                        <div className="text-white/70 text-sm">Рассчитайте стоимость услуг.</div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={
              <Link
                href="#"
                className={cn(navigationMenuTriggerStyle(), 'text-white hover:text-white/80 bg-transparent hover:bg-transparent')}
              />
            }
          >
            Контакты
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink
            render={
              <Link
                href="#"
                className={cn(
                  navigationMenuTriggerStyle(),
                  'text-white bg-transparent hover:bg-transparent hover:text-white flex items-center'
                )}
              />
            }
          >
            <div className="flex items-center">
              <PhoneIcon className="size-4 mr-2" />
              Связаться с нами
            </div>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>

      <NavigationMenuPositioner>
        <NavigationMenuPopup className="bg-transparent shadow-none border-none" />
      </NavigationMenuPositioner>
    </NavigationMenu>
  );
}

function ListItem({ title, children, href, ...props }: React.ComponentPropsWithoutRef<'li'> & { href: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${title} clicked`);
    // Здесь можно добавить логику навигации
    if (href && href !== '#') {
      window.location.href = href;
    }
  };

  return (
    <li {...props}>
      <button
        type="button"
        onClick={handleClick}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full text-left rounded-lg border border-white/20 bg-black/50 backdrop-blur-md p-4 hover:bg-black/70 hover:border-white/40 transition-all cursor-pointer"
      >
        <div className="text-sm leading-none font-medium text-white mb-1">{title}</div>
        <p className="text-white/70 line-clamp-2 text-sm leading-snug">{children}</p>
      </button>
    </li>
  );
}

