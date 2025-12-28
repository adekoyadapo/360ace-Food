import { NextResponse } from 'next/server';
import { z } from 'zod';
import ContactRequestEmail from '../../../emails/contact-request';

const smtpHost = process.env.SMTP_HOST;
const smtpPort = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
const smtpSecure = process.env.SMTP_SECURE === 'true';
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const allowedOrigins = (process.env.CONTACT_ALLOWED_ORIGINS || process.env.NEXT_PUBLIC_SITE_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(200),
  organization: z.string().max(200).optional(),
  serviceNeed: z.string().max(200).optional(),
  message: z.string().min(10).max(4000),
  consent: z.literal(true),
  honeypot: z.string().optional()
});

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const DAILY_LIMIT_MAX = Number(process.env.CONTACT_DAILY_LIMIT || '20');
const requests = new Map<string, { count: number; expires: number }>();
const dailyRequests = new Map<string, number>();

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

function isDailyLimited(ip: string): boolean {
  const d = new Date();
  const key = `${ip}:${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, '0')}${String(d.getUTCDate()).padStart(2, '0')}`;
  const count = (dailyRequests.get(key) || 0) + 1;
  dailyRequests.set(key, count);
  return count > DAILY_LIMIT_MAX;
}

export async function POST(request: Request) {
  try {
    // Origin/Referer allowlist check (optional in dev if no env provided)
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    if (allowedOrigins.length) {
      const ok = allowedOrigins.some((o) => origin.startsWith(o) || referer.startsWith(o));
      if (!ok) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    // CSRF-style header check (X-Requested-With) to ensure same-site JS initiated
    const requestedWith = request.headers.get('x-requested-with') || '';
    const expectedRequestedWith = process.env.CONTACT_REQUESTED_WITH || '';
    if (expectedRequestedWith && requestedWith !== expectedRequestedWith) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    // Basic rate-limit: use x-forwarded-for or remote address
    const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
    if (isDailyLimited(ip)) {
      return NextResponse.json({ error: 'Daily limit exceeded' }, { status: 429 });
    }
    const json = await request.json();
    const data = contactSchema.parse(json);

    // Simple content heuristics to reduce spam links
    const linkMatches = (data.message.match(/https?:\/\/|www\./gi) || []).length;
    if (linkMatches > 2) {
      return NextResponse.json({ error: 'Too many links' }, { status: 400 });
    }

    if (data.honeypot) {
      return NextResponse.json({ status: 'ok' });
    }

    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL;

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !to || !from) {
      console.warn('SMTP/Contact env missing.');
      return NextResponse.json({ error: 'Email service not configured' }, { status: 503 });
    }
    // Lazy import nodemailer at runtime to avoid bundling issues in restricted environments
    const nodemailerModule: any = await (Function('m', 'return import(m)'))('nodemailer');
    const transporter = nodemailerModule.default.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: { user: smtpUser, pass: smtpPass }
    });

    const allowArbitraryFrom = process.env.SMTP_ALLOW_ARBITRARY_FROM === 'true';
    const mailFrom = allowArbitraryFrom ? data.email : from;

    const info = await transporter.sendMail({
      from: mailFrom,
      to,
      replyTo: data.email,
      subject: `New inquiry from ${data.name}`,
      html: ContactRequestEmail({
        name: data.name,
        email: data.email,
        organization: data.organization,
        serviceNeed: data.serviceNeed,
        message: data.message
      })
    });

    if (!info.messageId) {
      console.error('SMTP send failed:', info);
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
