# Kondisi Saat Ini

## Ringkasan

CMS Bapikir adalah boilerplate Next.js yang dibikin khusus untuk developer Indonesia. Phase 1, 2, 3, dan 4 sudah selesai. Repository ini sekarang sudah mencakup:

- Next.js App Router dengan route groups `(marketing)`, `(dashboard)`, dan `auth`
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase browser client dan server client
- Cookie-based auth dan refresh session
- Login email/password, Google OAuth, dan Magic Link (passwordless)
- Dashboard nyata di `/dashboard` (dilindungi auth)
- Config terpusat di `config/site.ts`
- File migrasi database untuk tabel `profiles`, `subscriptions`, dan `payments`
- Type schema Supabase lokal tersedia di `types/database.ts`
- Akses admin berbasis role lewat tabel `user_roles` dengan bootstrap legacy `ADMIN_EMAILS`
- Integrasi payment transfer manual (kebijakan MALIYA CENTER: tanpa gateway fee-persentase) — upload bukti + admin approve/reject, tanpa webhook
- Katalog billing milik server untuk menjaga nominal plan tetap konsisten
- Self-serve subscription management (cancel/resume di akhir periode)
- Integrasi email Resend dengan template React Email (welcome, invoice)
- Hook client-side auth dan subscription (`use-auth`, `use-subscription`)
- Integrasi AI via Vercel AI SDK (OpenAI + Anthropic, streaming chat + one-shot generation)
- Admin dashboard di `/admin` dengan statistik payment dan ringkasan subscription
- Admin dashboard di `/admin` dengan manajemen user, visibilitas webhook, dan audit trail
- Belum ada workflow CI (tak ada `.github/workflows/` — jalankan `lint`/`typecheck`/`test`/`build` manual sebelum deploy)
- Blog berbasis database di `/blog` (tabel `blog_posts` lewat `lib/data/blog.ts`), estimasi waktu baca, tag, dan tier kategori/akses, plus editor admin (`/admin/blog/tulis`) dengan impor `.md`/`.mdx` dan toggle Tulis/Pratinjau live
- 44 komponen shadcn/ui terpasang (library komponen lengkap)
- Sistem preset desain marketing dengan dua belas preset yang bisa dipilih: `default`, `monochrome`, `newsprint`, `luxury`, `academia`, `saas`, `professional`, `enterprise`, `neo-brutalism`, `bauhaus`, `web3`, dan `terminal`, masing-masing mendukung theme light/dark
- Landing page dengan seksi Hero, Features, Testimonials, Pricing, FAQ, dan CTA
- Header sticky dengan nav desktop, drawer Sheet mobile, tombol auth Avatar + DropdownMenu
- Dashboard dengan subscription card, tabel pembayaran, navigasi breadcrumb
- Admin dashboard dengan grafik revenue recharts, tabel pembayaran sortable, pagination
- Halaman settings di `/dashboard/settings` dengan tampilan profil dan ganti password
- Halaman billing di `/dashboard/billing` dengan tampilan paket dan alur pembayaran transfer manual
- Rate limiting persisten berbasis Supabase untuk route contact, waitlist, payment, dan AI dengan fallback memori serta header respons standar
- Upload avatar via Supabase Storage dengan signed upload URL dan cleanup saat avatar diganti/dihapus
- Ledger event webhook durable (`webhook_events`) — saat ini tidak dipakai sejak approval admin transfer manual menggantikan webhook Midtrans/Doku
- Endpoint health di `/api/health` untuk cek konfigurasi dan database
- Notifikasi toast Sonner terhubung secara global
- Fondasi SEO: metadata per-halaman, canonical URL, Open Graph/Twitter card, JSON-LD, sitemap, dan robots
- Halaman marketing funnel: `/about`, `/checkout`, `/contact`, `/open`, `/order/[id]`, `/privacy`, `/roadmap`, `/status`, `/terms` — plus `/blog`, `/blog/[slug]`, `/blog/kategori/[slug]` dengan filter kategori/akses. Belum dibangun meski disebut di docs lama: `/affiliates`, `/changelog`, `/compare`, `/use-cases`, `/waitlist` (halaman berdiri sendiri — fitur waitlist API-nya sendiri nyata)
- Automated test berbasis Vitest + Testing Library yang mencakup route API, alur payment transfer manual, guard AI, helper MDX, hook client, rate limiting, dan form utama

## Baseline Paket Yang Terpasang

