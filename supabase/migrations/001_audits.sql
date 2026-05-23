-- VeriSpend public audit reports (no PII — tools & savings only)
create table if not exists public.audits (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  tool_count integer not null check (tool_count > 0),
  tools jsonb not null,
  recommendations jsonb not null default '[]'::jsonb,
  total_monthly_spend_usd numeric(12, 2) not null,
  total_monthly_savings_usd numeric(12, 2) not null,
  total_annual_savings_usd numeric(12, 2) not null,
  recommendation_count integer not null default 0,
  overspend_detected boolean not null default false,
  audited_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists audits_public_id_idx on public.audits (public_id);

comment on table public.audits is
  'Shareable audit snapshots. Excludes email, company name, and other PII.';

alter table public.audits enable row level security;

-- Public read for shareable URLs
create policy "audits_public_select"
  on public.audits
  for select
  using (true);

-- Allow anonymous inserts from the app (MVP; tighten with service role + API if needed)
create policy "audits_public_insert"
  on public.audits
  for insert
  with check (true);
