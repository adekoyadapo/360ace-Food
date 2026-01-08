import { notFound } from 'next/navigation';

export default function InsightDetailPage() {
  notFound();
}

export async function generateStaticParams() {
  return [] as Array<{ slug: string }>;
}
