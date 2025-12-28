'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Route } from 'next';
import { getSite } from '@/lib/content';

export function Hero() {
  const { hero } = getSite();
  return (
    <section id="home" className="relative isolate overflow-hidden pt-12 md:pt-16 lg:pt-24 xl:pt-28 2xl:pt-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-ember/12 blur-[180px]" />
        <div className="absolute left-[10%] top-[30%] h-72 w-72 rounded-full bg-sage/15 blur-[170px]" />
        <div className="absolute right-[8%] top-[18%] h-64 w-64 rounded-full bg-amber-200/30 blur-[160px]" />
      </div>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-4 sm:px-6 md:grid md:grid-cols-[1.1fr_0.9fr] md:items-center md:gap-10 md:pb-14 xl:gap-12 xl:pb-16">
        <div className="space-y-6 md:space-y-8">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="inline-flex items-center rounded-full bg-ember/15 px-4 py-2 text-sm font-bold uppercase tracking-[0.32em] text-ember"
          >
            {hero.eyebrow}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="font-display text-3xl leading-tight text-midnight sm:text-4xl md:text-6xl"
          >
            {hero.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="max-w-xl text-base text-slate/70 sm:text-lg"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-wrap gap-3 sm:gap-4"
          >
            <Link
              href={hero.primaryCta.href as unknown as Route}
              className="inline-flex items-center gap-2 rounded-full bg-ember px-5 py-3 text-sm font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              {hero.primaryCta.label}
            </Link>
            <Link
              href={hero.secondaryCta.href as unknown as Route}
              className="inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-white px-5 py-3 text-sm font-semibold text-slate/80 transition hover:-translate-y-0.5 hover:border-ember/50"
            >
              {hero.secondaryCta.label}
            </Link>
          </motion.div>
        </div>
        <motion.aside
          initial={{ opacity: 0, scale: 0.96, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.8 }}
          className="relative rounded-3xl border border-emerald-900/10 bg-white/95 p-6 shadow-brand sm:p-8"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/95 p-6 sm:p-8">
            <span className="inline-flex items-center rounded-full border border-ember/30 bg-ember/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-ember">
              PhD-led expertise
            </span>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-slate/70">Impact at a glance</p>
            <ul className="mt-6 space-y-4 text-sm text-slate/70">
              <li>ISO 9001:2015 Lead Auditor & Lean Six Sigma Green Belt</li>
              <li>30+ peer-reviewed publications guiding food safety innovation</li>
              <li>Trusted advisor to SMEs, labs, and multinational brands</li>
            </ul>
            <div className="mt-6 h-px w-full bg-emerald-900/10" />
            <div className="mt-4 grid gap-2 text-xs text-slate/60 sm:grid-cols-2">
              <span>• HACCP, GMP, and BRC readiness</span>
              <span>• Laboratory protocol development</span>
              <span>• Regulatory and labeling submissions</span>
              <span>• Scientific research leadership</span>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  );
}
