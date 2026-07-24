-- CMS Bapikir: Produk & Pesanan
-- Migration 12: Products & Orders

create table if not exists products (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    title text not null,
    slug text not null unique,
    description text,
    price int not null, -- dalam rupiah
    category text not null check (category in ('digital', 'jasa', 'fisik')),
    image_url text,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists orders (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references profiles(id) on delete cascade,
    product_id uuid references products(id),
    amount int not null,
    status text not null default 'pending' check (status in ('pending','paid','failed','refunded')),
    payment_method text,
    payment_provider text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- RLS
alter table products enable row level security;
alter table orders enable row level security;

create policy "Anyone can view active products"
    on products for select using (is_active = true);

create policy "Users can manage own products"
    on products for all using (auth.uid() = user_id);

create policy "Users can view own orders"
    on orders for select using (auth.uid() = user_id);
