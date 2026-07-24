# Source Inventory

This file is a practical reference for the important source files currently in the repository.

## Root Files

| File | Purpose |
| --- | --- |
| `package.json` | Scripts and dependency declarations |
| `next.config.ts` | Next.js config with `cacheComponents: true` |
| `tsconfig.json` | Strict TypeScript config and `@/*` path alias |
| `tailwind.config.ts` | Tailwind theme extensions and plugin registration |
| `components.json` | shadcn/ui project configuration |
| `proxy.ts` | Request-time Supabase session update and auth gating |
| `.env.example` | Required environment variable references |

## Config Files

| File | Purpose |
| --- | --- |
| `config/site.ts` | `siteConfig` — site name, description, base URL |
| `config/navigation.ts` | `marketingNav` and `dashboardNav` link arrays |
| `lib/seo.ts` | Shared SEO helpers for metadata, canonical URLs, absolute URLs, and JSON-LD serialization |
| `lib/validations.ts` | Shared Zod schemas for API request validation |

## App Router Files

| File | Purpose |
| --- | --- |
| `app/layout.tsx` | Root layout: Geist font, metadata, `lang="id"`, ThemeProvider, TooltipProvider, Toaster |
| `app/globals.css` | Tailwind layers and design tokens |
| `app/(marketing)/layout.tsx` | Marketing layout: `Header` + `Footer` wrapper |
| `app/(marketing)/page.tsx` | Landing page — `/` |
| `app/(dashboard)/layout.tsx` | Dashboard layout: `Header` + max-width container |
| `app/(dashboard)/dashboard/page.tsx` | Authenticated dashboard — `/dashboard` |
| `app/(dashboard)/dashboard/settings/page.tsx` | Settings — `/dashboard/settings` (profile + password change) |
| `app/(dashboard)/dashboard/billing/page.tsx` | Billing — `/dashboard/billing` (plan + payment flow) |
| `app/(dashboard)/admin/page.tsx` | Admin dashboard — `/admin` (gated by `ADMIN_EMAILS`) |
| `app/(marketing)/about/page.tsx` | About page — `/about` |
| `app/(marketing)/checkout/page.tsx` | Checkout / purchase flow — `/checkout` |
| `app/(marketing)/contact/page.tsx` | Contact form page — `/contact` |
| `app/(marketing)/loading.tsx` | Marketing skeleton loading state |
| `app/(marketing)/open/page.tsx` | Open startup metrics — `/open` (template demo data) |
| `app/(marketing)/order/[id]/page.tsx` | Order confirmation / manual-transfer proof upload — `/order/[id]` |
| `app/(marketing)/roadmap/page.tsx` | Public product roadmap — `/roadmap` |
| `app/(marketing)/status/page.tsx` | Service status — `/status` |

Not built yet, despite older docs claiming otherwise: `app/(marketing)/affiliates/page.tsx`,
`app/(marketing)/changelog/page.tsx`, `app/(marketing)/compare/page.tsx`,
`app/(marketing)/use-cases/page.tsx`, `app/(marketing)/waitlist/page.tsx` +
`waitlist-page.tsx`. The waitlist *feature* (API route, table, admin management) is real — see
below — it's just not exposed as its own marketing page.
| `app/auth/login/page.tsx` | Login screen |
| `app/auth/sign-up/page.tsx` | Sign-up screen |
| `app/auth/sign-up-success/page.tsx` | Post-registration instructions |
| `app/auth/forgot-password/page.tsx` | Password reset request screen |
| `app/auth/update-password/page.tsx` | Password update screen |
| `app/auth/error/page.tsx` | Auth error display |
| `app/auth/verify-email/page.tsx` | Email verification instructions |
| `app/auth/verify-email/verify-email-client.tsx` | Client-side verify-email resend flow |
| `app/auth/confirm/route.ts` | Supabase OTP/OAuth verification handler |
| `app/error.tsx` | Root error boundary |
| `app/not-found.tsx` | Global 404 page |
| `app/robots.ts` | Robots.txt dynamic generation |
| `app/sitemap.ts` | XML sitemap dynamic generation |

## Layout Components

| File | Purpose |
| --- | --- |
| `components/layout/header.tsx` | Site header: logo, `AuthButton`, `ThemeSwitcher` |
| `components/layout/footer.tsx` | Site footer: copyright, `ThemeSwitcher` |
| `components/layout/desktop-nav.tsx` | Desktop navigation bar links |
| `components/layout/current-year.tsx` | Dynamic copyright year (client component) |

