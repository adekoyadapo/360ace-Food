import type { Metadata } from 'next';
import clsx from 'clsx';
import './globals.css';
import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SkipToContent } from '@/components/ui/skip-to-content';
import { PageTransition } from '@/components/layout/page-transition';

// Use system fonts by default to avoid external fetches in restricted environments
const useLocalFonts = true;
const maintenanceEnabled = process.env.NODE_ENV === 'production' && process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://360acefood.example';

export const metadata: Metadata = {
  title: '360ace Food Consulting',
  description:
    'We deliver science-led food safety, regulatory, and quality assurance consulting for organizations ready to elevate compliance and consumer trust.',
  metadataBase: new URL(siteUrl),
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Manrope:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={clsx('bg-[var(--background)] text-[var(--foreground)]')}>
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
