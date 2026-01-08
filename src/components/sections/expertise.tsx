"use client";

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getExperts, Expert } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

export function Expertise() {
  const experts = getExperts();
  if (!experts || experts.length === 0) {
    return null;
  }
  const [index, setIndex] = useState(0);
  const [resetCounter, setResetCounter] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-advance every ~10s
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % experts.length);
      setResetCounter((c) => c + 1);
    }, 10000);
    return () => clearInterval(id);
  }, [experts.length]);

  const goTo = (i: number) => {
    setIndex((i + experts.length) % experts.length);
    setResetCounter((c) => c + 1);
  };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  const x = useMemo(() => -index * width, [index, width]);

  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-6">
      <Reveal>
        <SectionHeading eyebrow="Featured Expertise" title="Meet our experts" />
      </Reveal>
      <div className="relative mt-12" ref={containerRef}>
        <div className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-white/95 shadow-brand">
          <motion.div
            className="flex"
            animate={{ x }}
            transition={{ type: 'spring', stiffness: 180, damping: 24, mass: 0.9 }}
            style={{ willChange: 'transform' }}
          >
            {experts.map((person) => (
              <Slide key={person.name} expert={person} width={width} resetCounter={resetCounter} />
            ))}
          </motion.div>
        </div>

        {/* Bottom scrollbar-like pager */}
        <div className="mt-4 flex items-center justify-end gap-2">
            {experts.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show expert ${i + 1}`}
                className={`h-2 w-8 rounded-full transition ${i === index ? 'bg-ember' : 'bg-slate/20 hover:bg-slate/30'}`}
              />
            ))}
        </div>
      </div>
    </section>
  );
}

function Slide({ expert, width, resetCounter }: { expert: Expert; width: number; resetCounter: number }) {
  const [expanded, setExpanded] = useState(false);
  const detailsId = useMemo(
    () => `expert-details-${expert.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    [expert.name]
  );
  const shortBio = useMemo(() => {
    const text = expert.bio ?? '';
    const limit = 180;
    return text.length > limit ? `${text.slice(0, limit).trimEnd()}…` : text;
  }, [expert.bio]);

  // Reset expanded state whenever the carousel advances to a new expert
  useEffect(() => {
    setExpanded(false);
  }, [resetCounter]);

  return (
    <article
      className="grid min-w-full gap-8 p-6 text-slate md:grid-cols-[0.9fr_1.1fr] md:items-center md:p-8"
      style={{ width: width || '100%' }}
    >
      <div className="relative overflow-hidden rounded-3xl border border-emerald-900/10 bg-white/95 p-4 md:p-6 shadow-brand">
        <div className="aspect-[4/3] md:aspect-[3/4] w-full overflow-hidden rounded-2xl bg-slate/10">
          <Image
            src={expert.image}
            alt={expert.name}
            width={600}
            height={800}
            className="h-full w-full object-contain object-top md:object-cover md:object-center"
          />
        </div>
        {/* Mobile: truncated bio with toggle */}
        <p className="mt-6 text-sm text-slate/70 md:hidden">{expanded ? expert.bio : shortBio}</p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 inline-flex items-center text-xs font-semibold text-ember md:hidden"
          aria-expanded={expanded}
          aria-controls={detailsId}
        >
          {expanded ? 'Show less' : 'Read more'}
        </button>
        {/* Desktop: full bio */}
        <p className="mt-6 hidden text-sm text-slate/70 md:block">{expert.bio}</p>
      </div>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="mobile-details"
            id={detailsId}
            className="space-y-6 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-8 text-slate shadow-brand">
              <p className="text-sm uppercase tracking-[0.32em] text-slate/60">{expert.name}</p>
              <p className="mt-1 text-sm font-semibold text-midnight">{expert.title}</p>
              {expert.recognitions?.length ? (
                <ul className="mt-5 space-y-4 text-sm text-slate/70">
                  {expert.recognitions.map((rec) => (
                    <li key={rec}>
                      <p>{rec}</p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            {expert.collaborations?.length ? (
              <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-8 text-slate shadow-brand">
                <p className="text-sm uppercase tracking-[0.32em] text-slate/60">Collaboration Highlights</p>
                <ul className="mt-5 space-y-2 text-sm text-slate/70">
                  {expert.collaborations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden space-y-6 md:block">
        <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-8 text-slate shadow-brand">
          <p className="text-sm uppercase tracking-[0.32em] text-slate/60">{expert.name}</p>
          <p className="mt-1 text-sm font-semibold text-midnight">{expert.title}</p>
          {expert.recognitions?.length ? (
            <ul className="mt-5 space-y-4 text-sm text-slate/70">
              {expert.recognitions.map((rec) => (
                <li key={rec}>
                  <p>{rec}</p>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        {expert.collaborations?.length ? (
          <div className="rounded-3xl border border-emerald-900/10 bg-white/95 p-8 text-slate shadow-brand">
            <p className="text-sm uppercase tracking-[0.32em] text-slate/60">Collaboration Highlights</p>
            <ul className="mt-5 space-y-2 text-sm text-slate/70">
              {expert.collaborations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}
