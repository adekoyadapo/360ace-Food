import type { Metadata } from 'next';
import { ContactForm } from '@/components/sections/contact-form';
import { SectionHeading } from '@/components/ui/section-heading';
import { Reveal } from '@/components/ui/reveal';

export const metadata: Metadata = {
  title: 'Contact | 360ace.Food Consulting',
  description:
    'Connect with Dr. Ifeoluwa Adekoya to design bespoke food safety, quality assurance, and regulatory readiness programs.',
  alternates: { canonical: '/contact' }
};

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-6 pb-24 pt-24">
      <Reveal>
        <SectionHeading
          eyebrow="Contact"
          title="Ready to elevate your food safety posture?"
          description="Share your goals and we will align on the right engagement—training, audit readiness, or long-term partnership."
        />
      </Reveal>
      <Reveal delay={0.1}>
        <div className="mt-12">
          <ContactForm />
        </div>
      </Reveal>
    </div>
  );
}
