# VeriSpend

AI spend audits for modern teams. Finance-grade visibility into your AI tool stack, with clear overspend analysis and board-ready savings recommendations.

## Tech stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase (audit persistence)

## Supabase setup

1. Create a project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Run the migration in `supabase/migrations/001_audits.sql` via the SQL editor

Completed audits are saved with a public ID and shareable at `/audit/[id]`. Only tool usage and savings data are stored on the public audit — no email or company name.

Run `supabase/migrations/002_leads.sql` for lead capture.

## Email (Resend)

Set `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `NEXT_PUBLIC_APP_URL` in `.env.local`. After viewing audit results, users can opt in to receive a confirmation email with a short summary.

## Lead capture & abuse protection

- Leads are stored in Supabase and linked to `audit_public_id`
- **Honeypot** hidden field on the form (bots get a silent success)
- **Rate limit**: 5 submissions per hashed IP per hour (in-memory; see `src/lib/security/rate-limit.ts` for production notes)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/                 # Routes and layouts
├── components/
│   ├── layout/          # Navbar, footer, section, container
│   ├── landing/         # Landing page sections
│   └── ui/              # shadcn/ui primitives
└── lib/                 # Site config and utilities
```
