-- Ganti gateway fee-persentase (Midtrans/Doku — fasad sistemik, bukan zatnya
-- haram, tapi tetap ditinggalkan sesuai kebijakan MALIYA CENTER di AGENTS.md)
-- dengan provider 'MANUAL': transfer manual + bukti + admin approve, pola yang
-- sama seperti koin_topup_requests (lihat 20260723000001).

alter type public.payment_provider add value if not exists 'MANUAL';

alter table public.payments
  add column if not exists bukti_path text,
  add column if not exists bank text,
  add column if not exists nama_pengirim text,
  add column if not exists tanggal_transfer date;
