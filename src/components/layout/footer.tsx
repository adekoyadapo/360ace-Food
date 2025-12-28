"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Logo } from '@/components/ui/logo';
import { getSite } from '@/lib/content';

export function Footer() {
  const { site, nav } = getSite();
  return (
    <footer className="mt-24 border-t border-emerald-900/10 bg-white text-slate">
      <div className="mx-auto w-full max-w-6xl grid gap-12 px-6 py-16 grid-cols-1 xs760:grid-cols-2 md:grid-cols-3 md:items-start">
        <div className="space-y-6 md:max-w-xl">
          <Link href="/#home" className="font-display inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-slate/70">
            <Logo size="md" />
            <span>{site.name}</span>
          </Link>
          <p className="text-sm leading-6 text-slate/70">
            Safeguarding food systems with evidence-based strategy, agile implementation, and enduring partnerships across
            Africa and beyond.
          </p>
        </div>
        <div className="hidden md:block">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/50">Navigation</p>
          <ul className="mt-3 grid w-fit grid-cols-3 gap-x-3 gap-y-0.5 text-sm leading-tight text-slate/70">
            {nav.map(({ path, label }) => (
              <motion.li key={label} initial="rest" whileHover="hover" animate="rest" className="relative">
                <Link
                  href={(path.startsWith('#') ? `/${path}` : path) as any}
                  className="relative inline-block transition-colors duration-200 hover:text-midnight"
                >
                  {label}
                  <motion.span
                    variants={{ rest: { scaleX: 0, opacity: 0 }, hover: { scaleX: 1, opacity: 1 } }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                    style={{ originX: 0 }}
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-ember"
                  />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/50">Credentials</p>
          <ul className="mt-4 space-y-2 text-sm text-slate/70">
            <li>PhD Food Technology</li>
            <li>ISO 9001:2015 Lead Auditor</li>
            <li>Lean Six Sigma Green Belt</li>
            <li>30+ peer-reviewed publications</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-emerald-900/10 py-6 text-center text-xs text-slate/60">
        © {new Date().getFullYear()} 360ace.Food Consulting. All rights reserved.
      </div>
    </footer>
  );
}