| Package | Version |
| --- | --- |
| `next` | `16.1.6` |
| `react` | `19.2.4` |
| `react-dom` | `19.2.4` |
| `typescript` | `5.9.3` |
| `tailwindcss` | `3.4.19` |
| `tailwindcss-animate` | `1.0.7` |
| `@supabase/ssr` | `0.9.0` |
| `@supabase/supabase-js` | `2.99.1` |
| `next-themes` | `0.4.6` |
| `lucide-react` | `0.511.0` |
| `resend` | `6.9.3` |
| `@react-email/components` | `1.0.9` |
| `next-mdx-remote` | `5.x` |
| `gray-matter` | `4.x` |
| `@tailwindcss/typography` | `0.5.x` |
| `ai` | `6.x` |
| `@ai-sdk/openai` | `3.x` |
| `@ai-sdk/anthropic` | `3.x` |
| `@ai-sdk/react` | `3.x` |

## Yang Sudah Berfungsi Saat Ini

- Aplikasi bisa dijalankan dengan `npm run dev`
- Linting lolos dengan `npm run lint`
- Landing page di `/` dengan branding CMS Bapikir, `Header`, dan `Footer`
- Route marketing sekarang mendukung switcher preset dengan dua belas sistem visual yang tetap memakai satu route tree yang sama, sambil tetap mengikuti switcher theme light/dark/system bersama
- Alur auth: sign up, sign in (password + Google OAuth + Magic Link), forgot password, update password
- Dashboard di `/dashboard` — dilindungi auth, menampilkan info user yang sedang login
- Refresh session dan gating auth berjalan melalui `proxy.ts`
- Komponen dasar shadcn/ui tersedia di `components/ui`
- `config/site.ts` dan `config/navigation.ts` untuk metadata dan navigasi terpusat
- `POST /api/payments` — membuat record payment `PENDING` transfer manual dan mengembalikan instruksi rekening (atau reuse order pending yang sudah ada)
- `POST /api/payments/bukti-upload-url` / `POST /api/payments/konfirmasi` — alur upload bukti transfer
- `GET /api/payments/admin` / `PATCH /api/payments/admin/[id]` — antrean review admin; approve mengaktifkan subscription
- `POST /api/profile` — memperbarui data profil user yang sedang login dan membersihkan object avatar lama
- `POST /api/profile/avatar` — membuat signed upload URL untuk avatar Supabase Storage
- `POST /api/subscription` — menangani aksi cancel/resume subscription
- `POST /api/admin/users/role` — admin bisa promote/demote role user
- `GET /api/health` — mengembalikan status konfigurasi dan database
- `sendEmail()` di `lib/email.ts` — mengirim template React Email via Resend
- `emails/welcome.tsx` dan `emails/invoice.tsx` — template email siap pakai dalam Bahasa Indonesia
- `useAuth()` di `hooks/use-auth.ts` — state session user di client-side dengan `onAuthStateChange`
- `useSubscription()` di `hooks/use-subscription.ts` — state subscription di client-side dengan helper `isPro` / `isActive`
- `useAIChat()` di `hooks/use-ai-chat.ts` — hook AI chat client-side yang membungkus Vercel AI SDK `useChat`
- `POST /api/ai/chat` — streaming chat endpoint (dilindungi auth, tracked usage)
- `POST /api/ai/generate` — endpoint generasi teks one-shot (dilindungi auth, tracked usage)
- Form publik dan route mutation AI/payment memakai rate limiting persisten (dengan fallback memori) dan mengembalikan header `X-RateLimit-*`
- `getModel()` di `lib/ai/provider.ts` — factory model provider-agnostic (OpenAI/Anthropic)
- `authorizeAIRequest()` di `lib/ai/middleware.ts` — auth + enforcement limit usage untuk AI route
- `trackUsage()` / `checkUsageLimit()` di `lib/ai/usage.ts` — tracking token bulanan per-user
- Admin dashboard di `/admin` — statistik payment, jumlah subscription, manajemen role user, visibilitas webhook, audit trail, tabel payment terbaru (dibatasi role `admin`)
- Daftar blog di `/blog` — menampilkan post yang dipublikasikan dari `blog_posts` dengan tanggal, estimasi baca, dan tag
- Detail post blog di `/blog/[slug]` — merender kolom `content` (MDX) lewat `next-mdx-remote/rsc` dengan prose style Tailwind Typography
- `getAllPublishedPosts()`, `getPublishedPostBySlug()`, `getAllPostsAdmin()`, `createPostAdmin()`, `updatePostAdmin()`, `deletePostAdmin()` di `lib/data/blog.ts` — data layer blog berbasis DB (baca publik pakai client anon + RLS `published = true`; baca/tulis admin pakai client service-role)
- Editor admin blog di `/admin/blog/tulis` — impor `.md`/`.mdx` (diparse server-side di `/api/admin/blog/parse-md`, kategori divalidasi terhadap `config/blog-categories.ts`) dan tab Tulis/Pratinjau (pratinjau dikompilasi server-side di `/api/admin/blog/preview`, dihidrasi di klien — render-nya identik dengan halaman publik)
- `content/blog/` jadi folder singgah draf yang siap diimpor (lihat `content/blog/README.md`); `content/blog.archive/` menyimpan 39 artikel pra-migrasi sebagai arsip historis, tak dibaca kode manapun
- Halaman settings di `/dashboard/settings` — profil dan ganti password
- Halaman billing di `/dashboard/billing` — tampilan paket dan alur pembayaran transfer manual
- Halaman marketing funnel (about, checkout, contact, open, order, privacy, roadmap, status, terms). Belum dibangun meski disebut di docs lama: affiliates, changelog, compare, use-cases, waitlist (halaman berdiri sendiri)
- `npm run typecheck` — verifikasi TypeScript tanpa emit
- `npm run test` — menjalankan 95 automated test untuk fitur server-side dan client-side

