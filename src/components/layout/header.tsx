'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { MenuIcon } from '@/components/ui/menu-icon';
import { Logo } from '@/components/ui/logo';
import { getSite } from '@/lib/content';

export function Header() {
  const { nav, site } = getSite();
  const pathname = usePathname();
  const navItems: Array<{ href: Route; label: string }> = useMemo(
    () =>
      nav.map(({ path, label }) => ({
        label,
        href: (path.startsWith('#') ? (`/${path}` as Route) : (path as Route))
      })),
    [nav]
  );
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('home');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (pathname !== '/') return;
    const sectionIds = ['home', 'services', 'process'];
    const offset = 160;

    const handler = () => {
      const scrollPos = window.scrollY + offset;
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= scrollPos) current = id;
      }
      setActiveId(current);
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler as any);
      window.removeEventListener('resize', handler as any);
    };
  }, [pathname]);

  const onNavClick = (href: Route) => () => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      setActiveId(id);
    }
    setOpen(false);
  };

  const isItemActive = (href: Route) => {
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      return pathname === '/' && id === activeId;
    }
    if (href === '/contact') return pathname === '/contact';
    if (href.startsWith('/insights')) return pathname?.startsWith('/insights');
    if (href === '/#home') return pathname === '/';
    return false;
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-emerald-900/5 bg-white/95 px-4 py-3 shadow-brand transition-all sm:px-6 sm:py-4">
        <Link href="/#home" className="font-display flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-slate/80 sm:text-sm sm:tracking-[0.2em]">
          <Logo size="sm" className="sm:hidden" />
          <Logo size="md" className="hidden sm:block" />
          <span className="inline-block">{site?.name ?? 'SITE'}</span>
        </Link>
        <nav className="hidden items-center gap-7 text-[15px] font-medium text-slate/80 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`relative transition-colors duration-200 hover:text-ember/80 ${
                isItemActive(item.href) ? 'text-ember' : ''
              }`}
              onClick={onNavClick(item.href)}
            >
              <span>{item.label}</span>
              {isItemActive(item.href) ? (
                <motion.span
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-ember"
                />
              ) : null}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/contact"
            className="hidden rounded-full bg-ember px-5 py-2 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:shadow-lg md:inline-flex"
          >
            Book Consultation
          </Link>
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate/20 text-slate md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="mx-auto mt-2 w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-slate/10 bg-white/95 px-6 py-6 shadow-xl md:hidden"
          >
            <ul className="grid gap-4 text-base font-medium text-slate/80">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onNavClick(item.href)}
                    className={`block py-2 transition-colors duration-200 ${
                      isItemActive(item.href) ? 'text-ember' : 'hover:text-ember/80'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
