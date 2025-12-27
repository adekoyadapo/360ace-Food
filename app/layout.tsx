import type { Metadata } from 'next';
import { Inter, Manrope } from 'next/font/google';
import clsx from 'clsx';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SkipToContent } from '@/components/ui/skip-to-content';
import { PageTransition } from '@/components/layout/page-transition';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const manrope = Manrope({ subsets: ['latin'], display: 'swap', variable: '--font-manrope' });
const maintenanceEnabled = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

export const metadata: Metadata = {
  title: '360ace Food Consulting',
  description:
    'We deliver science-led food safety, regulatory, and quality assurance consulting for organizations ready to elevate compliance and consumer trust.',
  metadataBase: new URL('https://360acefood.example'),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png'
  },
  openGraph: {
    title: '360ace.Food Consulting',
    description:
      'Science-led partner for resilient food systems: regulatory readiness, training, quality systems, and research support.',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: '360ace.Food Consulting',
    description: 'Science-led partner for resilient food systems.'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={clsx(inter.variable, manrope.variable, 'bg-[var(--background)] text-[var(--foreground)]')}>
        {!maintenanceEnabled && <SkipToContent />}
        {!maintenanceEnabled && <Header />}
        <PageTransition>
          <main id="main-content" className="relative">
            {children}
          </main>
        </PageTransition>
        {!maintenanceEnabled && <Footer />}
      </body>
    </html>
  );
}
