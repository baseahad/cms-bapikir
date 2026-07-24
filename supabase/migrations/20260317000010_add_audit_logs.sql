create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  type text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  actor_email text not null,
  description text not null,
  metadata jsonb,
  created_at timestamptz default now() not null
);

alter table public.audit_logs enable row level security;

create index idx_audit_logs_created_at
  on public.audit_logs (created_at desc);

create index idx_audit_logs_type_created_at
  on public.audit_logs (type, created_at desc);
