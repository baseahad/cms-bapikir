-- Migration: koin_topup_requests — MALIYA CENTER manual transfer verification
-- Replaces the old topup/konfirmasi flow, which let a user credit their own
-- koin_ledger with zero proof-of-transfer or admin check (self-approve exploit).
-- New flow: user creates a pending request -> attaches transfer proof -> only
-- an admin can approve (via approve_koin_topup) or reject it. Only approval
-- ever writes to koin_ledger.

create table if not exists public.koin_topup_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  tipe text not null check (tipe in ('bapikir', 'protokol')),
  produk text,
  jumlah integer not null check (jumlah > 0),
  bank text,
  nama_pengirim text,
  tanggal_transfer date,
  bukti_path text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  catatan text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.koin_topup_requests enable row level security;

create policy "Users view own topup requests"
  on public.koin_topup_requests for select
  using (auth.uid() = user_id);

create policy "Users create own topup requests"
  on public.koin_topup_requests for insert
  with check (auth.uid() = user_id);

-- Users may attach transfer proof to their own request while it's still
-- pending, but the WITH CHECK forces status to stay 'pending' after the
-- update, so a user can never flip their own request to 'approved'.
create policy "Users submit proof for own pending request"
  on public.koin_topup_requests for update
  using (auth.uid() = user_id and status = 'pending')
  with check (auth.uid() = user_id and status = 'pending');

-- Atomic approve: credit koin_ledger + mark request approved.
-- security definer so it can write koin_ledger (which has no INSERT policy
-- for regular users) — callers must be authorized as admin before invoking
-- this (enforced in the API route via authorizeAdminRequest(), same pattern
-- as the rest of /api/admin/*).
create or replace function public.approve_koin_topup(
  p_request_id uuid,
  p_admin_id uuid
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request record;
  v_saldo integer;
  v_saldo_setelah integer;
begin
  select * into v_request from public.koin_topup_requests where id = p_request_id for update;

  if not found then
    return jsonb_build_object('status', 'not_found');
  end if;

  if v_request.status <> 'pending' then
    return jsonb_build_object('status', 'already_reviewed');
  end if;

  select coalesce(sum(mutasi), 0) into v_saldo
  from public.koin_ledger
  where user_id = v_request.user_id and tipe = v_request.tipe;

  v_saldo_setelah := v_saldo + v_request.jumlah;

  insert into public.koin_ledger (user_id, tipe, produk, mutasi, saldo_setelah, keterangan)
  values (v_request.user_id, v_request.tipe, v_request.produk, v_request.jumlah, v_saldo_setelah, 'topup:approved:' || p_request_id);

  update public.koin_topup_requests
    set status = 'approved', reviewed_by = p_admin_id, reviewed_at = now()
    where id = p_request_id;

  return jsonb_build_object('status', 'success', 'saldo_setelah', v_saldo_setelah);
end;
$$;

create or replace function public.reject_koin_topup(
  p_request_id uuid,
  p_admin_id uuid,
  p_catatan text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_updated int;
begin
  update public.koin_topup_requests
    set status = 'rejected', reviewed_by = p_admin_id, reviewed_at = now(), catatan = p_catatan
    where id = p_request_id and status = 'pending';

  get diagnostics v_updated = row_count;

  if v_updated = 0 then
    return jsonb_build_object('status', 'not_found_or_already_reviewed');
  end if;

  return jsonb_build_object('status', 'success');
end;
$$;
