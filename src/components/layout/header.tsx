'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MenuIcon } from '@/components/ui/menu-icon';
import { Logo } from '@/components/ui/logo';
import { getSite } from '@/lib/content';

export function Header() {
  const { nav, site } = getSite();
  const navItems: Array<{ href: Route; label: string }> = useMemo(
    () =>
      nav.map(({ path, label }) => ({
        label,
        href: (path.startsWith('#') ? (`/${path}` as Route) : (path as Route))
      })),
    [nav]
  );
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-lg">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-emerald-900/5 bg-white/95 px-4 py-3 shadow-brand transition-all sm:px-6 sm:py-4">
        <Link href="/#home" className="font-display flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-slate/80 sm:text-sm sm:tracking-[0.2em]">
          <span className="sr-only">{site?.brand ?? 'Site'}</span>
          <Logo size="sm" className="sm:hidden" />
          <Logo size="md" className="hidden sm:block" />
          <span className="hidden sm:inline-block">{site?.name ?? 'SITE'}</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-slate/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="relative transition hover:text-midnight">
              {item.label}
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
            className="mx-auto mt-2 w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-slate/10 bg-white/95 px-6 py-6 shadow-xl md:hidden"
          >
            <ul className="grid gap-4 text-base font-medium text-slate/80">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} onClick={() => setOpen(false)} className="block py-2">
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
