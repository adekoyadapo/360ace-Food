import { NextResponse } from 'next/server';
import { z } from 'zod';
import ContactRequestEmail from '../../../emails/contact-request';

const mailerSendToken = process.env.MAILERSEND_API_TOKEN;

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  organization: z.string().max(200).optional(),
  serviceNeed: z.string().max(200).optional(),
  message: z.string().min(10).max(4000),
  honeypot: z.string().optional()
});

// naive in-memory rate limiter (per instance)
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const requests = new Map<string, { count: number; expires: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = requests.get(key);
  if (!entry || entry.expires < now) {
    requests.set(key, { count: 1, expires: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  if (entry.count > RATE_LIMIT_MAX) return true;
  return false;
}

export async function POST(request: Request) {
  try {
    // Basic rate-limit: use x-forwarded-for or remote address
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    const json = await request.json();
    const data = contactSchema.parse(json);

    if (data.honeypot) {
      return NextResponse.json({ status: 'ok' });
    }

    if (!mailerSendToken) {
      console.warn('MailerSend API token missing.');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!to || !from) {
      console.warn('Contact email environment variables missing.');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }

    const response = await fetch('https://api.mailersend.com/v1/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mailerSendToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: { email: from, name: '360ace.Food' },
        to: [{ email: to, name: '360ace.Food' }],
        subject: `New inquiry from ${data.name}`,
        html: ContactRequestEmail({
          name: data.name,
          email: data.email,
          organization: data.organization,
          serviceNeed: data.serviceNeed,
          message: data.message
        })
      })
    });

    if (!response.ok) {
      console.error('MailerSend error', await response.text());
      return NextResponse.json({ error: 'Failed to send message' }, { status: 502 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
