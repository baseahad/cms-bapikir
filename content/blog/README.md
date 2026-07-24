# content/blog/ — folder singgah artikel baru

Ini **bukan** lagi sumber yang dibaca situs (blog publik baca dari tabel `blog_posts` di
Supabase lewat `lib/data/blog.ts`). Folder ini sekarang jadi tempat singgah artikel yang
sudah selesai lewat pipeline Nizhom (`E:\03-BISNIS-KERJA\BLOG\CA\SISTEM-CA.md`) — Fase 4:
Publish → avathur.id — sebelum diimpor ke database.

## Alur

1. Artikel selesai ditulis + Revasi (skor SCEAMER ≥ 80%), disimpan sebagai `.md`/`.mdx`
   di sini dengan frontmatter standar (title/description/pubDate/image/category/author).
2. `scripts/check-artikel.mjs` (linter gaya bahasa & fakta) mengecek folder ini secara default.
3. Buka `/admin/blog/tulis` di dashboard → **Impor dari berkas .md/.mdx** → cek isian &
   tab **Pratinjau** → **Terbitkan**.

39 artikel lama (sebelum sistem ini ada) dipindah ke `content/blog.archive/` — sudah
masuk ke `blog_posts` semua per 19 Jul 2026, disimpan di sana cuma sebagai arsip/jejak
tanggal asli, bukan dibaca kode apa pun.
