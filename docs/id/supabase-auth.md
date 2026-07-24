# Supabase Dan Auth

## Ringkasan

CMS Bapikir menggunakan Supabase untuk autentikasi, manajemen session, dan database. Sistem auth mendukung tiga metode login:

- **Email/password** — alur kredensial standar
- **Google OAuth** — login satu klik via Google
- **Magic Link** — login tanpa password, berbasis email

Ketiganya berbagi mekanisme session yang sama: cookie-based auth melalui `@supabase/ssr`, tersedia di seluruh App Router baik di server maupun client.

## Environment Variable

```env
NEXT_PUBLIC_SUPABASE_URL=url-project-kamu
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=publishable-atau-anon-key-kamu
```

## Factory Supabase Client

### Browser Client

File: `lib/supabase/client.ts`

Dipakai oleh semua form auth interaktif (login, sign up, reset password). Membuat browser client dengan `createBrowserClient`.

### Server Client

File: `lib/supabase/server.ts`

Dipakai oleh server component dan route handler. Membuat client berbasis request via `createServerClient`, baca/tulis cookie melalui `next/headers`. Tidak pernah dipakai ulang secara global.

### Proxy Session Updater

File: `lib/supabase/proxy.ts`

Berjalan saat request masuk melalui `proxy.ts`:

1. Membuat Supabase server client yang terikat ke cookie request
2. Memanggil `supabase.auth.getClaims()` untuk refresh session
3. Redirect ke `/auth/login` jika request ke route yang dilindungi dan tidak ada session
4. Mengembalikan response dengan auth cookie yang sudah disinkronkan

## Konfigurasi Supabase Dashboard Yang Diperlukan

### Redirect URL

Tambahkan di **Authentication > URL Configuration**:

**Development lokal:**
```
http://localhost:3000/auth/confirm
http://localhost:3000/auth/update-password
```

**Production:**
```
https://domain-kamu.com/auth/confirm
https://domain-kamu.com/auth/update-password
```

Kenapa `/auth/confirm` jadi callback utama:
- Link verifikasi email masuk ke sini
- Email Magic Link masuk ke sini
- Redirect OAuth (Google) masuk ke sini
- Reset password tetap pakai `/auth/update-password` secara langsung

### Setup Google OAuth

1. Aktifkan provider Google di **Authentication > Providers > Google**
2. Masukkan Google Client ID dan Secret (dari [Google Cloud Console](https://console.cloud.google.com))
3. Salin callback URL Supabase yang ditampilkan dan tambahkan ke **Authorized redirect URIs** di Google OAuth app kamu

## Alur Auth

### Login

Komponen: `components/login-form.tsx`

Form login punya tiga opsi dalam satu card:

**Google OAuth:**
- Memanggil `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Redirect ke `${origin}/auth/confirm` setelah kembali

**Tab Password:**
- Mengumpulkan email + password
- Memanggil `supabase.auth.signInWithPassword()`
- Redirect ke `/dashboard` setelah berhasil

**Tab Magic Link:**
- Mengumpulkan email saja
- Memanggil `supabase.auth.signInWithOtp()` dengan `emailRedirectTo: ${origin}/auth/confirm`
- Menampilkan konfirmasi inline bahwa link sudah dikirim

### Daftar (Sign Up)

Komponen: `components/sign-up-form.tsx`

Dua opsi:

**Google OAuth:**
- Alur sama seperti login via Google; Supabase menangani akun baru vs. yang sudah ada

**Email/password:**
- Mengumpulkan email, password, dan ulangi password
- Cek kecocokan password di client sebelum memanggil `supabase.auth.signUp()`
- `emailRedirectTo` mengarah ke `/auth/confirm`
- Redirect ke `/auth/sign-up-success` setelah submit

### Lupa Password

Komponen: `components/forgot-password-form.tsx`

- Memanggil `supabase.auth.resetPasswordForEmail()`
- `redirectTo` diset ke `${origin}/auth/update-password`
- Menampilkan status sukses inline setelah email terkirim

### Update Password

Komponen: `components/update-password-form.tsx`

- Mengumpulkan password baru
- Memanggil `supabase.auth.updateUser({ password })`
- Redirect ke `/dashboard` setelah berhasil

### Logout

Komponen: `components/logout-button.tsx`

- Memanggil `supabase.auth.signOut()`
- Mengembalikan app ke state tidak terautentikasi

### Status Auth di Header

Komponen: `components/auth-button.tsx`

- Server component
- Memanggil `supabase.auth.getClaims()`
- Menampilkan email user + tombol logout saat terautentikasi
- Menampilkan tombol sign-in dan sign-up saat tidak terautentikasi

## Confirm Route (Callback OTP + OAuth)

File: `app/auth/confirm/route.ts`

Semua verifikasi berbasis email (Magic Link, konfirmasi email, reset password) dan redirect OAuth masuk ke route ini:

1. Membaca `token_hash`, `type`, dan `next` opsional dari query string
2. Memanggil `supabase.auth.verifyOtp()`
3. Redirect ke `next` (default `/`) saat berhasil
4. Redirect ke `/auth/error` saat gagal

## Dashboard — Halaman Dilindungi Auth

File: `app/(dashboard)/dashboard/page.tsx`

- Server component dengan `DashboardContent` dibungkus `Suspense`
- Memanggil `supabase.auth.getClaims()`
- Redirect ke `/auth/login` jika claims tidak ada
- Sekarang menampilkan email user yang login; ganti dengan data aplikasi nyata

## Schema Database (Migrasi)

Tiga tabel didefinisikan di `supabase/migrations/`. Aplikasikan sebelum membangun fitur yang bergantung pada data.

### profiles

```sql
-- auto-dibuat saat user signup (via trigger)
id uuid references auth.users
full_name text
avatar_url text
```

### subscriptions

```sql
-- auto-dibuat sebagai FREE saat user signup (via trigger)
user_id uuid references auth.users
plan enum('FREE', 'BASIC', 'PRO', 'ULTIMATE')
status enum('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID')
current_period_start / current_period_end timestamptz
```

### payments

```sql
user_id uuid references auth.users
subscription_id uuid references subscriptions
amount bigint  -- dalam Rupiah
provider enum('MIDTRANS', 'DOKU', 'MANUAL')  -- MANUAL satu-satunya yang dipakai sekarang; MIDTRANS/DOKU dibiarkan untuk baris historis
status enum('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'EXPIRED')
external_id text  -- order_id
payment_type text  -- qris, bank_transfer, gopay, dll
bukti_path text  -- path file bukti transfer di bucket privat 'bukti-transfer'
bank text
nama_pengirim text
tanggal_transfer date
```

Ketiga tabel sudah mengaktifkan RLS dengan policy `SELECT` berbasis user.

## Mengaplikasikan Migrasi

```bash
# Opsi 1: Supabase CLI
npx supabase db push

# Opsi 2: Paste SQL manual di SQL editor Supabase dashboard
# Jalankan setiap file berurutan: 000001 → 000002 → 000003

# Setelah diaplikasikan, generate TypeScript types:
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

## Keterbatasan Saat Ini

- TypeScript types belum di-generate (butuh project yang sudah terhubung)
- Belum ada workflow service-role atau admin-only
- Belum ada server action untuk mutasi (semua panggilan auth masih di client)
