create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  created_at timestamptz not null default now()
);

alter table public.waitlist enable row level security;

-- Only service role can read/write (no public access)
create policy "service_role_all" on public.waitlist
  as permissive for all
  to service_role
  using (true)
  with check (true);

-- Public insert only (anyone can join waitlist)
create policy "public_insert" on public.waitlist
  as permissive for insert
  to anon, authenticated
  with check (true);
