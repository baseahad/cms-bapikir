# CMS Bapikir — Konteks Penuh

## Peran

CMS Bapikir (Next.js + Supabase) adalah CMS/landing page + sistem payment manual
(transfer bank, bukan gateway fee-persentase) buat pelaku bisnis yang mau kontrol
penuh atas kode dan datanya sendiri.

### Fitur Utama:
1. **Landing page personal** — landing page + blog + AI Scribe
2. **Koin (top-up saldo internal)** — user liat saldo, riwayat, instruksi transfer
3. **Admin dashboard** — approve bukti transfer, kelola user

## Payment System — Transfer Manual (BUKAN Midtrans/Xendit/Doku)

| Aspek | Detail |
|:------|:--------|
| **Akad** | Transfer manual — 0% fee, sesuai syariah |
| **Rekening** | Contoh: BCA 1234567890, BSI, Bank Syariah 0987654321, QRIS — isi rekening asli kamu sendiri via env var (`NEXT_PUBLIC_PAYMENT_*`, lihat `.env.example`) |
| **Flow** | User transfer → upload bukti → admin approve → saldo nambah |
| **Gateway** | ❌ **JANGAN** Midtrans/Xendit/DOKU — fee persentase merugikan sistemik dalam jangka panjang, bukan zatnya haram |

## Koin System
- **Koin Bp** (Bapikir) — universal, lintas protokol
- **Koin Sl** (Skill/Protokol) — per protokol
- User liat saldo + riwayat via Supabase RLS (read-only)

## Status
- ✅ Landing + Blog + Auth + Admin — live
- ✅ Supabase + migrations — up to date
- ✅ Backend top-up: request → bukti → admin approve — lihat migrasi
  `20260723000001_create_koin_topup_requests.sql`. Kredit HANYA lewat
  RPC `approve_koin_topup()` yang dipanggil route admin (`authorizeAdminRequest`).
  Pola: langsung Next.js + Supabase (RLS + security definer RPC),
  sama seperti `beli_produk()`.
- ✅ Top-up UI: `/dashboard/koin` — pilih paket (`config/koin.ts`), lihat
  rekening/QRIS, upload bukti transfer (signed URL ke Supabase Storage bucket
  privat `bukti-transfer`). Gated di belakang feature flag
  `NEXT_PUBLIC_ENABLE_KOIN` (butuh Supabase public env + service role).
- ✅ Admin approve UI: `/admin/koin` — verifikasi bukti transfer, approve/reject.
- ✅ Subscription checkout juga pakai transfer manual, pola sama persis dengan
  Koin: `/api/payments` bikin order PENDING → user upload bukti → admin approve
  di `/admin/payments` → `activateSubscriptionForPayment()` aktifkan plan.