## Auth And Shell Components

| File | Purpose |
| --- | --- |
| `components/auth/supabase-env-notice.tsx` | Warning banner when Supabase env vars are missing |
| `components/config/feature-notice.tsx` | Shared notice for disabled or partially configured features |
| `components/auth-button.tsx` | Server-side auth-aware header actions |
| `components/logout-button.tsx` | Sign-out action |
| `components/login-form.tsx` | Sign-in: email/password tab, Magic Link tab, Google OAuth button |
| `components/sign-up-form.tsx` | Registration: Google OAuth button + email/password form |
| `components/forgot-password-form.tsx` | Password reset request form |
| `components/update-password-form.tsx` | Password update form |
| `components/theme-switcher.tsx` | Light/dark/system mode switcher |
| `components/contact-form.tsx` | Contact form with fields and submission handling |

## Shared Utility Files

| File | Purpose |
| --- | --- |
| `lib/utils.ts` | `cn()` helper and auth-enabled env check |
| `lib/config/public-features.ts` | Shared public feature toggles and client-safe env helpers |
| `lib/config/features.ts` | Server-side feature readiness map for UI, routes, and health checks |
| `lib/supabase/client.ts` | Browser Supabase client factory |
| `lib/supabase/server.ts` | Server Supabase client factory |
| `lib/supabase/proxy.ts` | Session refresh and redirect logic used by `proxy.ts` |
| `lib/email.ts` | `sendEmail()` — Resend wrapper that renders React Email templates and sends via API |

## Hooks

| File | Purpose |
| --- | --- |
| `hooks/use-auth.ts` | Client-side user session state with `onAuthStateChange` listener |
| `hooks/use-subscription.ts` | Client-side subscription state; exposes `isPro` and `isActive` helpers |
| `hooks/use-ai-chat.ts` | Client-side AI chat hook wrapping `useChat` with `DefaultChatTransport` |

## Payment Library

There is no third-party gateway client — manual-transfer payment/proof/admin-approval functions live in `lib/data/payments.ts` (see API Routes below), reusing `lib/storage/bukti.ts` for signed proof URLs.

## AI Library

| File | Purpose |
| --- | --- |
| `lib/ai/provider.ts` | `getModel()` — provider-agnostic model factory; supports OpenAI and Anthropic via Vercel AI SDK |
| `lib/ai/usage.ts` | `trackUsage()`, `getMonthlyUsage()`, `checkUsageLimit()` — token tracking with plan-based limits |
| `lib/ai/middleware.ts` | `authorizeAIRequest()` — auth + provider config check + usage gating for AI API routes |

## API Routes

| File | Method | Purpose |
| --- | --- | --- |
| `app/api/payments/route.ts` | POST | Auth-gated — creates a `PENDING` manual-transfer `payments` record, returns rekening instructions (or reuses an existing pending order) |
| `app/api/payments/bukti-upload-url/route.ts` | POST | Issues a signed upload URL for the proof-of-transfer file |
| `app/api/payments/konfirmasi/route.ts` | POST | Attaches the uploaded proof to the pending payment |
| `app/api/payments/admin/route.ts` | GET | Admin-gated — lists pending manual-transfer payments |
| `app/api/payments/admin/[id]/route.ts` | PATCH | Admin-gated — approves (activates subscription) or rejects a payment |
| `app/api/contact/route.ts` | POST | Contact form — validates input and sends the message via Resend |
| `app/api/waitlist/route.ts` | POST | Waitlist — validates input and inserts the sign-up into Supabase |
| `app/api/ai/chat/route.ts` | POST | Auth + plan-gated streaming chat using `streamText()` + `toUIMessageStreamResponse()` |
| `app/api/ai/generate/route.ts` | POST | Auth + plan-gated one-shot text generation using `generateText()` |

## Email Templates

| File | Purpose |
| --- | --- |
| `emails/welcome.tsx` | Onboarding email — greeting + link to dashboard, in Bahasa Indonesia |
| `emails/invoice.tsx` | Payment confirmation — order ID, plan, itemised amount in Rupiah |

## Database Migrations

