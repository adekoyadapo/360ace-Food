import type { MetadataRoute } from 'next';
import { getBlogSlugs } from '@/lib/blog';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://360acefood.example';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/insights`, changeFrequency: 'weekly', priority: 0.8 }
  ];

  const slugs = await getBlogSlugs().catch(() => [] as string[]);
  const posts: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${base}/insights/${slug}`,
    changeFrequency: 'monthly',
    priority: 0.7
  }));

  return [...staticRoutes, ...posts];
}

