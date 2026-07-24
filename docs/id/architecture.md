# Arsitektur

## Struktur Tingkat Atas

| Path | Tujuan |
| --- | --- |
| `app/` | Route, layout, route handler, dan global style App Router |
| `app/marketing.css` | Token, tipografi, dan styling preset desain khusus marketing |
| `app/(marketing)/` | Halaman publik (landing page) |
| `app/(dashboard)/` | Halaman dashboard yang dilindungi auth |
| `app/auth/` | Halaman alur autentikasi dan OTP route handler |
| `components/` | Komponen UI dan auth yang reusable |
| `components/marketing/` | Provider preset dan switcher preset khusus marketing |
| `components/layout/` | Komponen `Header` dan `Footer` yang dipakai bersama |
| `components/ui/` | Primitive shadcn/ui |
| `config/` | Config site, definisi navigasi, dan registry preset marketing |
| `lib/` | Utility bersama, factory Supabase client, dan helper payment |
| `lib/payments/` | Client payment gateway dan helper functions |
| `lib/ai/` | Factory provider AI, tracking usage, dan middleware |
| `lib/rate-limit.ts` | Helper rate limiting persisten berbasis Supabase dengan fallback memori dan header respons standar |
| `app/api/` | API route handler (payment, webhook) |
| `lib/data/` | Helper akses data server-side untuk billing, profile, role, webhook event, dan audit log |
| `lib/storage/` | Konfigurasi upload avatar dan helper signed URL/storage cleanup |
| `emails/` | Template React Email |
| `hooks/` | Hook React client-side untuk state auth dan subscription |
| `supabase/migrations/` | File migrasi SQL untuk schema database |
| `.github/workflows/` | *(belum ada — nol CI, jalankan `lint`/`typecheck`/`test`/`build` manual)* |
| `docs/` | Dokumentasi project (Bahasa Indonesia dan Inggris) |
| `proxy.ts` | Refresh session dan gating auth saat request masuk |
| `tailwind.config.ts` | Konfigurasi Tailwind dan plugin |
| `components.json` | Konfigurasi shadcn/ui |

## Model Rendering

- Server component adalah default untuk file route di `app/`
- Client component digunakan untuk form auth interaktif, theme switcher, dan switcher desain marketing
- Akses Supabase di server menggunakan `lib/supabase/server.ts`
- Akses Supabase di browser menggunakan `lib/supabase/client.ts`
- `Suspense` digunakan di sekitar UI async yang sadar auth (`AuthButton`, `DashboardContent`)

## Peta Route

### Route Marketing (publik, group `(marketing)`)

| Route | File | Tujuan |
| --- | --- | --- |
| `/` | `app/(marketing)/page.tsx` | Halaman landing CMS Bapikir |
| `/about` | `app/(marketing)/about/page.tsx` | Tentang CMS Bapikir |
| `/blog` | `app/(marketing)/blog/page.tsx` | Daftar blog berbasis DB dengan filter kategori/akses (`blog_posts` lewat `lib/data/blog.ts`) |
| `/blog/[slug]` | `app/(marketing)/blog/[slug]/page.tsx` | Detail post blog — render kolom `content` sebagai MDX lewat `next-mdx-remote/rsc`; nge-gate post tier `member`/`exclusive`/`premium` |
| `/blog/kategori/[slug]` | `app/(marketing)/blog/kategori/[slug]/page.tsx` | Artikel blog terfilter per kategori |
| `/checkout` | `app/(marketing)/checkout/page.tsx` | Alur checkout / pembelian |
| `/contact` | `app/(marketing)/contact/page.tsx` | Formulir kontak |
| `/open` | `app/(marketing)/open/page.tsx` | Metrik startup terbuka (data demo template) |
| `/order/[id]` | `app/(marketing)/order/[id]/page.tsx` | Konfirmasi pesanan / upload bukti transfer manual |
| `/privacy` | `app/(marketing)/privacy/page.tsx` | Kebijakan privasi |
| `/roadmap` | `app/(marketing)/roadmap/page.tsx` | Roadmap produk publik |
| `/status` | `app/(marketing)/status/page.tsx` | Status layanan |
| `/terms` | `app/(marketing)/terms/page.tsx` | Syarat layanan |

Belum dibangun, meski disebut di dokumen perencanaan lama: `/affiliates`, `/changelog`,
`/compare`, `/use-cases`, `/waitlist` (sebagai halaman berdiri sendiri — fitur waitlist-nya
sendiri nyata, lihat `/api/waitlist` di bawah, cuma belum ada halaman marketing khususnya).
`/payment/callback` juga sudah dihapus bareng pencabutan gateway Midtrans/Doku — gak ada lagi
provider pembayaran eksternal yang perlu redirect balik ke situ.

