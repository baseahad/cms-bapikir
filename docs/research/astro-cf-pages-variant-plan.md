# Riset & Rencana: Varian Astro untuk Target #1 (Cloudflare Pages Gratis)

> Status: **RISET/PERENCANAAN SAJA — belum dikerjakan.** Digarap setelah versi Next.js/VPS (target #3) selesai dan sudah dipakai jualan di avathur.id. Dokumen ini adalah pengganti pendekatan lama ("port Next.js ke Cloudflare via `@opennextjs/cloudflare`") yang butuh Workers paid plan — lihat riwayat di memory `cms-bapikir-productization`.

## 1. Kenapa pendekatan lama (port Next.js) ditinggalkan

Next.js + Supabase SSR + AI SDK + Resend + Radix + Recharts + midtrans-client/doku sebagai satu bundle Worker melewati batas gratis 3 MiB Cloudflare Workers — otomatis butuh paid plan. Ditambah 1 resiko upstream yang belum ada solusi resmi (`@supabase/ssr` di Workers, `supabase/supabase#37592`). Ini bukan soal effort saja, tapi soal janji "gratis selamanya" yang jadi alasan target #1 ada — kalau ujung-ujungnya tetap bayar Workers, nilai jualnya hilang.

## 2. Bukti pola yang sudah terbukti jalan: WAKI

WAKI (bisnis nyata milik Avathur, 3 klien produksi: Tokotani 97%, Ananda Store 95%, STIH HR ~85%) sudah membuktikan pola ini gratis dan production-ready. Contoh konkret yang diperiksa — proyek **STPKU Pangkalan Bun** (`ginkdigital/stpkupbun`, Lighthouse: Performance 93, A11Y 90, Best Practice 96, SEO 100):

```
stpkupbun/                          ← Astro, deploy ke Cloudflare Pages (git push origin main = auto-deploy, GRATIS)
├── src/pages/*.astro                 halaman statis (landing, blog, 404, dst)
├── src/content/blog/                 19 artikel markdown
├── public/{manifest.json,sw.js}      PWA — instalable, offline-capable, murni statis
└── functions/admin/[[catchall]].js   Pages Functions — PROXY ke Worker terpisah (biar Set-Cookie kebawa)

donasi-worker/                      ← Cloudflare Worker TERPISAH (repo lain), deploy via `wrangler deploy`
└── src/index.js                      admin panel: login password, tulis/baca Cloudflare KV
```

Poin kunci: **bagian statis (Astro di Pages) dan bagian dinamis/privileged (Worker) adalah dua deployment terpisah**, disambung lewat Pages Functions sebagai proxy. Data dinamis (progres donasi) disimpan di Cloudflare KV, bukan database eksternal. Auth admin cuma password sederhana (secret di Worker env) — bukan sistem auth penuh seperti Supabase SSR.

Ini pola yang sama persis yang perlu ditiru untuk CMS-Bapikir versi Astro — bedanya CMS-Bapikir sudah punya Supabase sebagai database+auth, jadi tidak perlu diganti ke KV/D1 dari awal (lihat opsi A vs B di bagian 4).

## 3. Peta fitur CMS-Bapikir: mana "nilai", mana "pipa Next.js"

Dicek langsung dari kode (`app/api/**/route.ts`, `supabase/migrations/*`):

| Fitur | Letak | Kategori | Catatan portabilitas |
|---|---|---|---|
| Arc Kehidupan (`arcs`, `arc_entries`) | migrasi `20260710000011` | **NILAI INTI** | Tabel Supabase murni + RLS (`is_public=true` untuk publik, `auth.uid()=user_id` untuk privat) — didesain dari awal untuk bisa diakses langsung dari client (browser) via `supabase-js`, tidak wajib lewat Next.js API. |
| Arsip Anak (`children`, `child_milestones`) | migrasi `20260710000011` | **NILAI INTI** | Sama seperti Arc — RLS-native, portable ke client langsung. |
| Ekonomi Koin Syariah (`koin_ledger`, `produk`, `pembelian`) | migrasi `20260715000011/12`, `app/api/koin/*` | **NILAI INTI** (data model) + **pipa privileged** (topup/approve) | Baca saldo & katalog: portable ke client langsung (RLS `select`). Tapi topup/kredit koin (`app/api/koin/topup`, `konfirmasi`) butuh service-role write (approve manual transfer) — ini HARUS tetap di server privileged, sama persis kebutuhan seperti Worker admin-panel WAKI. |
| ~~Pembayaran Midtrans/Doku (`app/api/webhooks/*`, `lib/payments/*`)~~ — **DIHAPUS 24 Jul, diganti transfer manual** | `app/api/payments/*`, `lib/data/payments.ts` | **NILAI INTI** (data model) + **pipa privileged** (admin approve) | Gateway Midtrans/Doku dicabut sepenuhnya (fee-persentase = fasad, lihat `AGENTS.md`) — subscription payment sekarang persis pola baris Koin di atas: user upload bukti transfer, admin approve via service-role, tanpa webhook sama sekali. Ini justru menyederhanakan analisis migrasi ke Cloudflare — tidak ada lagi kebutuhan verifikasi HMAC signature pihak ketiga, cukup service-role write seperti `koin/topup`. |
| AI Chat streaming (`app/api/ai/chat`) | `lib/ai/*` | **Pipa Next.js, PALING BERAT dipindah** | `streamText` dari Vercel AI SDK + auth + rate-limit + usage-tracking (butuh Supabase service-role). Bundle AI SDK sendirian (tanpa Next.js+Radix+Recharts) mungkin muat di Workers, tapi belum diverifikasi — atau, opsi lebih murah: **jangan dipindah sama sekali**, panggil endpoint AI yang sudah ada di deployment avathur.id/VPS (target #3) sebagai API eksternal — persis pola MESA (chatbot MESA memang sudah jadi service terpisah, bukan menempel di app). |
| Auth (Supabase SSR, `proxy.ts`) | `lib/supabase/*` | **Pipa Next.js** | Astro tidak butuh SSR cookie sync ala Next.js — Supabase Auth punya SDK client-side (`supabase-js`) yang jalan langsung dari browser statis: magic link, OAuth, semua bisa dipanggil dari Astro tanpa server-side session sync. Kehilangan proteksi SSR-rendered page (halaman privat dirender penuh di client, bukan di server) — trade-off yang sudah diterima banyak arsitektur "headless". |
| CORS allowlist per-origin | `app/api/waitlist/route.ts` (`NEXT_PUBLIC_WAITLIST_EXTRA_ORIGINS`) | **Sudah ada infrastrukturnya** | Pola CORS-by-config ini tinggal digenericize ke semua route API, bukan bikin dari nol — kalau Astro sites manggil API Next.js/VPS sebagai backend eksternal, origin `*.pages.dev`/domain klien tinggal didaftarkan. |

## 4. Dua opsi arsitektur

### Opsi A — "Astro statis + backend API yang sudah ada" (direkomendasikan sebagai langkah pertama)

```
Klien A (Astro, CF Pages GRATIS)  ─┐
Klien B (Astro, CF Pages GRATIS)  ─┼─→  fetch API  →  avathur.id / VPS klien (Next.js, target #3, SUDAH SELESAI)
Klien C (Astro, CF Pages GRATIS)  ─┘                    (Supabase: auth, arcs, koin, AI, payments)
```

- Halaman publik (landing, blog, arc yang `is_public=true`, katalog produk) — statis di Astro, atau baca langsung dari Supabase client-side (RLS sudah mengizinkan).
- Halaman privat (dashboard, koin, AI chat, checkout) — Astro cuma jadi shell, semua logic manggil API Next.js yang sudah jadi (target #3) sebagai backend, lewat CORS yang di-generalize dari pola `NEXT_PUBLIC_WAITLIST_EXTRA_ORIGINS`.
- **Efek samping penting**: versi ini TIDAK 100% berdiri sendiri di Cloudflare — tetap butuh 1 instance Next.js/VPS yang hidup sebagai backend (baik itu avathur.id sendiri, atau VPS milik klien kalau dia juga beli target #3). Jadi klaim "gratis selamanya" cuma berlaku untuk bagian frontend/hosting-nya, bukan seluruh sistem — perlu jujur soal ini ke calon pembeli.
- **Estimasi**: ~2-4 hari kerja. Sebagian besar effort di generalize CORS + bikin ulang halaman publik di Astro (konten sudah ada, tinggal re-layout) + wiring client-side Supabase untuk baca data publik.

### Opsi B — "Full Cloudflare, tanpa dependensi Next.js/VPS sama sekali"

Ganti pipa privileged (topup koin, webhook payment) jadi Worker kecil ala `donasi-worker`, tapi database tetap Supabase (Worker bisa connect ke Supabase via REST/service-role key, tidak wajib ganti ke D1/KV — cukup pindah compute-nya saja). AI chat: Worker terpisah khusus proxy ke AI provider dengan bundle minimal.

- **Estimasi**: 2-4 minggu — ini bukan "port", tapi rebuild pipa privileged dari nol di atas Workers, plus testing ulang security (signature verification, rate-limit) di lingkungan baru.
- Baru masuk akal dikerjakan kalau ada permintaan nyata dari klien yang benar-benar menolak dependensi VPS apapun.

## 5. Resiko terbuka

- **Supabase Auth cross-origin dari `*.pages.dev`**: perlu didaftarkan sebagai Redirect URL di dashboard Supabase per klien — bukan blocker, tapi harus didokumentasikan di setup guide (mirip §Supabase Dashboard Setup di `docs/id|en/setup-and-development.md`).
- **AI chat streaming lintas origin** (Astro statis → Next.js API di domain lain): secara teknis jalan (`fetch` + `ReadableStream` tidak peduli origin selama CORS diizinkan), tapi belum ada spike-test nyata dari kombinasi ini di CMS-Bapikir — perlu dicoba sebelum janji ke klien.
- **Rate-limit/abuse**: begitu API Next.js dipanggil dari domain manapun (bukan cuma avathur.id sendiri), API itu jadi lebih "publik". CORS allowlist membantu, tapi keamanan sesungguhnya harus tetap bertumpu pada Supabase RLS + JWT auth (sudah ada), bukan cuma origin check.
- **Belum ada spike-test nyata** untuk salah satu dari kedua opsi — dokumen ini murni riset arsitektur dari kode + preseden WAKI, belum ada kode yang dijalankan/dibangun.

## 6. Rekomendasi urutan kalau nanti digarap

1. Selesaikan & jualan target #3 (Next.js/VPS) dulu — status: **sudah selesai**, ini prasyarat Opsi A.
2. Generalize pola CORS allowlist (`NEXT_PUBLIC_WAITLIST_EXTRA_ORIGINS`) ke semua route API yang perlu dipanggil lintas-origin.
3. Spike-test kecil: 1 halaman Astro statis di CF Pages manggil `/api/ai/chat` milik deployment Next.js yang sudah live, verifikasi streaming + auth Supabase cross-origin beneran jalan.
4. Kalau spike-test lolos → bangun Opsi A penuh (rebuild halaman publik di Astro, reuse avathur.id/VPS klien sebagai backend).
5. Opsi B ditunda sampai ada permintaan nyata yang spesifik butuh nol-dependensi-VPS.
