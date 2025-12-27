'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getProcess } from '@/lib/content';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

const spring = { type: 'spring', stiffness: 180, damping: 24, mass: 0.9 } as const;

export function ProcessTimeline() {
  const steps = getProcess();
  const [hovered, setHovered] = useState<number | null>(null);
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <section id="process" className="anchor-offset mx-auto mt-24 w-full max-w-6xl px-6">
      <Reveal>
        <SectionHeading
          eyebrow="Process"
          title="Clarity at every stage of engagement."
          description="A partnership designed to reveal insights quickly, with precision, and sustain measurable performance."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-12 grid gap-6 md:grid-cols-5">
          {steps.map((step, index) => {
            const isActive = hovered === index;
            return (
              <motion.div
                key={step.step}
                onHoverStart={() => setHovered(index)}
                onHoverEnd={() => setHovered(null)}
                onFocus={() => setHovered(index)}
                onBlur={() => setHovered(null)}
                tabIndex={0}
                role="button"
                aria-expanded={isActive}
                aria-controls={`process-desc-${index}`}
                className={'relative rounded-3xl border border-emerald-900/10 bg-white/90 p-5 text-slate sm:p-6 overflow-visible transform-gpu focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ember/50'}
                style={{
                  boxShadow: isActive ? '0 40px 110px -50px rgba(20,60,30,0.40)' : '0 8px 24px rgba(20,60,30,0.06)',
                  zIndex: isActive ? 30 : 0,
                  willChange: 'transform'
                }}
                animate={isActive ? { scale: 1.12, y: -8 } : { scale: 1, y: 0 }}
                transition={spring}
              >
                {/* Base content (always visible) */}
                <div className="relative z-10">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ember/90 text-sm font-semibold text-midnight shadow-brand">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-lg text-midnight">{step.step}</h3>
                  {/* Mobile: show description by default for usability */}
                  <p id={`process-desc-${index}`} className="mt-3 text-sm text-slate/70 md:hidden">{step.description}</p>
                </div>

                {/* Subtle glow behind active card */}
                <motion.div
                  className="pointer-events-none absolute -inset-[3rem] sm:-inset-[3.5rem] md:-inset-[4rem] lg:-inset-[5rem] z-10 hidden rounded-[2rem] bg-ember/15 blur-[70px] md:block"
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />

                {/* Hover overlay (desktop): expanded content without affecting layout */}
                <motion.div
                  className="pointer-events-none absolute -inset-[3rem] sm:-inset-[3.5rem] md:-inset-[4rem] lg:-inset-[5rem] z-20 hidden rounded-3xl bg-white p-6 sm:p-7 md:p-8 lg:p-9 shadow-brand border border-emerald-900/15 md:block"
                  animate={isActive ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-ember/90 text-sm font-semibold text-midnight shadow-brand">
                    {index + 1}
                  </div>
                  <h3 className="font-display text-xl text-midnight">{step.step}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate/80">{step.description}</p>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