### Route Dashboard (perlu autentikasi, group `(dashboard)`)

| Route | File | Tujuan |
| --- | --- | --- |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Dashboard utama pengguna |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.tsx` | Profil + ganti password |
| `/dashboard/billing` | `app/(dashboard)/dashboard/billing/page.tsx` | Tampilan paket + alur pembayaran |
| `/dashboard/components` | `app/(dashboard)/dashboard/components/page.tsx` | Showcase komponen untuk UI dashboard dan admin |
| `/admin` | `app/(dashboard)/admin/page.tsx` | Dashboard admin (dibatasi oleh `user_roles`) |

### Route Auth

| Route | File / Tipe | Tujuan |
| --- | --- | --- |
| `/auth/login` | Page | Layar masuk |
| `/auth/sign-up` | Page | Layar registrasi |
| `/auth/sign-up-success` | Page | Konfirmasi pasca-registrasi |
| `/auth/verify-email` | Page | Instruksi verifikasi email |
| `/auth/forgot-password` | Page | Permintaan reset password |
| `/auth/update-password` | Page | Formulir password baru |
| `/auth/error` | Page | Tampilan error auth |
| `/auth/confirm` | Route handler | Callback OTP/OAuth |

### Route API

| Route | Method | Tujuan |
| --- | --- | --- |
| `/api/payments` | POST | Membuat record payment `PENDING` transfer manual, mengembalikan instruksi rekening (atau reuse order pending yang sudah ada) |
| `/api/payments/bukti-upload-url` | POST | Membuat signed upload URL untuk file bukti transfer |
| `/api/payments/konfirmasi` | POST | Melampirkan bukti transfer yang sudah diupload ke payment pending |
| `/api/payments/admin` | GET | List payment transfer manual yang pending untuk ditinjau admin |
| `/api/payments/admin/[id]` | PATCH | Admin approve (mengaktifkan subscription) atau reject payment |
| `/api/profile` | POST | Memperbarui field profil user yang sedang login |
| `/api/profile/avatar` | POST | Membuat signed upload URL untuk avatar Supabase Storage |
| `/api/subscription` | POST | Menangani aksi cancel/resume subscription |
| `/api/admin/users/role` | POST | Promote/demote role user dari dashboard admin |
| `/api/contact` | POST | Handler pengiriman formulir kontak |
| `/api/waitlist` | POST | Handler pendaftaran waitlist |
| `/api/ai/chat` | POST | Streaming chat dilindungi auth |
| `/api/ai/generate` | POST | One-shot generation dilindungi auth |
| `/api/health` | GET | Health/readiness check untuk konfigurasi dan akses database server-side |

### File App-Level

| File | Tujuan |
| --- | --- |
| `app/error.tsx` | Error boundary root |
| `app/not-found.tsx` | Halaman 404 global |
| `app/robots.ts` | Generasi robots.txt dinamis |
| `app/sitemap.ts` | Generasi sitemap XML dinamis |
| `app/(marketing)/loading.tsx` | State loading skeleton seksi marketing |

## Penjelasan Route Groups

Route group menggunakan tanda kurung di nama folder dan tidak mempengaruhi URL. Fungsinya hanya untuk menerapkan layout yang berbeda pada bagian aplikasi yang berbeda.

- `app/(marketing)/` — menggunakan `MarketingLayout` (full-width, `Header` + `Footer`)
- `app/(dashboard)/` — menggunakan `DashboardLayout` (container max-width, `Header` dengan aksi auth)
- `app/auth/` — tidak ada layout bersama; setiap halaman auth punya struktur centering dan card sendiri

## Layout

### Root Layout

`app/layout.tsx` bertugas:

- Memuat kumpulan font bersama yang dipakai theme default dan preset marketing
- Mendefinisikan metadata global (`lang="id"`, Open Graph/Twitter default, canonical base URL)
- Menyuntikkan `app/globals.css` dan `app/marketing.css`
- Membungkus app dalam `ThemeProvider` dari `next-themes`
- Membungkus seluruh app dengan `MarketingDesignProvider` supaya preset terpilih bisa ikut mewarnai route marketing dan dashboard secara konsisten

### Marketing Layout

`app/(marketing)/layout.tsx`:

- Merender `Header` (nama site + aksi auth + switcher preset marketing)
- Merender `Footer` (copyright + switcher preset marketing)
- Memakai shell preset global dari root layout sambil mempertahankan struktur header/footer khusus marketing

### Dashboard Layout

`app/(dashboard)/layout.tsx`:

- Struktur `Header` yang sama dengan marketing
- Membungkus `children` dalam container `max-w-5xl` terpusat dengan padding

## Sistem Styling

- Utility class Tailwind CSS
- CSS custom property di `app/globals.css` dan `app/marketing.css`
- shadcn/ui dengan style `new-york`, warna dasar `neutral`
- `tailwindcss-animate` untuk helper animasi
- Theme switching menggunakan strategi `class` melalui `next-themes`
- Preset marketing diterapkan lewat shell `data-design` dan atribut `body[data-marketing-design]`, lalu preset aktif melapisi theme light/dark yang sedang resolved alih-alih menggantikannya
- Path alias: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/config`

