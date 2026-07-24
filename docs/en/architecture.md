# Architecture

## Top-Level Structure

| Path | Purpose |
| --- | --- |
| `app/` | App Router routes, layouts, route handlers, and global styles |
| `app/marketing.css` | Scoped marketing-only design preset tokens, typography, and component styling |
| `app/(marketing)/` | Public-facing pages (landing page) |
| `app/(dashboard)/` | Auth-gated dashboard pages |
| `app/auth/` | Authentication flow pages and OTP route handler |
| `components/` | Reusable UI and auth components |
| `components/marketing/` | Marketing-only preset provider and preset switcher |
| `components/layout/` | Shared `Header` and `Footer` components |
| `components/ui/` | shadcn/ui primitives |
| `config/` | Centralized site config, navigation definitions, and marketing preset registry |
| `lib/` | Shared utilities, Supabase client factories, and payment helpers |
| `lib/payments/` | Payment gateway client and helper functions |
| `lib/ai/` | AI provider factory, usage tracking, and middleware |
| `lib/rate-limit.ts` | Shared persistent rate limiting with Supabase fallback to memory and response header helpers |
| `app/api/` | API route handlers (payments, webhooks) |
| `lib/data/` | Server-side data access helpers for billing, profiles, roles, webhook events, and audit logs |
| `lib/storage/` | Avatar upload/storage configuration and signed URL helpers |
| `emails/` | React Email templates |
| `hooks/` | Client-side React hooks for auth and subscription state |
| `supabase/migrations/` | SQL migration files for database schema |
| `.github/workflows/` | *(does not exist yet — no CI pipeline; run `lint`/`typecheck`/`test`/`build` manually)* |
| `docs/` | Project documentation (English and Indonesian) |
| `proxy.ts` | Request-time session refresh and auth gating |
| `tailwind.config.ts` | Tailwind content scanning, theme extensions, and plugin setup |
| `components.json` | shadcn/ui project configuration |

## Rendering Model

- Server components are the default for route files in `app/`
- Client components are used for interactive auth forms, theme switching, and marketing design switching
- Supabase server access is done through `lib/supabase/server.ts`
- Supabase browser access is done through `lib/supabase/client.ts`
- `Suspense` is used around async auth-aware UI (`AuthButton`, `DashboardContent`)

## Route Map

### Marketing Routes (public, `(marketing)` group)

| Route | File | Purpose |
| --- | --- | --- |
| `/` | `app/(marketing)/page.tsx` | CMS Bapikir landing page |
| `/about` | `app/(marketing)/about/page.tsx` | About CMS Bapikir |
| `/blog` | `app/(marketing)/blog/page.tsx` | DB-backed blog listing with category/access filters (`blog_posts` via `lib/data/blog.ts`) |
| `/blog/[slug]` | `app/(marketing)/blog/[slug]/page.tsx` | Blog post detail — renders the `content` column as MDX via `next-mdx-remote/rsc`; gates `member`/`exclusive`/`premium` tier posts |
| `/blog/kategori/[slug]` | `app/(marketing)/blog/kategori/[slug]/page.tsx` | Blog posts filtered by category |
| `/checkout` | `app/(marketing)/checkout/page.tsx` | Purchase / checkout flow |
| `/contact` | `app/(marketing)/contact/page.tsx` | Contact form |
| `/open` | `app/(marketing)/open/page.tsx` | Open startup metrics (template demo data) |
| `/order/[id]` | `app/(marketing)/order/[id]/page.tsx` | Order confirmation / manual-transfer proof upload |
| `/privacy` | `app/(marketing)/privacy/page.tsx` | Privacy policy |
| `/roadmap` | `app/(marketing)/roadmap/page.tsx` | Public product roadmap |
| `/status` | `app/(marketing)/status/page.tsx` | Service status |
| `/terms` | `app/(marketing)/terms/page.tsx` | Terms of service |

