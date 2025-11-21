import Link from 'next/link';
import { NewsletterForm } from '@/components/sections/newsletter-form';
import { Logo } from '@/components/ui/logo';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-emerald-900/10 bg-white text-slate">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <div className="space-y-5 md:max-w-md">
          <Link href="/#home" className="font-display inline-flex items-center gap-2 text-sm font-semibold tracking-[0.2em] text-slate/70">
            <Logo size="md" />
            <span>360ACE.FOOD</span>
          </Link>
          <p className="text-sm leading-6 text-slate/70">
            Safeguarding food systems with evidence-based strategy, agile implementation, and enduring partnerships across
            Africa and beyond.
          </p>
          <div className="flex gap-4 text-sm text-slate/60">
            <Link href="mailto:food@360ace.food" className="hover:text-midnight">
              food@360ace.food
            </Link>
          </div>
        </div>
        <div className="grid flex-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate/50">Navigation</p>
            <ul className="mt-4 space-y-2 text-sm text-slate/70">
              <li>
                <Link href="/#services" className="hover:text-midnight">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/#process" className="hover:text-midnight">
                  Process
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-midnight">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-midnight">
                  Contact
                </Link>
              </li>
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
          <NewsletterForm />
        </div>
      </div>
      <div className="border-t border-emerald-900/10 py-6 text-center text-xs text-slate/60">
        © {new Date().getFullYear()} 360ace.Food Consulting. All rights reserved.
      </div>
    </footer>
  );
}
