create type public.plan as enum ('FREE', 'BASIC', 'PRO', 'ULTIMATE');
create type public.subscription_status as enum ('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID');

create table public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id) on delete cascade not null unique,
  plan public.plan default 'FREE' not null,
  status public.subscription_status default 'ACTIVE' not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Auto-create free subscription when a new user signs up
create function public.handle_new_subscription()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.subscriptions (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created_subscription
  after insert on auth.users
  for each row execute procedure public.handle_new_subscription();
