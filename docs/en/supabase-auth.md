# Supabase And Auth

## Overview

CMS Bapikir uses Supabase for authentication, session handling, and database. The auth system supports three sign-in methods:

- **Email/password** — standard credentials flow
- **Google OAuth** — one-click sign-in via Google
- **Magic Link** — passwordless, email-based login

All methods share the same session mechanism: cookie-based auth through `@supabase/ssr`, available across the App Router on both server and client.

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-or-anon-key
```

## Supabase Client Factories

### Browser Client

File: `lib/supabase/client.ts`

Used by all interactive auth forms (login, sign up, password reset). Creates a browser client with `createBrowserClient`.

### Server Client

File: `lib/supabase/server.ts`

Used by server components and route handlers. Creates a request-scoped client via `createServerClient`, reads/writes cookies through `next/headers`. Never reused globally.

### Proxy Session Updater

File: `lib/supabase/proxy.ts`

Runs at request time via `proxy.ts`:

1. Creates a server-side Supabase client bound to request cookies
2. Calls `supabase.auth.getClaims()` to refresh the session
3. Redirects to `/auth/login` if the request targets a protected route and no session exists
4. Returns a response with synchronized auth cookies

## Required Supabase Dashboard Configuration

### Redirect URLs

Add these to **Authentication > URL Configuration** in your Supabase dashboard:

**Local development:**
```
http://localhost:3000/auth/confirm
http://localhost:3000/auth/update-password
```

**Production:**
```
https://your-domain.com/auth/confirm
https://your-domain.com/auth/update-password
```

### Google OAuth Setup

1. Go to **Authentication > Providers > Google**
2. Enable Google provider
3. Add your Google Client ID and Client Secret (from Google Cloud Console)
4. Copy the Supabase callback URL shown and add it to your Google OAuth app's authorized redirect URIs

## Auth Flows

### Sign In

Component: `components/login-form.tsx`

The login form has three options on a single card:

**Google OAuth:**
- Calls `supabase.auth.signInWithOAuth({ provider: 'google' })`
- Redirects to `${origin}/auth/confirm` on return

**Password tab:**
- Collects email + password
- Calls `supabase.auth.signInWithPassword()`
- Redirects to `/dashboard` on success

**Magic Link tab:**
- Collects email only
- Calls `supabase.auth.signInWithOtp()` with `emailRedirectTo: ${origin}/auth/confirm`
- Shows inline confirmation that the link was sent

### Sign Up

Component: `components/sign-up-form.tsx`

Two options:

**Google OAuth:**
- Same flow as sign-in via Google; Supabase handles new vs. existing accounts

**Email/password:**
- Collects email, password, and repeat password
- Client-side password match check before calling `supabase.auth.signUp()`
- `emailRedirectTo` points to `/auth/confirm`
- Redirects to `/auth/sign-up-success` on submission

### Forgot Password

Component: `components/forgot-password-form.tsx`

- Calls `supabase.auth.resetPasswordForEmail()`
- `redirectTo` set to `${origin}/auth/update-password`
- Shows inline success state after email is sent

### Update Password

Component: `components/update-password-form.tsx`

- Collects new password
- Calls `supabase.auth.updateUser({ password })`
- Redirects to `/dashboard` on success

### Logout

Component: `components/logout-button.tsx`

- Calls `supabase.auth.signOut()`
- Returns the app to unauthenticated state

### Auth Status In The Header

Component: `components/auth-button.tsx`

- Server component
- Calls `supabase.auth.getClaims()`
- Shows user email + logout button when authenticated
- Shows sign-in and sign-up buttons when unauthenticated

## Confirm Route (OTP + OAuth Callback)

File: `app/auth/confirm/route.ts`

All email-based verification (Magic Link, email confirmation, password reset) and OAuth redirects go through this route:

1. Reads `token_hash`, `type`, and optional `next` from query string
2. Calls `supabase.auth.verifyOtp()`
3. Redirects to `next` (defaults to `/`) on success
4. Redirects to `/auth/error` on failure

## Dashboard — Auth-Gated Page

File: `app/(dashboard)/dashboard/page.tsx`

- Server component with `DashboardContent` wrapped in `Suspense`
- Calls `supabase.auth.getClaims()`
- Redirects to `/auth/login` if claims are missing
- Currently shows the authenticated user's email; replace with real application data

## Database Schema (Migrations)

Three tables are defined in `supabase/migrations/`. Apply them before building data-dependent features.

### profiles

```sql
-- auto-created when a user signs up (via trigger)
id uuid references auth.users
full_name text
avatar_url text
```

### subscriptions

```sql
-- auto-created as FREE when a user signs up (via trigger)
user_id uuid references auth.users
plan enum('FREE', 'BASIC', 'PRO', 'ULTIMATE')
status enum('ACTIVE', 'CANCELED', 'PAST_DUE', 'UNPAID')
current_period_start / current_period_end timestamptz
```

### payments

```sql
user_id uuid references auth.users
subscription_id uuid references subscriptions
amount bigint  -- in Rupiah
provider enum('MIDTRANS', 'DOKU', 'MANUAL')  -- MANUAL is the only provider now issued; MIDTRANS/DOKU kept for historical rows
status enum('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'EXPIRED')
external_id text  -- order_id
payment_type text  -- qris, bank_transfer, gopay, etc
bukti_path text  -- proof-of-transfer file path in the private 'bukti-transfer' bucket
bank text
nama_pengirim text
tanggal_transfer date
```

All three tables have RLS enabled with user-scoped `SELECT` policies.

## Applying Migrations

```bash
# Option 1: Supabase CLI
npx supabase db push

# Option 2: Paste SQL manually in Supabase dashboard SQL editor
# Run each file in order: 000001 → 000002 → 000003

# After applying, generate TypeScript types:
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
```

## Current Limitations

- TypeScript types not yet generated (needs live project)
- No service-role or admin-only workflows implemented yet
- No server actions for mutations yet (all auth calls are client-side)
