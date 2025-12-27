'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Provide a valid email').max(200, 'Email too long'),
  organization: z.string().max(200, 'Organization too long').optional(),
  serviceNeed: z.string().max(200, 'Please shorten this').optional(),
  message: z.string().min(10, 'Tell us a bit more about your goals').max(4000, 'Message too long'),
  honeypot: z.string().optional()
});

type ContactData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema)
  });
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const onSubmit = async (data: ContactData) => {
    if (data.honeypot) {
      return;
    }

    setStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      reset();
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-3xl border border-white/40 bg-white/90 p-8 shadow-brand backdrop-blur"
    >
      <input type="text" className="hidden" tabIndex={-1} autoComplete="off" {...register('honeypot')} />
      <div className="grid gap-6 md:grid-cols-2">
        <Field label="Name" error={errors.name?.message}>
          <input
            {...register('name')}
            id="name"
            placeholder="Your name"
            className="w-full rounded-2xl border border-midnight/10 bg-white px-4 py-3 text-sm text-midnight/80 shadow-inner focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
          />
        </Field>
        <Field label="Organization" error={errors.organization?.message}>
          <input
            {...register('organization')}
            id="organization"
            placeholder="Company"
            className="w-full rounded-2xl border border-midnight/10 bg-white px-4 py-3 text-sm text-midnight/80 shadow-inner focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
          />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register('email')}
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-midnight/10 bg-white px-4 py-3 text-sm text-midnight/80 shadow-inner focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
          />
        </Field>
        <Field label="What do you need help with?" error={errors.serviceNeed?.message}>
          <select
            {...register('serviceNeed')}
            id="serviceNeed"
            defaultValue=""
            className="w-full appearance-none rounded-2xl border border-midnight/10 bg-white px-4 py-3 text-sm text-midnight/80 shadow-inner focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
          >
            <option value="" disabled>
              Select a focus area
            </option>
            <option value="training">Training & capability building</option>
            <option value="quality-systems">Quality systems architecture</option>
            <option value="regulatory">Regulatory & audit readiness</option>
            <option value="qa-partner">Quality assurance partnership</option>
            <option value="research">Research & product development</option>
            <option value="other">Other / unsure</option>
          </select>
        </Field>
      </div>
      <Field label="How can we help?" error={errors.message?.message}>
        <textarea
          {...register('message')}
          id="message"
          rows={6}
          placeholder="Share the challenges you want to solve"
          className="w-full rounded-2xl border border-midnight/10 bg-white px-4 py-3 text-sm text-midnight/80 shadow-inner focus:border-ember focus:outline-none focus:ring-2 focus:ring-ember/30"
        />
      </Field>
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:bg-ember/60"
      >
        {isSubmitting ? 'Sending…' : 'Submit inquiry'}
      </button>
      {status === 'success' && (
        <p className="text-sm text-sage">
          Thanks for reaching out. We will respond within two business days.
        </p>
      )}
      {status === 'error' && <p className="text-sm text-red-500">Something went wrong. Please try again.</p>}
    </form>
  );
}

function Field({
  label,
  error,
  children
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2 text-sm text-midnight/70">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-midnight/50">{label}</span>
      {children}
      {error ? <span className="text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
