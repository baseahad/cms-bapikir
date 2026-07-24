create table public.ai_usage (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null,
  model text not null,
  prompt_tokens int default 0 not null,
  completion_tokens int default 0 not null,
  created_at timestamptz default now() not null
);

alter table public.ai_usage enable row level security;

create policy "Users can view their own AI usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);

create policy "Service role can insert AI usage"
  on public.ai_usage for insert
  with check (auth.uid() = user_id);

create index idx_ai_usage_user_month
  on public.ai_usage (user_id, created_at);
