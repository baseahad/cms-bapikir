# Project Documentation

This folder documents the current state of the repository as it exists today: a production-ready Next.js SaaS boilerplate for Indonesian developers with auth, payments, email, AI, blog, tests, and CI already wired together.

The repository originally started from Supabase's `with-supabase` Next.js starter, but it has since been expanded into CMS Bapikir's app, docs, integrations, and workflow conventions.

## Start Here

- [Current State](./current-state.md): High-level snapshot of what is in the repo right now.
- [Setup and Development](./setup-and-development.md): Local setup, environment variables, commands, and verification steps.
- [Architecture](./architecture.md): App structure, route map, rendering model, and styling system.
- [Supabase and Auth](./supabase-auth.md): How Supabase clients, session refresh, and auth flows currently work.
- [Inventory](./inventory.md): File-by-file reference for the important source files in the project.

## Quick Snapshot

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS + CSS variables
- UI system: shadcn/ui with the `new-york` style
- Auth and backend integration: Supabase SSR + browser client
- Theme support: `next-themes`
- AI integration: Vercel AI SDK (OpenAI + Anthropic)
- Git remote: `git@github.com:baseahad/cms-bapikir.git` (forked from the KilatKoding boilerplate, `galpratama/kilatkoding-src`, then customized)

## Scope Of The Current App

The app currently provides:

- A full marketing funnel, auth flows, dashboard, billing, and admin pages
- Supabase SSR auth with email/password, Google OAuth, and Magic Link
- Manual-transfer payment flow (MALIYA CENTER policy: no percentage-fee gateway) with proof upload and admin approval
- Resend + React Email templates in Bahasa Indonesia
- Database-backed blog (`blog_posts` table, `lib/data/blog.ts`) with an admin editor at `/admin/blog/tulis` — supports `.md`/`.mdx` file import (auto-fills title/description/content/category/tags from frontmatter) and a live Write/Preview toggle rendering through the same MDX pipeline as the public page
- AI routes, automated tests (Vitest)
- SEO foundations including per-page metadata, canonical URLs, Open Graph/Twitter cards, JSON-LD, sitemap, and robots

The app still does not include every roadmap item. No CI pipeline exists yet (no `.github/workflows/` — `npm run build`/`lint`/`typecheck`/`test` must be run manually before shipping). Generated database types, extra email providers (Sumopod/Mailketing), self-serve subscription management, and team/multi-tenant support remain pending. Supabase is live and deployed already (17 migrations applied) — this is not a "setup pending" item, unlike what earlier drafts of this doc claimed.
