-- PostgreSQL function: beli_produk()
-- Transaksi atomik: cek saldo → kurangin koin → insert pembelian
-- Kalo gagal di tengah, ROLLBACK semua

create or replace function public.beli_produk(
  p_user_id uuid,
  p_produk_id uuid,
  p_koin_tipe text,
  p_harga_koin integer,
  p_produk_slug text
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_saldo integer;
  v_saldo_setelah integer;
begin
  -- Cek duplikat
  if exists (select 1 from public.pembelian where user_id = p_user_id and produk_id = p_produk_id) then
    return jsonb_build_object('status', 'duplicate', 'message', 'Produk sudah dibeli');
  end if;

  -- Hitung saldo
  select coalesce(sum(mutasi), 0) into v_saldo
  from public.koin_ledger
  where user_id = p_user_id and tipe = p_koin_tipe;

  -- Cek saldo cukup
  if v_saldo < p_harga_koin then
    return jsonb_build_object('status', 'insufficient', 'saldo', v_saldo, 'message', 'Saldo tidak cukup');
  end if;

  v_saldo_setelah := v_saldo - p_harga_koin;

  -- Insert mutasi (koin berkurang)
  insert into public.koin_ledger (user_id, tipe, produk, mutasi, saldo_setelah, keterangan)
  values (p_user_id, p_koin_tipe, case when p_koin_tipe = 'protokol' then p_produk_slug else null end, -p_harga_koin, v_saldo_setelah, 'beli:' || p_produk_slug);

  -- Insert pembelian
  insert into public.pembelian (user_id, produk_id, tipe_koin, koin_terpakai)
  values (p_user_id, p_produk_id, p_koin_tipe, p_harga_koin);

  return jsonb_build_object('status', 'success', 'saldo_setelah', v_saldo_setelah);
end;
$$;
