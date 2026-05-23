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

Completed audits are saved with a public ID and shareable at `/audit/[id]`. Only tool usage and savings data are stored — no email or company name.

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
