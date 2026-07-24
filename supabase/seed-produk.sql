-- Seed data for public.produk
-- Run AFTER migration 20260715000011_create_koin_produk.sql

-- Avathur Products (Koin Bapikir)
insert into public.produk (nama, slug, deskripsi, tipe, harga_koin, koin_tipe, status, url_konten) values
(
  'Cerita SSD Palsu',
  'cerita-ssd-palsu',
  'Artikel premium: pengalaman beli SSD palsu dan pelajarannya.',
  'artikel', 5, 'bapikir', 'published', '/blog/cerita-ssd-palsu-dan-perjalanan-upgrade'
);