## Migrasi Database Siap Diaplikasikan

17 file migrasi tersedia di `supabase/migrations/` (tabel ini mencatat sepuluh yang pertama; `supabase/migrations/` sendiri jadi sumber kebenaran ke depan — jangan salin ulang daftarnya di sini, pasti basi lagi). Tujuh yang ditambahkan setelahnya (18260710–20260718) bikin: `arcs`/`arc_entries`/`children`/`child_milestones` (timeline "Arc Kehidupan" per-user, sudah RLS, belum ada UI publik — lihat `app/(marketing)/arc/page.tsx`), `products`/`orders`, `koin_produk`, `beli_produk`, kolom `wa` di `waitlist`, `blog_posts` (lihat bagian blog di atas), dan `media_library`.

| File | Membuat |
| --- | --- |
| `20260316000001_create_profiles.sql` | Tabel `profiles` + trigger auto-create saat signup |
| `20260316000002_create_subscriptions.sql` | Tabel `subscriptions` + trigger auto-create tier FREE saat signup |
| `20260316000003_create_payments.sql` | Tabel `payments` + enum (plan, status, provider) |
| `20260316000004_create_waitlist.sql` | Tabel `waitlist` |
| `20260316000005_create_ai_usage.sql` | Tabel `ai_usage` + RLS + index untuk query usage bulanan |
| `20260317000006_add_admin_roles_and_billing_hardening.sql` | Tabel `user_roles`, metadata plan payment, index/RPC reporting admin |
| `20260317000007_add_avatar_storage.sql` | `profiles.avatar_path` plus bucket/policy Supabase Storage untuk avatar |
| `20260317000008_add_webhook_events.sql` | Tabel `webhook_events` + RPC claim idempotent yang retry-safe |
| `20260317000009_add_persistent_rate_limits.sql` | Tabel `rate_limit_buckets` + RPC rate limiting persisten |
| `20260317000010_add_audit_logs.sql` | Tabel `audit_logs` untuk observability aksi admin/profil/payment |

Semua tabel sudah dilengkapi RLS. Repository ini juga sudah menyertakan `types/database.ts`, tapi kamu tetap sebaiknya regenerate type tersebut setelah migrasi diterapkan ke project Supabase live.

## Yang Masih Belum Ada

- Opsi email provider Sumopod / Mailketing
- Fitur roadmap seperti team / multi-tenant, API key management, notification system, referral, WhatsApp OTP, dan mobile starter
- Fondasi team / multi-tenant

## Langkah Berikutnya

1. Aplikasikan sepuluh migrasi SQL ke project Supabase kamu
2. Tambahkan `SUPABASE_SERVICE_ROLE_KEY` ke `.env.local` supaya avatar, webhook, persistent rate limit, audit log, profile update, order lookup, dan admin reporting bisa berjalan
3. Regenerate `types/database.ts` kalau schema live kamu berbeda
4. Aktifkan Google OAuth di Supabase dashboard (Authentication > Providers)
5. Gunakan `ADMIN_EMAILS` hanya untuk bootstrap awal, lalu kelola akses admin lewat tabel `user_roles`
