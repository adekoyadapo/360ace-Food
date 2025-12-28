'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100, 'Name too long'),
  email: z.string().email('Provide a valid email').max(200, 'Email too long'),
  organization: z.string().max(200, 'Organization too long').optional(),
  serviceNeed: z.string().max(200, 'Please shorten this').optional(),
  message: z.string().min(10, 'Tell us a bit more about your goals').max(4000, 'Message too long'),
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm consent to proceed' }) }),
  honeypot: z.string().optional()
});

type ContactData = z.infer<typeof contactSchema>;

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema)
  });
  const consent = watch('consent');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  useEffect(() => {
    if (status === 'success' || status === 'error') {
      const id = setTimeout(() => setStatus('idle'), 6000);
      return () => clearTimeout(id);
    }
  }, [status]);

  const onSubmit = async (data: ContactData) => {
    if (data.honeypot) {
      return;
    }

    setStatus('idle');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': process.env.NEXT_PUBLIC_CONTACT_REQUESTED_WITH || '360ace-food'
        },
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
      <div className="rounded-2xl border border-midnight/10 bg-white px-4 py-3">
        <label className="flex items-start gap-3 text-sm text-midnight/80">
          <input type="checkbox" {...register('consent')} className="mt-1 h-4 w-4 rounded border-slate/40" />
          <span>
            I agree to share my details so 360ace.Food can respond to my inquiry. We will not use your information for
            anything other than responding to your message.
          </span>
        </label>
        {errors.consent?.message ? <p className="mt-2 text-xs text-red-500">{errors.consent.message}</p> : null}
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !consent}
        className="inline-flex items-center gap-2 rounded-full bg-ember px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-lg disabled:bg-ember/60"
      >
        {isSubmitting ? 'Sending…' : 'Submit inquiry'}
      </button>
      <AnimatePresence>
        {status === 'success' && (
          <motion.div
            key="toast-success"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-emerald-900/10 bg-white/95 p-4 text-sm text-midnight shadow-brand backdrop-blur sm:left-auto sm:right-6 sm:translate-x-0"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-ember" />
              <div>
                <p className="font-semibold">Message sent</p>
                <p className="mt-1 text-slate/70">Thanks for reaching out. We will respond within two business days.</p>
              </div>
            </div>
          </motion.div>
        )}
        {status === 'error' && (
          <motion.div
            key="toast-error"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="pointer-events-auto fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-red-200 bg-white/95 p-4 text-sm text-midnight shadow-brand backdrop-blur sm:left-auto sm:right-6 sm:translate-x-0"
            role="status"
            aria-live="assertive"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 h-2 w-2 flex-none rounded-full bg-red-400" />
              <div>
                <p className="font-semibold">Send failed</p>
                <p className="mt-1 text-slate/70">Something went wrong. Please try again in a moment.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
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
