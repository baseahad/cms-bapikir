# CMS Bapikir

Platform dokumentasi arc kehidupan + toko digital. Showroom pertama: avathur.id.

> **AI-Optimized:** Dikonfigurasi untuk Claude Code (`CLAUDE.md`, `AGENTS.md`), GitHub Copilot, Cursor, dan Windsurf.

---

## Tech Stack

- **Framework:** Next.js 16 (App Router), React 19, TypeScript 5 (strict)
- **Styling:** Tailwind CSS 3, shadcn/ui (44 components, new-york style)
- **Auth:** Supabase SSR — email/password, Google OAuth, Magic Link
- **Payments:** Transfer manual (MALIYA CENTER) — bebas gateway fee-persentase
- **Email:** Resend + React Email — template welcome & invoice Bahasa Indonesia
- **Blog:** Berbasis database (Supabase `blog_posts`), kategori/tier akses, reading time, dan tag support
- **AI:** Vercel AI SDK — OpenAI & Anthropic streaming
- **Database:** Supabase PostgreSQL — migrations untuk `profiles`, `subscriptions`, `payments`, dan lainnya (semua dengan RLS)

---

## Quick Start

```bash
npm install
cp .env.example .env.local
# isi variabel di .env.local (lihat bagian Environment Variables)
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Salin `.env.example` ke `.env.local` dan isi nilai berikut:

```env
# Supabase — dari Project Settings > API
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# URL aplikasi
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Rekening transfer manual (MALIYA CENTER) — dipakai /toko, checkout subscription, dan Koin
NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT=
NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME=
NEXT_PUBLIC_PAYMENT_BANK_NAME=

# Email — dari Resend dashboard
RESEND_API_KEY=
EMAIL_FROM=Nama Bisnis <noreply@namadomain.id>

# Admin bootstrap
ADMIN_EMAILS=kamu@contoh.com

# AI — provider: openai | anthropic | google
AI_DEFAULT_PROVIDER=google
GOOGLE_GENERATIVE_AI_API_KEY=
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
| `/about` | Tentang Avathur Rahman |
| `/blog` | Blog |
| `/blog/[slug]` | Artikel detail |
| `/tulis` | AI Scribe (writing assistant) |
| `/contact` | Kontak |
| `/checkout` | Checkout |
| `/privacy` | Kebijakan privasi |
| `/terms` | Syarat dan ketentuan |

### Dashboard (auth-gated)
| Route | Halaman |
| --- | --- |
| `/dashboard` | Dashboard user |
| `/dashboard/settings` | Pengaturan profil |
| `/dashboard/billing` | Billing |
| `/admin` | Admin dashboard |

### Auth
| Route | Halaman |
| --- | --- |
| `/auth/login` | Login |
| `/auth/sign-up` | Daftar |
| `/auth/verify-email` | Verifikasi email |
| `/auth/forgot-password` | Lupa password |

---

## Struktur Folder

```
cms-bapikir/
├── app/                    # Next.js App Router
├── components/             # UI components
├── config/                 # Site config & navigation
├── content/blog/           # MDX blog posts
├── lib/                    # Utilities (supabase, AI, payments)
├── hooks/                  # React hooks
├── emails/                 # Email templates (React Email)
├── supabase/migrations/    # SQL migrations
├── docs/                   # Documentation
└── types/                  # TypeScript type definitions
```

---

## AI Tools

Repo ini menyertakan konfigurasi untuk beberapa AI coding tools:

| File | Tool |
| --- | --- |
| `CLAUDE.md` | Claude Code |
| `AGENTS.md` | Agent guidance |
| `.cursorrules` | Cursor |
| `.windsurfrules` | Windsurf |

---

## Ekosistem

CMS Bapikir adalah bagian dari ekosistem BAPIKIR OS:
- **WAKI** — Website static murah untuk UMKM
- **CMS Bapikir** — Premium documentation + toko digital
- **MESA** — AI pribadi di laptop (Laptop Bernyawa)

---

## License

Proprietary — licensed, not sold. See [`LICENSE.md`](./LICENSE.md) for the summary and `/terms`
on the live site for the full, authoritative terms.
