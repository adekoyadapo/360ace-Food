import services from '~content/services.json';
import processSteps from '~content/process.json';
import insights from '~content/insights.json';
import stats from '~content/stats.json';
import recognitions from '~content/recognitions.json';
import testimonials from '~content/testimonials.json';
import experts from '~content/experts.json';
import site from '~content/site.json';

export type ServiceCategory = (typeof services)[number] & {
  areas?: string[];
  examples?: string[];
  cta?: { label: string; href: string };
};
export type ProcessStep = (typeof processSteps)[number];
export type Insight = (typeof insights)[number];
export type Stat = (typeof stats)[number];
export type Recognition = (typeof recognitions)[number];
export type Testimonial = (typeof testimonials)[number];
export type Expert = (typeof experts)[number];
export type SiteConfig = typeof site;

export function getServices(): ServiceCategory[] {
  return services as ServiceCategory[];
}

export function getProcess() {
  return processSteps;
}

export function getInsights() {
  return insights;
}

export function getStats() {
  return stats;
}

export function getRecognitions() {
  return recognitions;
}

export function getTestimonials() {
  return testimonials;
}

export function getExperts() {
  return experts as Expert[];
}

const DEFAULT_SITE: SiteConfig = {
  site: {
    name: '360ACE.FOOD',
    brand: '360ace.Food',
    email: 'food@360ace.food',
    phone: '+1 (212) 555-0123'
  },
  nav: [
    { path: '#home', label: 'Home' },
    { path: '#services', label: 'Services' },
    { path: '#process', label: 'Process' },
    { path: '/insights', label: 'Insights' },
    { path: '/contact', label: 'Contact' }
  ],
  hero: {
    eyebrow: 'Precision Food Safety Consulting',
    title: 'Science-led protection for resilient, trusted food systems.',
    subtitle:
      'We help quality leaders anticipate risk, engineer compliant operations, and build consumer confidence through evidence-based strategy, training, and research partnerships.',
    primaryCta: { label: 'Book a consultation', href: '/contact' },
    secondaryCta: { label: 'Explore capabilities', href: '/#services' }
  },
  ctaBand: {
    eyebrow: 'Partner with us',
    title: 'Ready to elevate your food safety posture?',
    description:
      'Let’s co-design a roadmap that aligns compliance, capability, and innovation across your value chain.'
  }
};

export function getSite(): SiteConfig {
  const cfg = (site ?? {}) as Partial<SiteConfig>;
  return {
    site: { ...DEFAULT_SITE.site, ...(cfg.site ?? {}) },
    nav: (cfg.nav && Array.isArray(cfg.nav) ? cfg.nav : DEFAULT_SITE.nav) as SiteConfig['nav'],
    hero: { ...DEFAULT_SITE.hero, ...(cfg.hero ?? {}) },
    ctaBand: { ...DEFAULT_SITE.ctaBand, ...(cfg.ctaBand ?? {}) }
  } as SiteConfig;
}
