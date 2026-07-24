# Setup Dan Pengembangan

## Prasyarat

Project ini diinisialisasi dan diverifikasi dengan:

- Node.js `v24.4.1`
- npm `11.4.2`

Versi Node.js modern apapun yang kompatibel dengan Next.js 16 seharusnya bisa dipakai.

## Install Dependency

```bash
npm install
```

## Automated Test

Repository ini sekarang sudah punya test suite berbasis Vitest dengan:

- Unit test dan route handler test di environment Node
- Test hook dan komponen di JSDOM lewat Testing Library
- Playwright smoke test untuk route publik
- Integrasi yang dimock untuk Supabase, AI provider, dan Resend

## Environment Variable

```bash
cp .env.example .env.local
```

Isi dengan nilai-nilai berikut:

```env
NEXT_PUBLIC_SUPABASE_URL=url-project-kamu
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=publishable-atau-anon-key-kamu
SUPABASE_SERVICE_ROLE_KEY=service-role-key-kamu
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_WAITLIST=true
NEXT_PUBLIC_ENABLE_CONTACT=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_ADMIN=true
NEXT_PUBLIC_ENABLE_AI=true

NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT=1234567890
NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME=Nama Kamu
NEXT_PUBLIC_PAYMENT_BANK_NAME=BCA
NEXT_PUBLIC_PAYMENT_QRIS_IMAGE=/qris.jpg
NEXT_PUBLIC_PAYMENT_QRIS_LABEL=Scan untuk bayar

RESEND_API_KEY=api-key-resend-kamu
EMAIL_FROM=CMS Bapikir <noreply@avathur.id>

ADMIN_EMAILS=kamu@example.com,rekan@example.com

# AI (opsional)
AI_DEFAULT_PROVIDER=openai
OPENAI_API_KEY=api-key-openai-kamu
ANTHROPIC_API_KEY=api-key-anthropic-kamu
GOOGLE_GENERATIVE_AI_API_KEY=api-key-google-ai-studio-kamu
```

Catatan:

- `NEXT_PUBLIC_APP_URL` dipakai oleh `config/site.ts` untuk membangun base URL site
- Starter sekarang degrade dengan aman: config yang belum lengkap hanya mematikan fitur terkait, bukan membuat seluruh app crash
- Kalau ada fitur yang memang tidak dipakai di app kamu, set toggle `NEXT_PUBLIC_ENABLE_*` terkait ke `false` supaya UI menandainya sebagai fitur yang sengaja dimatikan
- `npm run env:check` sekarang menampilkan fitur mana yang sudah siap, mana yang masih fallback mode, dan mana yang dimatikan lewat toggle
- `/api/health` sekarang menyertakan ringkasan kesiapan per fitur
- Kalau Supabase vars belum diset, area yang membutuhkan auth tidak akan berfungsi, tapi app tetap bisa dirender
- `SUPABASE_SERVICE_ROLE_KEY` dibutuhkan untuk update profil, lookup order, approve admin payment/koin, dan reporting admin
- Pembayaran hanya lewat transfer manual (kebijakan MALIYA CENTER: tanpa gateway fee-persentase) — `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT`, `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME`, `NEXT_PUBLIC_PAYMENT_BANK_NAME`, `NEXT_PUBLIC_PAYMENT_QRIS_IMAGE`, dan `NEXT_PUBLIC_PAYMENT_QRIS_LABEL` adalah config rekening yang sama dipakai `/toko` dan top-up Koin, sekarang juga menggerakkan checkout subscription
- `EMAIL_FROM` defaultnya `CMS Bapikir <noreply@avathur.id>` kalau tidak diset; sesuaikan dengan domain pengirim yang sudah diverifikasi di Resend
- `ADMIN_EMAILS` sekarang hanya daftar bootstrap; user yang cocok akan di-upsert ke `user_roles` sebagai `admin` saat login pertama
- Variabel AI bersifat opsional; fitur AI nonaktif kalau key belum diset
- `AI_DEFAULT_PROVIDER` defaultnya `openai`; set ke `anthropic` buat Claude atau `google` buat Gemini (Google AI Studio — aistudio.google.com — punya tier API gratis beneran, gak perlu kartu kredit)

## Setup Supabase Dashboard

### 1. Redirect URL

Tambahkan di **Authentication > URL Configuration**:

