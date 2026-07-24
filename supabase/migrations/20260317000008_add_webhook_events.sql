create type public.webhook_event_status as enum ('processing', 'processed', 'failed');

create table public.webhook_events (
  id uuid default gen_random_uuid() primary key,
  provider public.payment_provider not null,
  event_key text not null,
  external_id text not null,
  event_type text not null,
  status public.webhook_event_status default 'processing' not null,
  payload jsonb not null,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  constraint webhook_events_provider_event_key_key unique (provider, event_key)
);

alter table public.webhook_events enable row level security;

create index idx_webhook_events_provider_created_at
  on public.webhook_events (provider, created_at desc);

create index idx_webhook_events_provider_external_id_created_at
  on public.webhook_events (provider, external_id, created_at desc);

create index idx_webhook_events_status_created_at
  on public.webhook_events (status, created_at desc);

create or replace function public.claim_webhook_event(
  p_provider public.payment_provider,
  p_event_key text,
  p_external_id text,
  p_event_type text,
  p_payload jsonb
)
returns table (
  id uuid,
  provider public.payment_provider,
  event_key text,
  external_id text,
  event_type text,
  status public.webhook_event_status,
  payload jsonb,
  error_message text,
  processed_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  should_process boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  claimed public.webhook_events%rowtype;
  claimed_should_process boolean := false;
begin
  insert into public.webhook_events (
    provider,
    event_key,
    external_id,
    event_type,
    payload,
    status
  )
  values (
    p_provider,
    p_event_key,
    p_external_id,
    p_event_type,
    p_payload,
    'processing'
  )
  returning * into claimed;

  claimed_should_process := true;

  return query
    select
      claimed.id,
      claimed.provider,
      claimed.event_key,
      claimed.external_id,
      claimed.event_type,
      claimed.status,
      claimed.payload,
      claimed.error_message,
      claimed.processed_at,
      claimed.created_at,
      claimed.updated_at,
      claimed_should_process;
exception
  when unique_violation then
    select *
    into claimed
    from public.webhook_events
    where webhook_events.provider = p_provider
      and webhook_events.event_key = p_event_key
    for update;

    if claimed.status = 'failed' then
      update public.webhook_events
      set
        error_message = null,
        payload = p_payload,
        processed_at = null,
        status = 'processing',
        updated_at = now()
      where webhook_events.id = claimed.id
      returning * into claimed;

      claimed_should_process := true;
    end if;

    return query
      select
        claimed.id,
        claimed.provider,
        claimed.event_key,
        claimed.external_id,
        claimed.event_type,
        claimed.status,
        claimed.payload,
        claimed.error_message,
        claimed.processed_at,
        claimed.created_at,
        claimed.updated_at,
        claimed_should_process;
end;
$$;
