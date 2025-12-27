import Link from 'next/link';
import { SectionHeading } from '@/components/ui/section-heading';
import { formatDate } from '@/lib/date';
import type { BlogSummary } from '@/lib/blog';
import { Reveal } from '@/components/ui/reveal';

interface InsightsProps {
  posts: BlogSummary[];
}

export function Insights({ posts }: InsightsProps) {
  const list = posts ?? [];
  return (
    <section id="insights" className="mx-auto mt-24 w-full max-w-6xl px-6">
      <div className="flex items-end justify-between gap-6">
        <Reveal>
          <SectionHeading
            eyebrow="Insights"
            title="Timely intelligence tailored to your quality teams."
            description="Curated articles that keep stakeholders proactive on emerging risks and regulatory change."
          />
        </Reveal>
        <Link href="/insights" className="hidden text-sm font-semibold text-ember md:inline-flex">
          View all
        </Link>
      </div>
      {list.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-emerald-900/10 bg-white/90 p-8 text-center text-slate shadow-brand">
          <p className="text-sm">No insights published yet. Check back soon.</p>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 md:grid-cols-3">
        {list.map((post, index) => (
          <Reveal key={post.slug} delay={0.05 * index}>
            <article
              className="group rounded-3xl border border-emerald-900/10 bg-white/90 p-6 shadow-brand transition hover:-translate-y-1 hover:border-ember/40 sm:p-8"
            >
              <div className="text-xs uppercase tracking-[0.28em] text-slate/60">{formatDate(post.date)}</div>
              <h3 className="mt-4 font-display text-2xl text-midnight group-hover:text-ember">{post.title}</h3>
              <p className="mt-3 text-sm text-slate/70">{post.description}</p>
              <Link href={`/insights/${post.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ember">
                Read article <span aria-hidden>→</span>
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
      )}
      <Link href="/insights" className="mt-10 inline-flex text-sm font-semibold text-ember md:hidden">
        View all insights
      </Link>
    </section>
  );
}
