create type public.payment_status as enum ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'EXPIRED');
create type public.payment_provider as enum ('MIDTRANS', 'DOKU');

create table public.payments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users (id) on delete cascade not null,
  subscription_id uuid references public.subscriptions (id) on delete set null,

  amount bigint not null, -- dalam rupiah
  currency text default 'IDR' not null,
  status public.payment_status default 'PENDING' not null,

  provider public.payment_provider not null,
  external_id text not null unique, -- order_id dari payment gateway
  payment_type text, -- qris, bank_transfer, gopay, etc

  paid_at timestamptz,
  metadata jsonb,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.payments enable row level security;

create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);
