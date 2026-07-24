# Setup And Development

## Prerequisites

The project was initialized and verified with:

- Node.js `v24.4.1`
- npm `11.4.2`

Any modern Node.js version compatible with Next.js 16 should work.

## Install Dependencies

```bash
npm install
```

## Automated Tests

The repository now includes a Vitest-based test suite with:

- Node-side unit and route handler tests
- JSDOM component and hook tests via Testing Library
- Playwright smoke tests for public routes
- Mocked integrations for Supabase, AI providers, and Resend

## Environment Variables

```bash
cp .env.example .env.local
```

Set the following:

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_ENABLE_AUTH=true
NEXT_PUBLIC_ENABLE_WAITLIST=true
NEXT_PUBLIC_ENABLE_CONTACT=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_ENABLE_ADMIN=true
NEXT_PUBLIC_ENABLE_AI=true

NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT=1234567890
NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME=Your Name
NEXT_PUBLIC_PAYMENT_BANK_NAME=BCA
NEXT_PUBLIC_PAYMENT_QRIS_IMAGE=/qris.jpg
NEXT_PUBLIC_PAYMENT_QRIS_LABEL=Scan to pay

RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=CMS Bapikir <noreply@avathur.id>

ADMIN_EMAILS=you@example.com,colleague@example.com

# AI (optional)
AI_DEFAULT_PROVIDER=openai
OPENAI_API_KEY=your-openai-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-studio-api-key
```

Notes:

- `NEXT_PUBLIC_APP_URL` is used by `config/site.ts` to build the site base URL
- The starter now degrades gracefully: missing config disables the affected feature instead of crashing the whole app
- If a feature is not relevant to your app, set its `NEXT_PUBLIC_ENABLE_*` toggle to `false` so the UI shows it as intentionally disabled instead of “not configured”
- `npm run env:check` now reports which enabled features are ready, which are in fallback mode, and which are disabled by toggle
- `/api/health` now includes a feature-by-feature readiness summary
- If Supabase vars are missing, auth-aware areas will not function but the app still renders
- `SUPABASE_SERVICE_ROLE_KEY` is required for profile updates, order lookups, payment/koin admin approval, and admin reporting
- Payments are manual-transfer only (MALIYA CENTER policy: no percentage-fee gateway) — `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT`, `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME`, `NEXT_PUBLIC_PAYMENT_BANK_NAME`, `NEXT_PUBLIC_PAYMENT_QRIS_IMAGE`, and `NEXT_PUBLIC_PAYMENT_QRIS_LABEL` are the same rekening config used by `/toko` and Koin top-up, now also powering subscription checkout
- `EMAIL_FROM` defaults to `CMS Bapikir <noreply@avathur.id>` if not set; set it to match your verified Resend sender domain
- `ADMIN_EMAILS` is now a bootstrap list: matching users are upserted into `user_roles` as `admin` on first login
- AI vars are optional; AI features are disabled when keys are not set
- `AI_DEFAULT_PROVIDER` defaults to `openai`; set to `anthropic` for Claude or `google` for Gemini (Google AI Studio — aistudio.google.com — has a genuinely free API tier, no billing required)

## Supabase Dashboard Setup

### 1. Redirect URLs

Add these under **Authentication > URL Configuration**:

```
http://localhost:3000/auth/confirm
http://localhost:3000/auth/update-password
```

Production equivalents:

```
https://your-domain.com/auth/confirm
https://your-domain.com/auth/update-password
```

Why `/auth/confirm` is the central callback:
- Email verification links land here
- Magic Link emails land here
- OAuth (Google) redirects here
- Password reset still uses `/auth/update-password` directly

### 2. Google OAuth

1. Enable Google provider under **Authentication > Providers > Google**
2. Add Google Client ID and Secret (from [Google Cloud Console](https://console.cloud.google.com))
3. Copy the Supabase callback URL and add it to your Google OAuth app's **Authorized redirect URIs**

### 3. Apply Database Migrations

```bash
# Option A: Supabase CLI
npx supabase db push

