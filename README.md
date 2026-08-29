# CMS Bapikir

Platform dokumentasi arc kehidupan + toko digital, dibangun di atas Next.js 16.
Showroom pertama: [avathur.id](https://avathur.id).

Bagian dari ekosistem **BAPIKIR OS** — bersama **WAKI** (website statis murah untuk UMKM)
dan **MESA** (AI pribadi di laptop).

---

## Lisensi singkat — baca dulu

CMS Bapikir memakai **Business Source License 1.1 (BSL)**. Artinya:

- ✅ **Source-available** — kamu terima seluruh source code, boleh baca, audit, fork, modifikasi.
- ✅ **Gratis** untuk development, testing, evaluasi, dan audit keamanan di lingkungan non-publik.
- 💳 **Butuh license key berbayar** begitu dijalankan untuk website/aplikasi yang diakses publik atau klien.
- 🔓 **Otomatis jadi open source (Apache 2.0)** empat tahun setelah tiap versi didistribusikan.

BSL **bukan** lisensi open source. Detail lengkap: [`LICENSE`](./LICENSE) ·
penjelasan sehari-hari + harga: [`LICENSING.md`](./LICENSING.md) ·
syarat resmi (pembayaran, refund, hukum): `/terms` di situs.

Beli lisensi / pertanyaan: **lisensi@avathur.id**

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- **Styling:** Tailwind CSS 3, shadcn/ui (new-york style)
- **Auth:** Supabase SSR — email/password, Google OAuth, Magic Link
- **Pembayaran:** Transfer manual (MALIYA CENTER) — bebas gateway fee-persentase
- **Email:** Resend + React Email — template welcome & invoice Bahasa Indonesia
- **Blog:** Berbasis database (Supabase `blog_posts`) — kategori/tier akses, reading time, tag
- **AI:** Vercel AI SDK — streaming OpenAI, Anthropic, Google
- **Database:** Supabase PostgreSQL — migrations untuk `profiles`, `subscriptions`, `payments`, dll (semua dengan RLS)

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# isi variabel di .env.local (lihat .env.example untuk daftar lengkap)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

Menjalankan `npm run dev` / build untuk lingkungan non-publik **tidak** memerlukan license key.
Untuk produksi yang diakses publik, isi `BAPIKIR_LICENSE_KEY` di `.env` — tanpa key yang valid,
aplikasi jalan dalam **mode terbatas** (admin, checkout, pembayaran, dan AI dikunci; blog &
halaman marketing tetap jalan). Lihat `LICENSING.md` dan `/admin/license`.

---

## Environment Variables

Lihat `.env.example` untuk daftar lengkap dan komentarnya. Yang wajib:

```env
# Supabase — dari Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# URL aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Rekening transfer manual (MALIYA CENTER) — dipakai /toko, checkout, Koin
NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT=
NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME=
NEXT_PUBLIC_PAYMENT_BANK_NAME=

# Email — dari Resend dashboard
RESEND_API_KEY=
EMAIL_FROM=Nama Bisnis <noreply@domainmu.id>

# Admin bootstrap
ADMIN_EMAILS=

# AI — provider: openai | anthropic | google
AI_DEFAULT_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=

# Lisensi — wajib untuk produksi publik (lihat LICENSING.md). Tanpa key valid,
# aplikasi jalan dalam mode terbatas (admin/checkout/pembayaran/AI dikunci).
BAPIKIR_LICENSE_KEY=
```

---

## Commands

| Command | Fungsi |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Jalankan dev server |
| `npm run lint` | Jalankan ESLint |
| `npm run typecheck` | Jalankan TypeScript tanpa emit |
| `npm test` | Jalankan unit + DOM tests |
| `npm run build` | Build production |
| `npm run start` | Jalankan production server |

---

## Halaman

### Publik
| Route | Halaman |
| --- | --- |
| `/` | Landing page |
| `/about` | Tentang |
| `/blog` · `/blog/[slug]` | Blog & artikel detail |
| `/tulis` | AI Scribe (writing assistant) |
| `/contact` | Kontak |
| `/checkout` | Checkout |
| `/privacy` · `/terms` | Kebijakan privasi & syarat |

### Dashboard (auth-gated)
| Route | Halaman |
| --- | --- |
| `/dashboard` · `/dashboard/settings` · `/dashboard/billing` | Dashboard user |
| `/admin` | Admin dashboard |

### Auth
| Route | Halaman |
| --- | --- |
| `/auth/login` · `/auth/sign-up` · `/auth/verify-email` · `/auth/forgot-password` | Alur autentikasi |

---

## Struktur Folder

```
cms-bapikir/
├── app/                    # Next.js App Router
├── components/             # UI components
├── config/                 # Site config & navigation
├── content/blog/           # MDX blog posts
├── lib/                    # Utilities (supabase, AI, payments, license)
├── hooks/                  # React hooks
├── emails/                 # Email templates (React Email)
├── supabase/migrations/    # SQL migrations
├── docs/                   # Documentation
└── types/                  # TypeScript type definitions
```

---

## AI Coding Tools

Repo menyertakan `CLAUDE.md` dan `AGENTS.md` untuk memandu agent coding
(Claude Code, dan tool lain yang membaca `AGENTS.md`).

---

## License

Business Source License 1.1 — source-available, **belum** open source, otomatis menjadi
Apache 2.0 empat tahun setelah tiap versi dirilis. Produksi publik memerlukan license key.

Lihat [`LICENSE`](./LICENSE) dan [`LICENSING.md`](./LICENSING.md). Syarat resmi di `/terms`.