## Layer Komponen

### Komponen Layout

| File | Tujuan |
| --- | --- |
| `components/layout/header.tsx` | Header site: logo, `AuthButton`, `ThemeSwitcher` global, dan `DesignSwitcher` khusus marketing |
| `components/layout/footer.tsx` | Footer marketing: copyright dan `DesignSwitcher` |
| `components/layout/desktop-nav.tsx` | Link navigasi bar desktop |
| `components/layout/current-year.tsx` | Tahun copyright dinamis (komponen klien) |

### Komponen App-Level

| File | Tujuan |
| --- | --- |
| `components/auth-button.tsx` | Aksi header yang sadar auth (server component) |
| `components/theme-switcher.tsx` | Switcher mode light/dark/system |
| `components/marketing/design-provider.tsx` | State preset app-wide, persistensi, sinkronisasi theme yang sedang resolved, dan sinkronisasi atribut `body`/shell |
| `components/marketing/design-switcher.tsx` | Dropdown switcher untuk dua belas preset marketing yang didukung |

### Komponen Auth

| File | Tujuan |
| --- | --- |
| `components/login-form.tsx` | Form login: tab password, tab Magic Link, tombol Google OAuth |
| `components/sign-up-form.tsx` | Form registrasi: tombol Google OAuth + email/password |
| `components/forgot-password-form.tsx` | Form request reset password |
| `components/update-password-form.tsx` | Form update password |
| `components/logout-button.tsx` | Tombol sign out |
| `components/auth/supabase-env-notice.tsx` | Banner peringatan saat env var Supabase tidak ada |
| `components/config/feature-notice.tsx` | Notice bersama untuk fitur yang dimatikan atau belum lengkap konfigurasinya |
| `components/contact-form.tsx` | Formulir kontak dengan field dan penanganan pengiriman |

### Seksi Landing Page

| File | Tujuan |
| --- | --- |
| `components/sections/hero.tsx` | Seksi hero |
| `components/sections/features.tsx` | Seksi fitur |
| `components/sections/pricing.tsx` | Seksi harga |
| `components/sections/testimonials.tsx` | Seksi testimoni |
| `components/sections/faq.tsx` | Seksi FAQ |
| `components/sections/cta.tsx` | Seksi call-to-action |
| `components/sections/ai-optimized.tsx` | Seksi fitur AI-Optimized |
| `components/sections/pain-points.tsx` | Seksi pain point |
| `components/sections/tech-stack.tsx` | Seksi showcase tech stack |
| `components/sections/timeline.tsx` | Seksi timeline / roadmap produk |

### Komponen Dashboard

| File | Tujuan |
| --- | --- |
| `components/dashboard/subscription-card.tsx` | Menampilkan paket dan status langganan saat ini |
| `components/dashboard/payments-table.tsx` | Tabel pembayaran sebelumnya |
| `components/dashboard/admin-revenue-chart.tsx` | Grafik revenue untuk admin dashboard |
| `components/dashboard/payment-button.tsx` | Memulai sesi checkout transfer manual, redirect ke `/order/[id]` |
| `components/dashboard/manual-payment-panel.tsx` | Instruksi rekening + upload bukti transfer di halaman order |
| `components/admin/manual-payment-table.tsx` | Antrean admin untuk approve/reject payment transfer manual yang pending |

### Komponen Halaman Docs

| File | Tujuan |
| --- | --- |
| `components/docs/component-demo.tsx` | Menampilkan preview komponen shadcn/ui secara langsung |
| `components/docs/tab-controls.tsx` | Tab controls untuk halaman docs komponen |
| `components/docs/tab-data.tsx` | Tab tampilan data |
| `components/docs/tab-forms.tsx` | Tab komponen form |
| `components/docs/tab-foundations.tsx` | Tab primitif fondasi |
| `components/docs/tab-navigation.tsx` | Tab komponen navigasi |
| `components/docs/tab-overlays.tsx` | Tab komponen overlay |

### Primitive shadcn/ui

