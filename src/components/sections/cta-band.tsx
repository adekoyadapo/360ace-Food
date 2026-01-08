import Link from 'next/link';
import { Reveal } from '@/components/ui/reveal';
import { getSite } from '@/lib/content';

export function CTABand() {
  const { ctaBand, site } = getSite();
  return (
    <section className="mx-auto mt-24 w-full max-w-6xl px-6">
      <Reveal variant="fade-in">
        <div className="overflow-hidden rounded-3xl border border-emerald-900/10 bg-ember px-6 py-10 text-midnight shadow-brand sm:px-8 sm:py-12">
          <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr] md:items-center">
            <div className="space-y-3 sm:space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-midnight/70">{ctaBand.eyebrow}</p>
              <h3 className="font-display text-3xl">{ctaBand.title}</h3>
              <p className="text-sm text-midnight/80">{ctaBand.description}</p>
            </div>
            <div className="flex flex-col gap-3 text-sm sm:gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-midnight px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Book a consultation
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