```
http://localhost:3000/auth/confirm
http://localhost:3000/auth/update-password
```

Untuk production:

```
https://domain-kamu.com/auth/confirm
https://domain-kamu.com/auth/update-password
```

Kenapa `/auth/confirm` jadi callback utama:
- Link verifikasi email masuk ke sini
- Email Magic Link masuk ke sini
- Redirect OAuth (Google) masuk ke sini
- Reset password tetap pakai `/auth/update-password` secara langsung

### 2. Google OAuth

1. Aktifkan provider Google di **Authentication > Providers > Google**
2. Masukkan Google Client ID dan Secret (dari [Google Cloud Console](https://console.cloud.google.com))
3. Salin callback URL Supabase yang ditampilkan dan tambahkan ke **Authorized redirect URIs** di Google OAuth app kamu

### 3. Aplikasikan Migrasi Database

```bash
# Opsi A: Supabase CLI
npx supabase db push

# Opsi B: Paste setiap file secara manual di SQL editor Supabase dashboard (berurutan)
# supabase/migrations/20260316000001_create_profiles.sql
# supabase/migrations/20260316000002_create_subscriptions.sql
# supabase/migrations/20260316000003_create_payments.sql
# supabase/migrations/20260316000004_create_waitlist.sql
# supabase/migrations/20260316000005_create_ai_usage.sql
# supabase/migrations/20260317000006_add_admin_roles_and_billing_hardening.sql
```

## Setup Pembayaran Transfer Manual

Tidak ada payment gateway pihak ketiga — subscription, produk `/toko`, dan top-up Koin semuanya pakai alur transfer manual yang sama (kebijakan MALIYA CENTER: tanpa gateway fee-persentase):

1. Isi `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT`, `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME`, `NEXT_PUBLIC_PAYMENT_BANK_NAME`, dan opsional `NEXT_PUBLIC_PAYMENT_QRIS_IMAGE`/`NEXT_PUBLIC_PAYMENT_QRIS_LABEL`
2. User mulai checkout di `POST /api/payments`, yang membuat record payment `PENDING` dan mengembalikan instruksi rekening kamu
3. User upload bukti transfer (`app/api/payments/bukti-upload-url`, `app/api/payments/konfirmasi`) ke bucket Supabase Storage privat `bukti-transfer`
4. Admin meninjau dan approve/reject di `/admin/payments` (`app/api/payments/admin/[id]/route.ts`), yang mengaktifkan subscription saat disetujui — tanpa webhook

## Setup Resend

1. Buat akun Resend di [resend.com](https://resend.com)
2. Tambahkan dan verifikasi domain pengirim kamu di **Domains**
3. Generate API key di **API Keys**
4. Set `RESEND_API_KEY` dan `EMAIL_FROM` di `.env.local`

Template email ada di `emails/`. Saat ini tersedia dua template:
- `emails/welcome.tsx` — dikirim saat user baru signup
- `emails/invoice.tsx` — dikirim setelah pembayaran berhasil

Panggil `sendEmail()` dari `lib/email.ts` untuk mengirim template React Email apapun.

## Admin Dashboard

Halaman admin di `/admin` menampilkan:
- Total revenue dari payment yang `PAID`
- Jumlah subscription aktif
- Jumlah paket berbayar
- Tabel payment terbaru yang sudah dipaginasi

Akses dikontrol oleh `user_roles`. `ADMIN_EMAILS` hanya dipakai untuk bootstrap role admin pertama.

## Perintah Umum

| Perintah | Tujuan |
| --- | --- |
| `npm run dev` | Jalankan development server lokal |
| `npm run env:check` | Validasi env vars wajib dan opsional |
| `npm run build` | Buat production build |
| `npm run start` | Jalankan production server setelah build |
| `npm run lint` | Jalankan ESLint di seluruh repo |
| `npm run typecheck` | Jalankan pengecekan TypeScript tanpa emit |
| `npm run test` | Jalankan seluruh automated test sekali |
| `npm run test:watch` | Jalankan test suite dalam mode watch |
| `npm run e2e` | Jalankan Playwright smoke tests |

## Alur Development Lokal

1. Salin `.env.example` ke `.env.local`
2. Matikan fitur yang tidak dipakai dengan set `NEXT_PUBLIC_ENABLE_*` terkait ke `false`
3. Isi env var yang dibutuhkan oleh fitur yang tetap aktif
4. Jalankan `npm run env:check` untuk melihat fitur mana yang sudah siap dan mana yang masih fallback mode
5. Jalankan `npm run dev`
6. Buka `http://localhost:3000`
7. Test route yang memang kamu biarkan aktif

## Catatan Deployment

- `app/layout.tsx` membangun `metadataBase` dari `VERCEL_URL` kalau tersedia, kalau tidak fallback ke `http://localhost:3000`
- App menggunakan `next/font/google` untuk Geist — production build butuh akses jaringan saat pertama kali
- Jalankan `npx playwright install chromium` sekali sebelum pertama kali memakai `npm run e2e` di lokal
- Default Vercel langsung bisa dipakai tanpa config tambahan (lihat bagian Vercel di bawah)

## Deploy ke Vercel

Paling gampang — push ke Git, connect repo di Vercel, isi env var yang sama kayak `.env.local` di dashboard Vercel (Settings → Environment Variables), deploy. Next.js 16 App Router didukung penuh tanpa konfigurasi tambahan.

## Deploy ke VPS (nginx + PM2)

Dites & terbukti jalan (avathur.id sendiri pakai jalur ini). Butuh VPS dengan Node.js, nginx, dan PM2 sudah terpasang.

### 1. Build & jalankan lewat PM2

```bash
npm install
npm run build

APP_CWD=/var/www/nama-app APP_PORT=3000 APP_URL=https://domainmu.com \
  pm2 start ecosystem.config.cjs
pm2 save
```

`ecosystem.config.cjs` di root repo ini sengaja gak hardcode path/domain — isi lewat env var pas start (lihat contoh di atas). `APP_NAME` opsional kalau mau nama proses PM2 sendiri (default: `cms-bapikir`).

### 2. Config nginx

Pakai `deploy/avathurid-nginx.conf` sebagai starting point — ganti `avathur.id`/`www.avathur.id` dan path SSL cert sesuai domainmu, sesuaikan juga port proxy (`127.0.0.1:3003`) dengan `APP_PORT` yang dipakai di step 1.

**Baris yang JANGAN dihapus:** `proxy_buffer_size 128k;` di blok `location /`. Tanpa ini, nginx bisa balikin **502 Bad Gateway** ("upstream sent too big header") begitu cookie sesi Supabase membesar — ini bug nyata yang kejadian di avathur.id (23 Jul) dan makan waktu berjam-jam buat didiagnosis. Jangan nyalain `proxy_buffering` (biarkan `off`) — itu bakal ngerusak streaming response di route AI (`app/api/ai/chat`, `app/api/ai/generate`).

### 3. SSL

```bash
certbot --nginx -d domainmu.com -d www.domainmu.com
```

⚠️ **Kalau server pakai panel hosting (aaPanel/cPanel/dsb):** panel-panel ini sering jalanin nginx-nya SENDIRI secara terpisah dari nginx sistem biasa (`/etc/nginx/`) — dua proses nginx beda yang gampang tabrakan rebutan port 80/443. Sebelum sentuh nginx atau certbot langsung, cek dulu `ps aux | grep nginx` — kalau ada lebih dari satu proses master, cari tau nginx mana yang beneran pegang port publik sebelum ubah apa pun. Kalau ada panel, biasanya lebih aman minta SSL lewat menu panelnya, bukan `certbot --nginx` manual.

### Troubleshooting Umum

| Gejala | Kemungkinan Penyebab | Cek |
|:-------|:----------------------|:-----|
| 502 Bad Gateway, kadang muncul kadang enggak | `proxy_buffer_size` kurang gede | `tail -f /var/log/nginx/error.log`, cari "upstream sent too big header" |
| Situs gak bisa diakses padahal server hidup | Cache DNS lokal (browser/OS), bukan server | Coba dari device/jaringan lain; kalau bisa, berarti cache lokal — `ipconfig /flushdns` (Windows) |
| nginx `bind() failed: Address already in use` | Ada 2 nginx rebutan port yang sama | `ps aux | grep nginx`, matikan salah satu, jangan asal `nginx -s reload` |
| PM2 app restart berkali-kali (`↺` tinggi di `pm2 list`) | Error di aplikasi sendiri, bukan infra | `pm2 logs <nama-app> --lines 100` |
