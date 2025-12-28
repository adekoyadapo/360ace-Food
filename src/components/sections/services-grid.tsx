'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Route } from 'next';
import { getServices, ServiceCategory } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';
import { useMediaQuery } from '@/hooks/use-breakpoint';

const cardVariants = {
  initial: { y: 0, rotateX: 0, rotateY: 0, boxShadow: '0 25px 60px -40px rgba(20, 60, 30, 0.25)' },
  hover: {
    y: -10,
    rotateX: 4,
    rotateY: -3,
    boxShadow: '0 45px 80px -40px rgba(20, 60, 30, 0.35)'
  }
};

export function ServicesGrid() {
  const serviceGroups: ServiceCategory[] = getServices();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const is760 = useMediaQuery('(min-width: 760px)');
  const isLg = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pages = useMemo(() => {
    const chunkSize = isLg ? 4 : is760 ? 2 : 1;
    const out: ServiceCategory[][] = [];
    for (let i = 0; i < serviceGroups.length; i += chunkSize) {
      out.push(serviceGroups.slice(i, i + chunkSize));
    }
    return out;
  }, [serviceGroups, is760, isLg]);

  useEffect(() => {
    if (index >= pages.length) setIndex(0);
  }, [pages.length, index]);

  useEffect(() => {
    if (pages.length <= 1) return;
    const id = setInterval(() => setIndex((prev) => (prev + 1) % pages.length), 10000);
    return () => clearInterval(id);
  }, [pages.length]);

  const x = useMemo(() => -index * width, [index, width]);

  return (
    <section id="services" className="anchor-offset mx-auto mt-24 w-full max-w-6xl px-6">
      <Reveal>
        <SectionHeading
          eyebrow="Services"
          title="End-to-end programs tailored to your operating reality."
          description="Modular engagements that strengthen compliance, accelerate innovation, and empower teams to own food safety outcomes."
        />
      </Reveal>
      <Reveal delay={0.1}>
        {serviceGroups.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-emerald-900/10 bg-white/90 p-8 text-center text-slate shadow-brand">
            <p className="text-sm">Service catalogue is being updated. Please check back soon.</p>
          </div>
        ) : (
        <div className="mt-12" ref={containerRef}>
          <div className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white/95 shadow-brand">
            <motion.div
              className="flex"
              animate={{ x }}
              transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.9 }}
              style={{ willChange: 'transform' }}
            >
              {pages.map((page, pageIndex) => (
                <div key={pageIndex} className="min-w-full p-6 sm:p-8" style={{ width: width || '100%' }}>
                  <div className="grid grid-cols-1 gap-6 xs760:grid-cols-2 lg:grid-cols-2 md:gap-8">
                    {page.map((group) => (
                      <motion.article
                        key={group.category}
                        initial="initial"
                        whileHover="hover"
                        variants={cardVariants}
                        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                        className="group relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white p-6 text-slate shadow-brand sm:p-8"
                      >
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                          <div className="absolute -inset-px bg-gradient-to-br from-ember/10 via-transparent to-transparent" />
                        </div>
                        <h3 className="font-display text-xl text-midnight">{group.category}</h3>
                        <p className="mt-3 text-sm text-slate/70">{group.summary}</p>
                        {Array.isArray(group.services) && group.services.length > 0 && (
                          <ul className="mt-6 space-y-2 text-sm text-slate/70">
                            {group.services.map((service) => (
                              <li key={service} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-ember" />
                                <span>{service}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {Array.isArray(group.examples) && group.examples.length > 0 && (
                          <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate/60">Examples</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate/70">
                              {group.examples.map((ex) => (
                                <li key={ex} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sage" />
                                  <span>{ex}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {Array.isArray(group.areas) && group.areas.length > 0 && (
                          <div className="mt-6">
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate/60">Training Areas</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate/70">
                              {group.areas.map((area) => (
                                <li key={area} className="flex items-start gap-2">
                                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sage" />
                                  <span>{area}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {Boolean(group.cta) && (
                          <div className="mt-6">
                            <Link
                              href={group.cta!.href as Route}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-ember hover:text-ember/80"
                              aria-label={group.cta!.label}
                            >
                              {group.cta!.label}
                              <span aria-hidden>→</span>
                            </Link>
                          </div>
                        )}
                      </motion.article>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {pages.length > 1 && (
            <div className="mt-4 flex items-center justify-end gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Show services page ${i + 1}`}
                  className={`h-2 w-8 rounded-full transition ${i === index ? 'bg-ember' : 'bg-slate/20 hover:bg-slate/30'}`}
                />
              ))}
            </div>
          )}
        </div>
        )}
      </Reveal>
    </section>
  );
}
