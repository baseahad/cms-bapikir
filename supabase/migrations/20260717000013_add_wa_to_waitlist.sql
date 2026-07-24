-- Gerbang unduh MESA Desktop (mesa.avathur.id/unduh) mengirim Nama + WA + Email.
-- Nullable: baris waitlist lama tak punya WA. Kewajiban ditegakkan di zod
-- (waitlistRequestSchema), bukan di kolom, supaya data lama tetap sah.
alter table public.waitlist
  add column if not exists wa text;

comment on column public.waitlist.wa is
  'Nomor WhatsApp ternormalkan (format lokal 0xxx). Wajib untuk pendaftar via gerbang unduh MESA; null untuk baris lama.';
