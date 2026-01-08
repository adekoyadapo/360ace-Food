# 360ace.Food Website

A Next.js 14 marketing experience for Dr. Ifeoluwa Adekoya’s food consultancy. The project pairs a premium UI/motion system with templated content so updates can happen without touching core components.

## Tech Stack
- Next.js 14 (App Router, TypeScript)
- Tailwind CSS with design tokens
- Framer Motion for transitions
- MDX/JSON content layer
- MailerSend Email API for contact form delivery
- dayjs for countdown timing utilities

## Getting Started
```bash
npm install
npm run dev
```
Visit `http://localhost:3000`.

## Content Management
Content lives in the `content/` directory. Edit the JSON or MDX files and restart the dev server if necessary.
- `content/site.json` – site name/brand, navigation, hero copy/CTAs, CTA band, contact email/phone
- `content/services.json` – service clusters and bullet lists
- `content/process.json`, `content/stats.json`, `content/testimonials.json` – homepage data
- `content/experts.json` – featured expert profiles (carousel)
- `content/blog/*.mdx` – long-form insight articles (frontmatter + MDX)

### Adding an Insight Article
1. Duplicate an existing file in `content/blog/`.
2. Update the frontmatter (`title`, `description`, `date`, `author`, `tags`, optional `heroImage`).
3. Add your MDX body.
4. Run `npm run dev` to preview.

## Assets
Brand assets should live under `public/`.
- `public/images/logo-light.png` – primary logo
- `public/favicon.png` – browser favicon

Swap the files with new exports and keep the same filenames to update branding.

## Contact Form & MailerSend
The contact API uses [MailerSend](https://www.mailersend.com/) to deliver notifications.

1. Verify your sending domain inside MailerSend.
2. Generate an **API Token** with `Full access` to the Email API.
3. Create `.env.local` (ignored by git) with:
   ```env
   MAILERSEND_API_TOKEN=your-mailersend-api-token
   CONTACT_FROM_EMAIL=food@360ace.food
   CONTACT_TO_EMAIL=food@360ace.food
   ```
4. Start the dev server – submissions from `ContactForm.tsx` will POST to `app/api/contact/route.ts`, render `emails/contact-request.tsx`, and send via MailerSend.

### Deploying on Netlify
1. In **Site settings → Environment variables**, add the three variables above.
2. Redeploy to inject them into the build.
3. Netlify functions will read them at runtime; no additional configuration is required.

## Deployment Notes
- Run `npm run build` for lint/build.
- The repo uses Next.js fonts; ensure outbound network is allowed or replace with self-hosted fonts when building in restricted environments.
- When deploying to Netlify, add `MAILERSEND_API_TOKEN`, `CONTACT_FROM_EMAIL`, and `CONTACT_TO_EMAIL` to the dashboard before publishing.

## Docker

The repo includes a production-grade Dockerfile and a docker compose setup.

### Build and Run (production)
- Build image: `docker compose build web`
- Start container: `docker compose up -d web`
- Open: http://localhost:3000

Environment variables are loaded from `.env` (copy `.env.example` to `.env`). At minimum you can run with:
```env
NEXT_PUBLIC_MAINTENANCE_MODE=true
NEXT_PUBLIC_LAUNCH_AT=2025-10-01T09:00:00Z
CONTACT_FROM_EMAIL=food@360ace.food
CONTACT_TO_EMAIL=food@360ace.food
MAILERSEND_API_TOKEN=demo-noop-token
```

### Logs and Stop
- Tail logs: `docker compose logs -f web`
- Stop: `docker compose down`

### Dev Profile (hot reload)
Use the `dev` profile for local development inside Docker:
- `docker compose --profile dev up` (first run takes longer for `npm ci`)
- Edits on your host sync into the container via a bind mount.

### How it works
- Multi-stage build creates a minimal Next.js [standalone] runtime (see `next.config.mjs`).
- Runtime container exposes port `3000` and starts with `node server.js`.
- Static assets are copied from `.next/static` and `public`.

## Security
- Security headers (HSTS, X-Frame-Options, CSP, etc.) configured in `next.config.mjs`
- Contact API validates input lengths, uses a honeypot, and applies a simple per-IP rate limiter
- Email HTML escapes user-submitted content (`emails/contact-request.tsx`)
- Keep deps fresh: `npm audit --omit=dev` and `npm update` periodically

## Temporary Maintenance Mode
The homepage can display a launch countdown while the site is under construction.

### Enable
1. Set an environment variable locally or on your host:
   ```env
   NEXT_PUBLIC_MAINTENANCE_MODE=true
   NEXT_PUBLIC_LAUNCH_AT=2024-11-01T09:00:00Z # optional ISO timestamp
   ```
2. Restart the server. The maintenance page with countdown and notify form will appear.

### Disable
1. Remove `NEXT_PUBLIC_MAINTENANCE_MODE` or set it to `false`.
2. Redeploy/restart – the full marketing site returns instantly.

## Git & Hosting
1. `git init`
2. `git remote add origin https://github.com/adekoyadapo/360ace-Food`
3. `git add . && git commit -m "Initial import"`
4. `git push -u origin main`

## License
Proprietary. All rights reserved.
