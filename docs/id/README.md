# Dokumentasi Proyek

Folder ini mendokumentasikan kondisi repository saat ini: sebuah boilerplate SaaS Next.js yang production-ready untuk developer Indonesia dengan auth, payment, email, AI, blog, test, dan CI yang sudah saling terhubung.

Repository ini awalnya memang berasal dari starter resmi Supabase `with-supabase`, tetapi sekarang sudah berkembang menjadi app CMS Bapikir lengkap beserta docs, integrasi, dan workflow-nya.

## Mulai Dari Sini

- [Kondisi Saat Ini](./current-state.md): Ringkasan tingkat tinggi tentang isi repo saat ini.
- [Setup dan Pengembangan](./setup-and-development.md): Setup lokal, environment variable, command, dan langkah verifikasi.
- [Arsitektur](./architecture.md): Struktur aplikasi, peta route, model render, dan sistem styling.
- [Supabase dan Auth](./supabase-auth.md): Cara kerja client Supabase, refresh session, dan alur autentikasi saat ini.
- [Inventaris Source](./inventory.md): Referensi file-file penting yang saat ini ada di project.

## Snapshot Singkat

- Framework: Next.js App Router
- Bahasa: TypeScript
- Styling: Tailwind CSS + CSS variables
- UI system: shadcn/ui dengan style `new-york`
- Integrasi auth dan backend: Supabase SSR + browser client
- Dukungan tema: `next-themes`
- Integrasi AI: Vercel AI SDK (OpenAI + Anthropic)
- Git remote: `git@github.com:baseahad/cms-bapikir.git` (fork dari boilerplate KilatKoding, `galpratama/kilatkoding-src`, lalu dikustomisasi)

## Cakupan Aplikasi Saat Ini

Aplikasi saat ini sudah memiliki:

- Marketing funnel lengkap, auth flows, dashboard, billing, dan admin
- Supabase SSR auth dengan email/password, Google OAuth, dan Magic Link
- Flow pembayaran transfer manual (kebijakan MALIYA CENTER: tanpa gateway fee-persentase) dengan upload bukti dan approval admin
- Resend + React Email dalam Bahasa Indonesia
- Blog berbasis database (tabel `blog_posts`, `lib/data/blog.ts`) dengan editor admin di `/admin/blog/tulis` — bisa impor berkas `.md`/`.mdx` (isi judul/deskripsi/konten/kategori/tag otomatis dari frontmatter) dan toggle Tulis/Pratinjau yang me-render lewat pipeline MDX yang sama dengan tampilan publik
- Route AI, automated test (Vitest)
- Fondasi SEO seperti metadata per-halaman, canonical URL, Open Graph/Twitter card, JSON-LD, sitemap, dan robots

Aplikasi ini masih belum mencakup semua item roadmap. Belum ada CI sama sekali (tak ada `.github/workflows/` — `npm run build`/`lint`/`typecheck`/`test` wajib dijalankan manual sebelum deploy). Generated database types, provider email tambahan (Sumopod/Mailketing), self-serve subscription management, dan dukungan team/multi-tenant masih pending. Supabase sudah live & di-deploy (17 migrasi sudah diterapkan) — ini BUKAN item "setup pending" seperti klaim draf dokumen ini sebelumnya.
