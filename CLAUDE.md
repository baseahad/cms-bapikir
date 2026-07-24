# CLAUDE.md

Guidance for Claude or other AI coding assistants working in this repository.

## Repository At A Glance

This is a Next.js 16 + Supabase project for CMS Bapikir / avathur.id — a personal site and CMS platform by Avathur Rahman.

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase SSR auth
- `next-themes`

The app already includes authentication screens and a protected route, but it is still mostly starter content rather than a product-specific application.

## Read These First

- [`AGENTS.md`](./AGENTS.md)
- [`docs/README.md`](./docs/README.md)
- [`docs/en/README.md`](./docs/en/README.md)

If you need project details in Indonesian:

- [`docs/id/README.md`](./docs/id/README.md)

## Commands

```bash
npm install
npm run dev
npm run lint
npm run build
npm run start
```

## Environment Variables

Expected variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

# AI (optional)
AI_DEFAULT_PROVIDER=        # "openai", "anthropic", or "google"
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_GENERATIVE_AI_API_KEY=
```

Reference:

- [`.env.example`](./.env.example)

## Important Files

- `app/layout.tsx`: root layout, metadata, theme provider
- `app/(marketing)/page.tsx`: Landing page (Avathur Rahman)
- `app/(dashboard)/dashboard/page.tsx`: authenticated dashboard
- `app/auth/confirm/route.ts`: OTP/OAuth verification route handler
- `lib/supabase/server.ts`: server Supabase client
- `lib/supabase/client.ts`: browser Supabase client
- `lib/supabase/proxy.ts`: auth/session synchronization
- `proxy.ts`: route matcher and request-time proxy entrypoint
- `config/site.ts`: centralized site metadata
- `config/navigation.ts`: nav link definitions
- `lib/payments/midtrans.ts`: Midtrans Snap client and helpers
- `lib/payments/doku.ts`: Doku JOKUL client and helpers
- `lib/email.ts`: Resend + React Email wrapper
- `hooks/use-auth.ts`: client-side auth state hook
- `hooks/use-subscription.ts`: client-side subscription state hook
- `hooks/use-ai-chat.ts`: client-side AI chat hook (wraps `@ai-sdk/react`)
- `lib/ai/provider.ts`: AI model factory (OpenAI/Anthropic via Vercel AI SDK)
- `lib/ai/usage.ts`: token tracking and plan-based usage limits
- `lib/ai/middleware.ts`: auth + usage gating for AI API routes
- `app/api/ai/chat/route.ts`: streaming chat endpoint
- `app/api/ai/generate/route.ts`: one-shot text generation endpoint
- `components/ui/`: installed shadcn/ui primitives (44 total)
- `supabase/migrations/`: SQL migration files

## Working Rules

- Prefer server components by default.
- Use client components only when state, effects, browser APIs, or direct user interaction require them.
- Preserve Supabase auth/session cookie handling unless the task explicitly changes auth architecture.
- Reuse shadcn/ui primitives before adding new base-level UI abstractions.
- Keep changes consistent with the existing Tailwind and CSS variable system.
- Keep TypeScript strictness intact.
- Avoid unnecessary broad refactors in this still-young codebase.

## AI Integration Rules

- Use Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/anthropic`, `@ai-sdk/google`) — not raw SDK clients.
- Use `getModel()` from `lib/ai/provider.ts` instead of instantiating providers directly.
- All AI API routes must use `authorizeAIRequest()` from `lib/ai/middleware.ts` for auth + usage gating.
- Track token usage via `trackUsage()` from `lib/ai/usage.ts`.
- AI features are gated by subscription plan (FREE=0, BASIC=10k, PRO=100k, ULTIMATE=unlimited tokens/month).
- Use `streamText()` for streaming, `generateText()` for one-shot — avoid deprecated `OpenAIStream`/`StreamingTextResponse`.
- Do NOT use `runtime = 'edge'` on AI routes — Node.js runtime is needed for Supabase server clients.

## Documentation Rules

- English docs live in `docs/en`.
- Indonesian docs live in `docs/id`.
- If behavior or structure changes, update both documentation sets when practical.
- Keep both language trees aligned in structure.

## Verification

After meaningful changes, prefer to run:

```bash
npm run lint
```

Also run this when the change can affect app structure, routes, config, or production behavior:

```bash
npm run build
```

## Current Reality

This repository is still in the "foundation setup" stage. Good changes are usually the ones that:

- move the app away from template content toward real product behavior
- preserve the starter's working auth base
- document architectural changes clearly
