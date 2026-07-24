const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const produk = [
  { nama: "Cerita SSD Palsu", slug: "cerita-ssd-palsu", deskripsi: "Pengalaman beli SSD palsu dan pelajarannya.", tipe: "artikel", harga_koin: 5, koin_tipe: "bapikir", status: "published", url_konten: "/blog/cerita-ssd-palsu-dan-perjalanan-upgrade" },
  { nama: "Konsultasi Bisnis Syariah", slug: "konsultasi-bisnis-syariah", deskripsi: "Sesi 1-on-1 60 menit.", tipe: "konsultasi", harga_koin: 50, koin_tipe: "bapikir", status: "published", url_konten: "/konsultasi" },
];

async function seed() {
  const { data, error } = await supabase.from("produk").upsert(produk, { onConflict: "slug" });
  if (error) { console.error("FAIL:", error.message); return; }
  console.log(`OK: ${data.length} produk`);
}
seed();