| File | Creates |
| --- | --- |
| `supabase/migrations/20260316000001_create_profiles.sql` | `profiles` table + auto-create trigger on signup |
| `supabase/migrations/20260316000002_create_subscriptions.sql` | `subscriptions` table + auto-create FREE trigger on signup |
| `supabase/migrations/20260316000003_create_payments.sql` | `payments` table + enums (plan, payment_status, payment_provider) |
| `supabase/migrations/20260316000004_create_waitlist.sql` | `waitlist` table |
| `supabase/migrations/20260316000005_create_ai_usage.sql` | `ai_usage` table + RLS + index on (user_id, created_at) |

## Installed shadcn/ui Primitives (44 total)

accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button, calendar, card, carousel, chart, checkbox, collapsible, command, context-menu, dialog, drawer, dropdown-menu, form, hover-card, input, label, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, skeleton, slider, sonner, switch, table, tabs, template-banner, textarea, toggle, toggle-group, tooltip

## Landing Page Sections

| File | Purpose |
| --- | --- |
| `components/sections/hero.tsx` | Hero — headline, badge, CTA |
| `components/sections/features.tsx` | Features grid — 6 cards with icons |
| `components/sections/pricing.tsx` | Pricing — FREE/PRO cards with monthly/annual toggle |
| `components/sections/testimonials.tsx` | Testimonials — Avatar + Carousel |
| `components/sections/faq.tsx` | FAQ — Accordion |
| `components/sections/cta.tsx` | CTA banner |
| `components/sections/ai-optimized.tsx` | AI-Optimized feature section |
| `components/sections/pain-points.tsx` | Pain points section |
| `components/sections/tech-stack.tsx` | Tech stack showcase section |
| `components/sections/timeline.tsx` | Product timeline / roadmap section |

## Docs Page Components

| File | Purpose |
| --- | --- |
| `components/docs/component-demo.tsx` | Renders live shadcn/ui component previews |
| `components/docs/tab-controls.tsx` | Controls tab for component docs page |
| `components/docs/tab-data.tsx` | Data display tab |
| `components/docs/tab-forms.tsx` | Form components tab |
| `components/docs/tab-foundations.tsx` | Foundation primitives tab |
| `components/docs/tab-navigation.tsx` | Navigation components tab |
| `components/docs/tab-overlays.tsx` | Overlay components tab |

## Dashboard Components

| File | Purpose |
| --- | --- |
| `components/dashboard/subscription-card.tsx` | Subscription status with Badge, Progress, Skeleton |
| `components/dashboard/payments-table.tsx` | Recent payments — Table + Badge, client-side Supabase query |
| `components/dashboard/admin-revenue-chart.tsx` | Revenue bar chart (recharts, client component) |
| `components/dashboard/payment-button.tsx` | Upgrade button — calls /api/payments, redirects to `/order/[id]` |
| `components/dashboard/manual-payment-panel.tsx` | Rekening instructions + proof-of-transfer upload on the order page |
| `components/admin/manual-payment-table.tsx` | Admin queue for approving/rejecting pending manual-transfer payments |

## CI / Infrastructure

| File | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | GitHub Actions: lint + build on push and PR to `main` |

## Blog

| File | Purpose |
| --- | --- |
| `lib/data/blog.ts` | DB-backed blog data layer — public reads (`getAllPublishedPosts`, `getFilteredPublishedPosts`, `getPublishedPostBySlug`, `getPublishedPostsByCategory`/`getPublishedPostsByAccess`, `getActiveCategories`) and admin CRUD (`createPostAdmin`, `updatePostAdmin`, `deletePostAdmin`) against `blog_posts` |
| `app/(marketing)/blog/page.tsx` | Blog listing with category/access `FilterBar` — `/blog` |
| `app/(marketing)/blog/[slug]/page.tsx` | Blog post detail — `/blog/[slug]`, gates `member`/`exclusive`/`premium` tier posts |
| `app/(marketing)/blog/kategori/[slug]/page.tsx` | Blog posts filtered by category — `/blog/kategori/[slug]` |
| `components/blog/{access-badge,article-card,filter-bar}.tsx` | Tier badge, reusable article card, category/access filter dropdowns |
| `content/blog/` | Empty — the blog moved fully to the `blog_posts` DB table; MDX files here are no longer read (see `content/blog.archive/` for the pre-migration archive) |

## Files Pending Creation (Future)

| File | Purpose |
| --- | --- |
| `types/database.ts` | Generated Supabase TypeScript types (run after migrations are applied) |
