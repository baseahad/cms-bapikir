# Lisensi & Harga CMS Bapikir

CMS Bapikir dirilis di bawah **Business Source License 1.1 (BSL)** — lihat file [`LICENSE`](./LICENSE).
Halaman ini penjelasan sehari-harinya. Kalau ada bentrok antara halaman ini dan file `LICENSE`,
yang berlaku adalah file `LICENSE` (dan `/terms` di situs resmi untuk syarat pembayaran, refund,
tanggung jawab, dan hukum yang berlaku).

## Ringkas

| | |
|---|---|
| **Kodenya terbuka?** | Ya, source-available. Kamu terima seluruh source code — boleh baca, audit, fork, dan modifikasi. |
| **Open source?** | Belum. BSL bukan lisensi open source. Tapi tiap versi **otomatis jadi open source (Apache 2.0) 4 tahun** setelah dirilis. |
| **Gratis untuk apa?** | Development, testing, evaluasi, audit keamanan, demo di lingkungan non-publik. Tanpa perlu beli apa pun. |
| **Kapan wajib bayar?** | Begitu kamu **menjalankannya untuk publik** — website/aplikasi yang bisa diakses orang di luar kamu, karyawan, atau kontraktormu. Itu butuh **license key** dari Avathur Rahman. |
| **Cara bayar** | Transfer manual (MALIYA CENTER). Tanpa gateway fee-persentase. |
| **Kontak lisensi** | lisensi@avathur.id |

## Boleh / Tidak Boleh

**Boleh (tanpa key):**
- Clone repo, baca seluruh kode, audit keamanan.
- Jalankan di `localhost` / server internal untuk belajar, ngoprek, atau menilai sebelum beli.
- Modifikasi kode untuk kebutuhanmu.
- Kontribusi balik (PR) ke repo resmi.

**Butuh key berbayar:**
- Menjalankan CMS Bapikir untuk website yang diakses publik atau klien.
- Memakainya di proyek klien (tunduk pada batas jumlah proyek sesuai tier).

**Tidak boleh sama sekali:**
- Menjual ulang / mendistribusikan source code ini (asli atau modifikasi) sebagai produk boilerplate/template milikmu.
- Menawarkan CMS Bapikir sebagai layanan hosting/SaaS ke pihak ketiga tanpa perjanjian terpisah dengan Licensor.
- Memakai nama, merek, atau logo "CMS Bapikir" / "Bapikir" untuk produk pesaing.

## Tier Lisensi

Harga dikalibrasi ke daya beli Indonesia — jauh di bawah boilerplate Next.js luar
(ShipFast, Makerkit: USD 199–299 sekali bayar). Pembayaran transfer manual via
MALIYA CENTER, tanpa gateway fee-persentase.

| Tier | Untuk | Batas proyek | Harga |
|---|---|---|---|
| **Pribadi** | 1 website milik sendiri | 1 instance produksi | **Rp 490.000** sekali bayar |
| **Studio** | Freelancer / agensi kecil | s.d. 5 proyek klien | **Rp 1.490.000** sekali bayar |
| **Agensi** | Agensi / studio | proyek tidak dibatasi | **Rp 3.900.000 / tahun** |

**Update & support:** 12 bulan update fitur termasuk di semua tier. Setelah itu
aplikasi **tetap berjalan selamanya** untuk versi yang sudah tercakup — perpanjangan
update bersifat opsional: **Rp 250.000/tahun** (Pribadi), **Rp 690.000/tahun** (Studio).
Tier Agensi: update mengikuti masa langganan yang aktif.

> Angka di atas titik awal, bisa disesuaikan lewat pricing page resmi. Diskon
> pengenalan / harga khusus lembaga dakwah non-profit diatur terpisah — hubungi
> lisensi@avathur.id.

## Cara Kerja License Key

1. Beli tier → transfer ke MALIYA CENTER → konfirmasi.
2. Kamu terima **license key** (format `bpk1.<claims>.<signature>`, Ed25519) + invoice via email (Resend).
3. Pasang key di `.env` instance produksi: `BAPIKIR_LICENSE_KEY=...`, lalu restart.
4. Tiap request, middleware (`proxy.ts`) memvalidasi key **offline** (cek signature + `exp` + host). Opsional: cek pencabutan/aktivasi domain **online** — fail-open, non-blocking, cache 1 hari.
5. Tanpa key valid di produksi publik: aplikasi jalan dalam **mode terbatas** — banner + `/admin`, `/checkout`, pembayaran, dan AI (`/tulis`, `/api/ai/*`) dikunci; blog & marketing tetap jalan. Tidak crash. `npm run dev` / host internal tidak butuh key.
6. Masa tenggang: 14 hari fungsi penuh setelah `exp` (lindungi dari telat perpanjang), 72 jam setelah pencabutan.

Implementasi: `lib/license/*` (verifikasi + gerbang), `scripts/license-cli.mjs` (sisi Licensor: `keygen` / `issue` / `verify`), status di `/admin/license`. Endpoint aktivasi/pencabutan berjalan di sisi Licensor (avathur.id), tidak dibundel ke produk.

## Kenapa BSL, bukan proprietary tertutup atau MIT?

- **vs proprietary tertutup (LICENSE.md lama):** pasar dakwah/Muslim sangat mementingkan bisa mengaudit kode — tidak ada backdoor, tidak ada kirim data diam-diam. BSL membuat kode source-available (bisa dibaca & diaudit) tanpa kehilangan hak jual.
- **vs MIT/Apache murni:** kalau gratis total, tidak ada pemasukan untuk merawat produk jangka panjang (target ekosistem: tiap produk jadi mesin nafkah untuk keluarga + dakwah + ilmu).
- **BSL = jalan tengah:** transparan sekarang, otomatis jadi milik umat (Apache 2.0) setelah 4 tahun per versi.

## Hubungan dengan `LICENSE.md` lama

`LICENSE.md` (proprietary "licensed, not sold") **digantikan** oleh file `LICENSE` (BSL) ini
sejak rilis pertama CMS Bapikir di bawah BSL (Agustus 2026). Pembeli lisensi lama tetap
dihormati sesuai syarat saat mereka membeli.