# Option B: Paste each file manually in Supabase dashboard SQL editor (in order)
# supabase/migrations/20260316000001_create_profiles.sql
# supabase/migrations/20260316000002_create_subscriptions.sql
# supabase/migrations/20260316000003_create_payments.sql
# supabase/migrations/20260316000004_create_waitlist.sql
# supabase/migrations/20260316000005_create_ai_usage.sql
# supabase/migrations/20260317000006_add_admin_roles_and_billing_hardening.sql
```

## Manual Transfer Payment Setup

There is no third-party payment gateway — subscriptions, `/toko` products, and Koin top-up all use the same manual-transfer flow (MALIYA CENTER policy: no percentage-fee gateway):

1. Fill in `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT`, `NEXT_PUBLIC_PAYMENT_BANK_ACCOUNT_NAME`, `NEXT_PUBLIC_PAYMENT_BANK_NAME`, and optionally `NEXT_PUBLIC_PAYMENT_QRIS_IMAGE`/`NEXT_PUBLIC_PAYMENT_QRIS_LABEL`
2. A user starts checkout at `POST /api/payments`, which creates a `PENDING` payment record and returns your rekening instructions
3. The user uploads proof of transfer (`app/api/payments/bukti-upload-url`, `app/api/payments/konfirmasi`) to the private `bukti-transfer` Supabase Storage bucket
4. An admin reviews and approves/rejects it at `/admin/payments` (`app/api/payments/admin/[id]/route.ts`), which activates the subscription on approval — no webhook involved

## Resend Setup

1. Create a Resend account at [resend.com](https://resend.com)
2. Add and verify your sending domain under **Domains**
3. Generate an API key under **API Keys**
4. Set `RESEND_API_KEY` and `EMAIL_FROM` in `.env.local`

Email templates live in `emails/`. Currently two templates are available:
- `emails/welcome.tsx` — sent on new user signup
- `emails/invoice.tsx` — sent after a successful payment

Call `sendEmail()` from `lib/email.ts` to send any React Email template.

## Admin Dashboard

The admin page at `/admin` shows:
- Total revenue from `PAID` payments
- Active subscription count
- Paid plan count
- Paginated payments table

Access is controlled by `user_roles`. `ADMIN_EMAILS` is only used to bootstrap initial admin role assignments.

## Common Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run env:check` | Validate required and optional environment variables |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server after build |
| `npm run lint` | Run ESLint across the repo |
| `npm run typecheck` | Run TypeScript checks without emitting output |
| `npm run test` | Run the full automated test suite once |
| `npm run test:watch` | Run the test suite in watch mode |
| `npm run e2e` | Run Playwright smoke tests |

## Local Development Flow

1. Copy `.env.example` to `.env.local`
2. Turn off any unused features by setting the related `NEXT_PUBLIC_ENABLE_*` flags to `false`
3. Fill in the env vars required by the features you kept enabled
4. Run `npm run env:check` to confirm which enabled features are ready vs still in fallback mode
5. Run `npm run dev`
6. Open `http://localhost:3000`
7. Test the routes you actually kept enabled

## Deployment Notes

- `app/layout.tsx` builds `metadataBase` from `VERCEL_URL` when available, otherwise falls back to `http://localhost:3000`
- The app uses `next/font/google` for Geist — production build requires network access the first time
- Run `npx playwright install chromium` once before the first local `npm run e2e`
- Vercel defaults work out of the box with no extra config (see the Vercel section below)

## Deploying to Vercel

Simplest path — push to Git, connect the repo in Vercel, fill in the same env vars as `.env.local` in the Vercel dashboard (Settings → Environment Variables), deploy. Next.js 16 App Router is fully supported with no extra configuration.

## Deploying to a VPS (nginx + PM2)

Tested and proven working (avathur.id itself runs this way). Requires a VPS with Node.js, nginx, and PM2 already installed.

### 1. Build & run via PM2

```bash
npm install
npm run build

APP_CWD=/var/www/your-app APP_PORT=3000 APP_URL=https://yourdomain.com \
  pm2 start ecosystem.config.cjs
pm2 save
```

`ecosystem.config.cjs` at the repo root intentionally doesn't hardcode a path or domain — fill them in via env vars at start time (see example above). `APP_NAME` is optional if you want a custom PM2 process name (default: `cms-bapikir`).

### 2. nginx config

Use `deploy/avathurid-nginx.conf` as a starting point — swap `avathur.id`/`www.avathur.id` and the SSL cert paths for your own domain, and match the proxy port (`127.0.0.1:3003`) to the `APP_PORT` you used in step 1.

**Line to NOT remove:** `proxy_buffer_size 128k;` inside the `location /` block. Without it, nginx can return a **502 Bad Gateway** ("upstream sent too big header") once the Supabase session cookie grows large enough — this is a real bug that hit avathur.id (23 Jul) and took hours to diagnose. Do not enable `proxy_buffering` (leave it `off`) — that would break streaming responses on the AI routes (`app/api/ai/chat`, `app/api/ai/generate`).

### 3. SSL

```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

⚠️ **If the server uses a hosting panel (aaPanel/cPanel/etc.):** these panels often run their own separate nginx process apart from the regular system nginx (`/etc/nginx/`) — two distinct nginx processes that can easily collide over ports 80/443. Before touching nginx or running certbot directly, check `ps aux | grep nginx` first — if more than one master process shows up, figure out which one actually holds the public ports before changing anything. If there's a panel installed, requesting SSL through its own menu is usually safer than running `certbot --nginx` manually.

### Common Troubleshooting

| Symptom | Likely Cause | Check |
|:--------|:--------------|:------|
| 502 Bad Gateway, intermittent | `proxy_buffer_size` too small | `tail -f /var/log/nginx/error.log`, look for "upstream sent too big header" |
| Site unreachable but the server is up | Local DNS cache (browser/OS), not the server | Try from another device/network; if that works, it's a local cache — `ipconfig /flushdns` (Windows) |
| nginx `bind() failed: Address already in use` | Two nginx processes fighting over the same port | `ps aux | grep nginx`, stop one of them, don't blindly `nginx -s reload` |
| PM2 app restarting repeatedly (high `↺` in `pm2 list`) | Bug in the app itself, not infra | `pm2 logs <app-name> --lines 100` |
