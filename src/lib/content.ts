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

export function getSite(): SiteConfig {
  return site as SiteConfig;
}
