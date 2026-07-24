/**
 * Seed script — insert produk ke Supabase
 * Run: node seed-produk.js
 */

const { createClient } = require("@supabase/supabase-js");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../../.env.local") });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const produk = [
  {
    nama: "Cerita SSD Palsu",
    slug: "cerita-ssd-palsu",
    deskripsi: "Pengalaman beli SSD palsu dan pelajarannya.",
    tipe: "artikel",
    harga_koin: 5,
    koin_tipe: "bapikir",
    status: "published",
    url_konten: "/blog/cerita-ssd-palsu-dan-perjalanan-upgrade",
  },
  {
    nama: "Panduan Fiqh Aulawiyah",
    slug: "panduan-fiqh-aulawiyah",
    deskripsi: "Prioritas dalam beramal: dharuriyat, hajiyat, tahsiniyat.",
    tipe: "ebook",
    harga_koin: 25,
    koin_tipe: "bapikir",
    status: "published",
    url_konten: null,
  },
  {
    nama: "MESA Desktop — 1 Bulan",
    slug: "mesa-desktop-1-bulan",
    deskripsi: "Akses MESA Desktop selama 1 bulan. 100 koin protokol.",
    tipe: "software",
    harga_koin: 100,
    koin_tipe: "protokol",
    status: "published",
    url_konten: null,
  },
  {
    nama: "Konsultasi Bisnis Syariah",
    slug: "konsultasi-bisnis-syariah",
    deskripsi: "Sesi 1-on-1 konsultasi bisnis syariah 60 menit.",
    tipe: "konsultasi",
    harga_koin: 50,
    koin_tipe: "bapikir",
    status: "published",
    url_konten: "/konsultasi",
  },
];

async function seed() {
  const { data, error } = await supabase.from("produk").upsert(produk, { onConflict: "slug" });
  if (error) {
    console.error("❌", error.message);
  } else {
    console.log(`✅ ${data.length} produk di-seed`);
  }
}

seed();
