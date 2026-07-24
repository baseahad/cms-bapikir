create type public.app_role as enum ('member', 'admin');

create table public.user_roles (
  user_id uuid references auth.users (id) on delete cascade not null primary key,
  role public.app_role default 'member' not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_roles enable row level security;

create policy "Users can view their own role"
  on public.user_roles for select
  using (auth.uid() = user_id);

create function public.handle_new_user_role()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_roles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created_role
  after insert on auth.users
  for each row execute procedure public.handle_new_user_role();

alter table public.payments
  add column if not exists plan public.plan default 'FREE' not null,
  add column if not exists items jsonb default '[]'::jsonb not null;

alter table public.subscriptions
  add column if not exists canceled_at timestamptz;

create index if not exists idx_payments_user_created_at
  on public.payments (user_id, created_at desc);

create index if not exists idx_payments_status_created_at
  on public.payments (status, created_at desc);

create index if not exists idx_subscriptions_plan_status
  on public.subscriptions (plan, status);

create or replace function public.admin_payment_metrics()
returns table (
  total_revenue bigint,
  total_payments bigint,
  active_subscriptions bigint,
  paid_subscriptions bigint,
  free_subscriptions bigint
)
language sql
security definer
set search_path = public
as $$
  select
    coalesce(sum(case when status = 'PAID' then amount else 0 end), 0)::bigint as total_revenue,
    count(*)::bigint as total_payments,
    (select count(*) from public.subscriptions where status = 'ACTIVE')::bigint as active_subscriptions,
    (select count(*) from public.subscriptions where plan <> 'FREE')::bigint as paid_subscriptions,
    (select count(*) from public.subscriptions where plan = 'FREE')::bigint as free_subscriptions
  from public.payments;
$$;

create or replace function public.admin_revenue_by_day(days_back int default 14)
returns table (
  date date,
  revenue bigint
)
language sql
security definer
set search_path = public
as $$
  with days as (
    select generate_series(
      current_date - greatest(days_back - 1, 0),
      current_date,
      interval '1 day'
    )::date as day
  ),
  paid as (
    select
      created_at::date as day,
      sum(amount)::bigint as revenue
    from public.payments
    where status = 'PAID'
      and created_at >= current_date - greatest(days_back - 1, 0)
    group by created_at::date
  )
  select
    days.day as date,
    coalesce(paid.revenue, 0)::bigint as revenue
  from days
  left join paid on paid.day = days.day
  order by days.day asc;
$$;
