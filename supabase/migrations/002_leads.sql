-- Lead capture linked to public audits (PII stored server-side only via API)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  audit_public_id text not null references public.audits (public_id) on delete cascade,
  email text not null,
  company_name text,
  role text,
  team_size integer check (team_size is null or team_size > 0),
  ip_hash text,
  created_at timestamptz not null default now()
);

create index if not exists leads_audit_public_id_idx on public.leads (audit_public_id);
create index if not exists leads_email_idx on public.leads (email);
create unique index if not exists leads_audit_email_unique on public.leads (audit_public_id, email);

comment on table public.leads is
  'Lead capture from audit results. Associated to audit via public_id.';

alter table public.leads enable row level security;

-- No public read — leads are written/read via server API only
create policy "leads_no_public_select"
  on public.leads
  for select
  using (false);

-- Inserts go through Next.js API (anon key). Tighten with service role in production.
create policy "leads_api_insert"
  on public.leads
  for insert
  with check (true);
