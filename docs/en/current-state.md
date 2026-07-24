# Current State

## Summary

CMS Bapikir is a Next.js boilerplate built specifically for Indonesian developers. Phases 1–4 are complete. The repository now includes:

- Next.js App Router with route groups `(marketing)`, `(dashboard)`, and `auth`
- TypeScript
- Tailwind CSS + shadcn/ui
- Supabase browser and server clients
- Cookie-based auth/session refresh
- Email/password login, Google OAuth, and Magic Link (passwordless)
- Dashboard at `/dashboard` (auth-gated)
- Centralized site config (`config/site.ts`)
- Database migrations for `profiles`, `subscriptions`, and `payments`
- Local generated-style Supabase schema types in `types/database.ts`
- Role-based admin access via `user_roles` with legacy `ADMIN_EMAILS` bootstrap
- Manual-transfer payment integration (MALIYA CENTER policy: no percentage-fee gateway) — proof upload + admin approve/reject, no webhook
- Server-owned billing plan catalog and protected payment pricing
- Self-serve subscription cancel/resume actions
- Resend email integration with React Email templates (welcome, invoice)
- Client-side auth and subscription hooks (`use-auth`, `use-subscription`)
- AI integration layer: Vercel AI SDK with OpenAI and Anthropic support, usage tracking, and plan-based gating
- Admin dashboard at `/admin` with payment stats and subscription overview
- Admin dashboard at `/admin` with user management, webhook event visibility, and audit trail
- No CI workflow exists yet (no `.github/workflows/` — run `lint`/`typecheck`/`test`/`build` manually before shipping)
- Database-backed blog at `/blog` (`blog_posts` table via `lib/data/blog.ts`), reading time, tags, and category/access tiers, plus an admin editor (`/admin/blog/tulis`) with `.md`/`.mdx` import and a live Write/Preview toggle
- 44 shadcn/ui components installed (full component library)
- Marketing design preset system with twelve selectable presets: `default`, `monochrome`, `newsprint`, `luxury`, `academia`, `saas`, `professional`, `enterprise`, `neo-brutalism`, `bauhaus`, `web3`, and `terminal`, each with light/dark theme support
- Landing page with Hero, Features, Testimonials, Pricing, FAQ, and CTA sections
- Sticky header with desktop nav, mobile Sheet drawer, Avatar + DropdownMenu auth button
- Dashboard with subscription card, payments table, breadcrumb nav
- Admin dashboard with recharts revenue chart, sortable payments table, pagination
- Settings page at `/dashboard/settings` with profile display and password change
- Billing page at `/dashboard/billing` with plan display and manual-transfer payment flow
- Supabase-backed persistent rate limiting on contact, waitlist, payment, and AI routes with memory fallback plus standard response headers
- Supabase Storage avatar uploads with signed upload URLs and cleanup on avatar replacement/removal
- Durable webhook event ledger (`webhook_events`) — currently unused since manual-transfer admin approval replaced the Midtrans/Doku webhooks
- Health endpoint at `/api/health` for config + database checks
- Sonner toast notifications wired globally
- SEO foundations: per-page metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD, sitemap, and robots
- Automated tests via Vitest + Testing Library covering API routes, the manual-transfer payment flow, AI guards, MDX helpers, auth/client hooks, rate limiting, and key forms

## Current Installed Baseline

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
| `ai` | `6` |
| `@ai-sdk/openai` | `3` |
| `@ai-sdk/anthropic` | `3` |
| `@ai-sdk/react` | `3` |

## What Works Today

