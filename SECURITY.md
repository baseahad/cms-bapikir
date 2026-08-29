# Kebijakan Keamanan

_English: to report a security issue, email **lisensi@avathur.id** with the subject
prefix `[SECURITY]`. Please do not open a public issue._

## Melaporkan kerentanan

Kirim email ke **lisensi@avathur.id** dengan subjek diawali `[SECURITY]`.
**Jangan** membuka GitHub issue publik atau menulisnya di pull request — laporan
keamanan ditangani secara privat sampai perbaikan tersedia.

Sertakan sebisanya:

- Versi / commit yang terpengaruh (`git rev-parse HEAD`).
- Langkah reproduksi yang jelas, atau proof-of-concept minimal.
- Dampak yang kamu perkirakan (mis. akses data pengguna lain, eskalasi ke admin,
  eksekusi kode).
- Konfigurasi relevan (runtime, versi Node, provider deploy) bila perlu.

Kamu akan mendapat balasan **paling lambat 3 hari kerja**. Kami akan
mengabari perkembangannya, menyepakati jadwal publikasi, dan mencantumkan
kreditmu bila kamu menghendaki.

## Menemukan rahasia yang ter-commit

Kalau kamu menemukan kredensial, kunci, atau token nyata di dalam repositori atau
riwayat git, **laporkan lokasinya (path + commit), bukan nilainya.** Jangan
menyalin nilai rahasia itu ke email, issue, atau chat.

## Versi yang didukung

Perbaikan keamanan dirilis untuk **rilis terbaru di branch `master`**. Instansi
lama sebaiknya diperbarui ke rilis terbaru untuk menerima patch.

## Di luar cakupan

Hal-hal berikut **bukan** kerentanan keamanan:

- **Melewati atau menonaktifkan gerbang lisensi (BSL).** Source code bersifat
  source-available dan bisa diubah; mekanisme lisensi berfungsi untuk pengikatan
  domain dan pencabutan, **bukan** proteksi salin. Melepas satu baris konstanta
  bukan temuan keamanan.
- Laporan yang mengandalkan kredensial admin yang memang sudah bocor, akses
  fisik ke server, atau konfigurasi `.env` yang keliru di pihak operator.
- Denial-of-service lewat volume permintaan yang besar.
- Rekayasa sosial terhadap pemegang lisensi atau Licensor.
- Output otomatis pemindai tanpa dampak nyata yang bisa ditunjukkan.

## Cakupan

Kode di repositori ini (`baseahad/cms-bapikir`). Layanan pihak ketiga yang
dipakai deployment (Supabase, Resend, penyedia AI, hosting) tunduk pada program
keamanan masing-masing.