Yang sudah terpasang (44 total): `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `label`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `template-banner`, `textarea`, `toggle`, `toggle-group`, `tooltip`

## Layer Hooks

| File | Tujuan |
| --- | --- |
| `hooks/use-auth.ts` | Subscribe ke `onAuthStateChange`; mengembalikan `{ user, loading }` |
| `hooks/use-subscription.ts` | Mengambil baris subscription untuk user saat ini; mengembalikan `{ subscription, loading, isPro, isActive }` |
| `hooks/use-ai-chat.ts` | Hook AI chat client-side yang membungkus `useChat` dengan `DefaultChatTransport` |

## Layer Payment

Tidak ada client gateway pihak ketiga — logika payment/bukti/approval admin transfer manual ada langsung di `lib/data/payments.ts` (memakai ulang `lib/storage/bukti.ts` untuk signed URL bukti transfer dan `lib/data/subscriptions.ts#activateSubscriptionForPayment` saat disetujui).

## Layer Email

| File | Tujuan |
| --- | --- |
| `lib/email.ts` | `sendEmail()` — merender template React Email ke HTML, mengirim via Resend |
| `emails/welcome.tsx` | Template email onboarding dalam Bahasa Indonesia |
| `emails/invoice.tsx` | Email konfirmasi pembayaran dengan jumlah Rupiah |

## Layer AI

| File | Tujuan |
| --- | --- |
| `lib/ai/provider.ts` | `getModel()` — factory model provider-agnostic (OpenAI/Anthropic) via Vercel AI SDK |
| `lib/ai/usage.ts` | `trackUsage()`, `getMonthlyUsage()`, `checkUsageLimit()` — tracking token bulanan per-user dengan limit per plan |
| `lib/ai/middleware.ts` | `authorizeAIRequest()` — auth + pengecekan config provider + gating usage untuk AI route |

## Layer Config

| File | Tujuan |
| --- | --- |
| `config/site.ts` | `siteConfig` — nama site, deskripsi, base URL |
| `config/navigation.ts` | Array link `marketingNav` dan `dashboardNav` |

## Schema Database

Migrasi ada di `supabase/migrations/`. Tabel inti aplikasi, observability, dan kontrol akses sudah didefinisikan:

| Tabel | Kolom Penting | Catatan |
| --- | --- | --- |
| `profiles` | `id` (FK → `auth.users`), `full_name`, `avatar_url` | Auto-dibuat saat user signup via trigger |
| `subscriptions` | `user_id`, `plan` (enum), `status` (enum) | Mulai sebagai FREE; auto-dibuat saat signup via trigger |
| `payments` | `user_id`, `amount` (IDR), `plan`, `provider` (`MANUAL`; `MIDTRANS`/`DOKU` tetap ada di enum untuk baris historis), `external_id`, `bukti_path`, `bank`, `nama_pengirim`, `tanggal_transfer` | Transfer manual saja — tanpa gateway fee-persentase (kebijakan MALIYA CENTER) |
| `ai_usage` | `user_id`, `provider`, `model`, `prompt_tokens`, `completion_tokens`, `created_at` | RLS + index di (user_id, created_at) untuk query usage bulanan |
| `user_roles` | `user_id`, `role` (`member`/`admin`) | Source of truth akses admin |
| `webhook_events` | `provider`, `event_key`, `external_id`, `status`, `payload` | Ledger webhook durable; saat ini tidak dipakai sejak webhook Midtrans/Doku dihapus dan diganti approval admin transfer manual — dibiarkan untuk provider lain di masa depan yang butuh ini |
| `rate_limit_buckets` | `namespace`, `subject_key`, `count`, `reset_at` | Rate limiting persisten lintas restart dan multi-instance |
| `audit_logs` | `type`, `actor_user_id`, `actor_email`, `description`, `metadata` | Audit trail operasional untuk aksi profil, payment, dan admin |

Semua tabel sudah mengaktifkan Row Level Security dengan policy read berbasis user.

## Konfigurasi Penting

### Next.js

`next.config.ts` mengaktifkan `cacheComponents: true`.

### TypeScript

`tsconfig.json` mengaktifkan `strict: true`, path alias `@/*`, bundler module resolution.

### ESLint

`eslint.config.mjs` extends `next/core-web-vitals` dan `next/typescript`, mengabaikan `.next/**`.

## Gaps Arsitektur Saat Ini

- TypeScript types dari schema Supabase belum di-generate (butuh project yang sudah terhubung dengan migrasi diaplikasikan)
- Belum ada domain/service layer (query langsung ada di page component untuk sekarang)
- Fondasi team / multi-tenant masih belum tersedia