- The app runs with `npm run dev`
- Linting passes with `npm run lint`
- Landing page at `/` with CMS Bapikir branding, shared `Header` and `Footer`
- Marketing routes support a preset switcher with twelve scoped visual systems without duplicating the route tree, while still respecting the shared light/dark/system theme switcher
- Auth flows: sign up, sign in (password + Google OAuth + Magic Link), forgot password, update password
- Dashboard at `/dashboard` — auth-gated, shows authenticated user info
- Session refresh and auth gating run through `proxy.ts`
- shadcn/ui base components under `components/ui`
- `config/site.ts` and `config/navigation.ts` for centralized site metadata
- `POST /api/payments` — creates a `PENDING` manual-transfer payment record and returns rekening instructions (or reuses an existing pending order)
- `POST /api/payments/bukti-upload-url` / `POST /api/payments/konfirmasi` — proof-of-transfer upload flow
- `GET /api/payments/admin` / `PATCH /api/payments/admin/[id]` — admin review queue; approving activates the subscription
- `POST /api/profile` — updates the authenticated user's profile data and cleans up replaced avatar objects
- `POST /api/profile/avatar` — issues signed upload URLs for Supabase Storage avatars
- `POST /api/subscription` — handles self-serve cancel/resume actions
- `POST /api/admin/users/role` — allows admins to promote/demote user roles
- `GET /api/health` — returns configuration + database readiness status
- `sendEmail()` in `lib/email.ts` — sends React Email templates via Resend
- `emails/welcome.tsx` and `emails/invoice.tsx` — ready-to-use email templates in Bahasa Indonesia
- `useAuth()` in `hooks/use-auth.ts` — client-side user session state with `onAuthStateChange`
- `useSubscription()` in `hooks/use-subscription.ts` — client-side subscription state with `isPro` / `isActive` helpers
- `useAIChat()` in `hooks/use-ai-chat.ts` — client-side AI chat hook wrapping Vercel AI SDK's `useChat`
- `POST /api/ai/chat` — streaming chat endpoint (plan-gated, uses `streamText()`)
- `POST /api/ai/generate` — one-shot text generation endpoint (plan-gated, uses `generateText()`)
- Public forms and paid/AI mutation routes enforce persistent rate limits (with memory fallback) and return `X-RateLimit-*` headers
- `getModel()` in `lib/ai/provider.ts` — provider-agnostic model factory supporting OpenAI and Anthropic
- `authorizeAIRequest()` in `lib/ai/middleware.ts` — auth + config + usage gate for AI routes
- `trackUsage()` / `getMonthlyUsage()` / `checkUsageLimit()` in `lib/ai/usage.ts` — token usage tracking against plan limits
- Admin dashboard at `/admin` — payment stats, subscription counts, user role management, webhook visibility, audit trail, recent payments table (gated by `user_roles`)
- Blog listing at `/blog` — lists published posts from `blog_posts` with date, reading time, and tags
- Blog post detail at `/blog/[slug]` — renders the post's MDX `content` column via `next-mdx-remote/rsc` with Tailwind Typography prose styles
- `getAllPublishedPosts()`, `getPublishedPostBySlug()`, `getAllPostsAdmin()`, `createPostAdmin()`, `updatePostAdmin()`, `deletePostAdmin()` in `lib/data/blog.ts` — DB-backed blog data layer (public reads use the anon client + RLS `published = true`; admin reads/writes use the service-role client)
- Admin blog editor at `/admin/blog/tulis` — import `.md`/`.mdx` (parsed server-side at `/api/admin/blog/parse-md`, category validated against `config/blog-categories.ts`) and a Write/Preview tab (preview compiled server-side at `/api/admin/blog/preview`, hydrated client-side — identical rendering to the public page)
- `content/blog/` is a staging folder for finished drafts awaiting import (see `content/blog/README.md`); `content/blog.archive/` holds the 39 pre-migration articles as a historical record, not read by any code path
- `npm run typecheck` — runs TypeScript verification without emitting build artifacts
- `npm run test` — runs 95 automated tests across server-side and client-side feature coverage

## Database Migrations Ready To Apply

17 migration files exist under `supabase/migrations/` (this table lists the original ten; `supabase/migrations/` itself is the source of truth going forward — don't re-copy the list here again, it will drift). The seven added since (18260710–20260718) add: `arcs`/`arc_entries`/`children`/`child_milestones` (per-user "Arc Kehidupan" timeline, RLS-scoped, no public UI yet — see `app/(marketing)/arc/page.tsx`), `products`/`orders`, `koin_produk`, `beli_produk`, a `wa` column on `waitlist`, `blog_posts` (this doc's blog section above), and `media_library`.

| File | Creates |
| --- | --- |
| `20260316000001_create_profiles.sql` | `profiles` table + auto-create trigger |
| `20260316000002_create_subscriptions.sql` | `subscriptions` table + auto-create FREE tier trigger |
| `20260316000003_create_payments.sql` | `payments` table + enums (plan, status, provider) |
| `20260316000004_create_waitlist.sql` | `waitlist` table |
| `20260316000005_create_ai_usage.sql` | `ai_usage` table + RLS + index on (user_id, created_at) |
| `20260317000006_add_admin_roles_and_billing_hardening.sql` | `user_roles` table, payment plan metadata, reporting indexes/RPCs |
| `20260317000007_add_avatar_storage.sql` | `profiles.avatar_path` plus Supabase Storage bucket/policies for avatars |
| `20260317000008_add_webhook_events.sql` | `webhook_events` table plus retry-safe idempotent claim RPC |
| `20260317000009_add_persistent_rate_limits.sql` | `rate_limit_buckets` table plus persistent consume RPC |
| `20260317000010_add_audit_logs.sql` | `audit_logs` table for admin/profile/payment observability |

All tables include Row Level Security policies. The current repository already includes a typed `types/database.ts`, but you should still regenerate it against your live Supabase project after applying migrations.

## What Is Still Missing

- Sumopod / Mailketing email provider options
- Team / multi-tenant, API keys management, notifications, referrals, WhatsApp OTP, and mobile starter features from the public roadmap
- Team / multi-tenant foundation

## Next Immediate Steps

1. Apply the ten SQL migrations to your Supabase project
2. Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` so avatars, webhooks, persistent rate limits, audit logs, profile writes, and admin reporting can use server-only access
3. Regenerate `types/database.ts` against your live project if the schema differs
4. Enable Google OAuth in Supabase dashboard (Authentication > Providers)
5. Keep `ADMIN_EMAILS` as an optional bootstrap list, then manage actual admin access through `user_roles`
