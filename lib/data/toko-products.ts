export type TokoProduct = {
  icon: string;
  title: string;
  desc: string;
  price: string;
  label: string;
  href: string;
};

// Katalog toko per-deployment. Template ini sengaja kosong (kosong dulu, isi
// sambil jalan) - tiap deployment isi lewat env var PRODUK_KATALOG_JSON di
// .env.local (gak ke-commit), bukan hardcode di kode, biar repo yang sama
// bisa dipakai buat jual produk sendiri maupun dijual/di-fork ke klien lain
// tanpa bawa-bawa katalog bisnis pemilik sebelumnya. Lihat .env.example.
export function getTokoProducts(): TokoProduct[] {
  const raw = process.env.PRODUK_KATALOG_JSON;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.error("PRODUK_KATALOG_JSON bukan JSON valid — fallback ke katalog kosong.");
    return [];
  }
}