Not built yet, despite being referenced in older planning docs: `/affiliates`, `/changelog`,
`/compare`, `/use-cases`, `/waitlist` (as a standalone page — the waitlist *feature* is real,
see `/api/waitlist` below, it's just not exposed as its own marketing page). `/payment/callback`
was also removed along with the Midtrans/Doku gateway — there's no external payment provider
to redirect back from anymore.

### Dashboard Routes (auth-gated, `(dashboard)` group)

| Route | File | Purpose |
| --- | --- | --- |
| `/dashboard` | `app/(dashboard)/dashboard/page.tsx` | Main user dashboard |
| `/dashboard/settings` | `app/(dashboard)/dashboard/settings/page.tsx` | Profile + password change |
| `/dashboard/billing` | `app/(dashboard)/dashboard/billing/page.tsx` | Plan display + payment flow |
| `/dashboard/components` | `app/(dashboard)/dashboard/components/page.tsx` | Component showcase for dashboard and admin UI |
| `/admin` | `app/(dashboard)/admin/page.tsx` | Admin dashboard (gated by `user_roles`) |

### Auth Routes

| Route | File / Type | Purpose |
| --- | --- | --- |
| `/auth/login` | Page | Sign-in screen |
| `/auth/sign-up` | Page | Registration screen |
| `/auth/sign-up-success` | Page | Post-registration confirmation |
| `/auth/verify-email` | Page | Email verification instructions |
| `/auth/forgot-password` | Page | Password reset request |
| `/auth/update-password` | Page | New password form |
| `/auth/error` | Page | Auth error display |
| `/auth/confirm` | Route handler | OTP/OAuth callback |

### API Routes

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/payments` | POST | Creates a `PENDING` manual-transfer payment record, returns rekening instructions (or reuses an existing pending order) |
| `/api/payments/bukti-upload-url` | POST | Issues a signed upload URL for the proof-of-transfer file |
| `/api/payments/konfirmasi` | POST | Attaches the uploaded proof to the pending payment |
| `/api/payments/admin` | GET | Lists pending manual-transfer payments for admin review |
| `/api/payments/admin/[id]` | PATCH | Admin approves (activates the subscription) or rejects a payment |
| `/api/profile` | POST | Updates the authenticated user's profile fields |
| `/api/profile/avatar` | POST | Issues signed upload URLs for Supabase Storage avatars |
| `/api/subscription` | POST | Handles self-serve cancel/resume subscription actions |
| `/api/admin/users/role` | POST | Promotes or demotes a user role from the admin dashboard |
| `/api/contact` | POST | Contact form submission handler |
| `/api/waitlist` | POST | Waitlist sign-up handler |
| `/api/ai/chat` | POST | Streaming chat (auth + plan-gated) |
| `/api/ai/generate` | POST | One-shot text generation (auth + plan-gated) |
| `/api/health` | GET | Health/readiness check for configuration and server-side database access |

### App-Level Files

| File | Purpose |
| --- | --- |
| `app/error.tsx` | Root error boundary |
| `app/not-found.tsx` | Global 404 page |
| `app/robots.ts` | Robots.txt dynamic generation |
| `app/sitemap.ts` | XML sitemap dynamic generation |
| `app/(marketing)/loading.tsx` | Marketing section skeleton loading state |

## Route Groups Explained

Route groups use parentheses in the folder name and do not affect the URL. They exist purely to apply different layouts to different sections of the app.

- `app/(marketing)/` — uses `MarketingLayout` (full-width, `Header` + `Footer`)
- `app/(dashboard)/` — uses `DashboardLayout` (max-width container, `Header` with auth actions)
- `app/auth/` — no shared layout; each auth page owns its own centering and card structure

## Layouts

### Root Layout

`app/layout.tsx` is responsible for:

- Loading the shared font pool used by the default app theme and marketing presets
- Defining global metadata (`lang="id"`, default Open Graph/Twitter, canonical base URL)
- Injecting `app/globals.css` and `app/marketing.css`
- Wrapping the app in `ThemeProvider` from `next-themes`
- Wrapping the full app in `MarketingDesignProvider` so the selected preset can style marketing and dashboard routes consistently

### Marketing Layout

`app/(marketing)/layout.tsx`:

- Renders `Header` (site name + auth actions + marketing design switcher)
- Renders `Footer` (copyright + marketing design switcher)
- Uses the global preset shell from the root layout while keeping the marketing-specific header/footer structure

### Dashboard Layout

`app/(dashboard)/layout.tsx`:

- Same `Header` structure as marketing
- Wraps `children` in a `max-w-5xl` centered container with padding

## Styling System

- Tailwind CSS utility classes
- CSS custom properties in `app/globals.css` and `app/marketing.css`
- shadcn/ui with the `new-york` style, base color `neutral`
- `tailwindcss-animate` for animation helpers
- Theme switching uses the `class` strategy through `next-themes`
- Marketing presets are applied through a `data-design` shell plus mirrored `body[data-marketing-design]` attributes, and the active preset layers on top of the resolved light/dark theme instead of replacing it
- Path aliases: `@/components`, `@/components/ui`, `@/lib`, `@/lib/utils`, `@/config`

## Component Layers

### Layout Components

| File | Purpose |
| --- | --- |
| `components/layout/header.tsx` | Shared site header with branding, `AuthButton`, a global `ThemeSwitcher`, and the marketing-only `DesignSwitcher` |
| `components/layout/footer.tsx` | Shared marketing footer with copyright and `DesignSwitcher` |
| `components/layout/desktop-nav.tsx` | Desktop navigation bar links |
| `components/layout/current-year.tsx` | Dynamic copyright year (client component) |

### App-Level Components

| File | Purpose |
| --- | --- |
| `components/auth-button.tsx` | Server-side auth-aware nav actions |
| `components/theme-switcher.tsx` | Light/dark/system mode switcher |
| `components/marketing/design-provider.tsx` | App-wide preset state, persistence, resolved theme sync, and `body`/shell attribute synchronization |
| `components/marketing/design-switcher.tsx` | Dropdown switcher for the twelve supported marketing presets |

### Auth Components

| File | Purpose |
| --- | --- |
| `components/login-form.tsx` | Sign-in form: password tab, Magic Link tab, Google OAuth button |
| `components/sign-up-form.tsx` | Registration form: Google OAuth button + email/password |
| `components/forgot-password-form.tsx` | Password reset request form |
| `components/update-password-form.tsx` | Password update form |
| `components/logout-button.tsx` | Sign-out action button |
| `components/auth/supabase-env-notice.tsx` | Warning banner when Supabase env vars are missing |
| `components/config/feature-notice.tsx` | Shared notice for disabled or partially configured features |
| `components/contact-form.tsx` | Contact form with fields and submission handling |

### Landing Page Sections

| File | Purpose |
| --- | --- |
| `components/sections/hero.tsx` | Hero section |
| `components/sections/features.tsx` | Features section |
| `components/sections/pricing.tsx` | Pricing section |
| `components/sections/testimonials.tsx` | Testimonials section |
| `components/sections/faq.tsx` | FAQ section |
| `components/sections/cta.tsx` | Call-to-action section |
| `components/sections/ai-optimized.tsx` | AI-Optimized feature section |
| `components/sections/pain-points.tsx` | Pain points section |
| `components/sections/tech-stack.tsx` | Tech stack showcase section |
| `components/sections/timeline.tsx` | Product timeline / roadmap section |

### Dashboard Components

| File | Purpose |
| --- | --- |
| `components/dashboard/subscription-card.tsx` | Displays current plan and subscription status |
| `components/dashboard/payments-table.tsx` | Table of past payments |
| `components/dashboard/admin-revenue-chart.tsx` | Revenue chart for admin dashboard |
| `components/dashboard/payment-button.tsx` | Starts a manual-transfer checkout session, redirects to `/order/[id]` |
| `components/dashboard/manual-payment-panel.tsx` | Rekening instructions + proof-of-transfer upload on the order page |
| `components/admin/manual-payment-table.tsx` | Admin queue for approving/rejecting pending manual-transfer payments |

### Docs Page Components

| File | Purpose |
| --- | --- |
| `components/docs/component-demo.tsx` | Renders live shadcn/ui component previews |
| `components/docs/tab-controls.tsx` | Controls tab for component docs page |
| `components/docs/tab-data.tsx` | Data display tab |
| `components/docs/tab-forms.tsx` | Form components tab |
| `components/docs/tab-foundations.tsx` | Foundation primitives tab |
| `components/docs/tab-navigation.tsx` | Navigation components tab |
| `components/docs/tab-overlays.tsx` | Overlay components tab |

### shadcn/ui Primitives

Currently installed (44 total): `accordion`, `alert`, `alert-dialog`, `aspect-ratio`, `avatar`, `badge`, `breadcrumb`, `button`, `calendar`, `card`, `carousel`, `chart`, `checkbox`, `collapsible`, `command`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `form`, `hover-card`, `input`, `label`, `navigation-menu`, `pagination`, `popover`, `progress`, `radio-group`, `resizable`, `scroll-area`, `select`, `separator`, `sheet`, `skeleton`, `slider`, `sonner`, `switch`, `table`, `tabs`, `template-banner`, `textarea`, `toggle`, `toggle-group`, `tooltip`

## Hooks Layer

| File | Purpose |
| --- | --- |
| `hooks/use-auth.ts` | Subscribes to `onAuthStateChange`; returns `{ user, loading }` |
| `hooks/use-subscription.ts` | Fetches subscription row for current user; returns `{ subscription, loading, isPro, isActive }` |
| `hooks/use-ai-chat.ts` | AI chat state via Vercel AI SDK's `useChat` with `DefaultChatTransport` |

## Payment Layer

There is no third-party gateway client — manual-transfer payment/proof/admin-approval logic lives directly in `lib/data/payments.ts` (reusing `lib/storage/bukti.ts` for signed proof URLs and `lib/data/subscriptions.ts#activateSubscriptionForPayment` on approval).

## Email Layer

| File | Purpose |
| --- | --- |
| `lib/email.ts` | `sendEmail()` — renders React Email template to HTML, sends via Resend |
| `emails/welcome.tsx` | Onboarding email template in Bahasa Indonesia |
| `emails/invoice.tsx` | Payment confirmation email with itemised Rupiah amounts |

## AI Layer

| File | Purpose |
| --- | --- |
| `lib/ai/provider.ts` | `getModel()` — resolves the active AI model from `AI_DEFAULT_PROVIDER`; supports OpenAI and Anthropic |
| `lib/ai/usage.ts` | `trackUsage()` — inserts token counts into `ai_usage`; `getMonthlyUsage()` and `checkUsageLimit()` enforce plan caps |
| `lib/ai/middleware.ts` | `authorizeAIRequest()` — verifies auth session, checks provider key is set, and enforces token budget before AI routes run |

## Config Layer

| File | Purpose |
| --- | --- |
| `config/site.ts` | `siteConfig` — site name, description, base URL |
| `config/navigation.ts` | `marketingNav` and `dashboardNav` link arrays |

## Database Schema

Migrations are in `supabase/migrations/`. Core product, observability, and access-control tables are defined:

| Table | Key Columns | Notes |
| --- | --- | --- |
| `profiles` | `id` (FK → `auth.users`), `full_name`, `avatar_url` | Auto-created on user signup via trigger |
| `subscriptions` | `user_id`, `plan` (enum), `status` (enum) | Starts as FREE; auto-created on signup via trigger |
| `payments` | `user_id`, `amount` (IDR), `plan`, `provider` (`MANUAL`; `MIDTRANS`/`DOKU` kept in the enum for historical rows), `external_id`, `bukti_path`, `bank`, `nama_pengirim`, `tanggal_transfer` | Manual-transfer only — no percentage-fee gateway (MALIYA CENTER policy) |
| `ai_usage` | `user_id`, `provider`, `model`, `prompt_tokens`, `completion_tokens` | Tracks per-user AI token usage; indexed by (user_id, created_at) |
| `user_roles` | `user_id`, `role` (`member`/`admin`) | Source of truth for admin access |
| `webhook_events` | `provider`, `event_key`, `external_id`, `status`, `payload` | Durable webhook ledger; currently unused since the Midtrans/Doku webhooks were removed in favor of manual-transfer admin approval, kept for any future provider that needs it |
| `rate_limit_buckets` | `namespace`, `subject_key`, `count`, `reset_at` | Persistent rate limiting across restarts and multiple instances |
| `audit_logs` | `type`, `actor_user_id`, `actor_email`, `description`, `metadata` | Admin-facing operational/audit trail for profile, payment, and admin actions |

All tables have Row Level Security enabled with user-scoped read policies.

## Important Config Choices

### Next.js

`next.config.ts` enables `cacheComponents: true`.

### TypeScript

`tsconfig.json` enables `strict: true`, path alias `@/*`, bundler module resolution.

### ESLint

`eslint.config.mjs` extends `next/core-web-vitals` and `next/typescript`, and ignores `.next/**`.

## Current Architectural Gaps

- No TypeScript types generated from Supabase schema yet (needs live project with migrations applied)
- No domain/service layer (queries live directly in page components for now)
- Team / multi-tenant foundation is still not present
