export type BlogCategory = {
  slug: string;
  nama: string;
  deskripsi: string;
  sub: { slug: string; nama: string; deskripsi: string }[];
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: "isper",
    nama: "ISPER",
    deskripsi: "Islamic Personality / Syakhshiyah Islamiyah — goal akhir, pribadi yang seimbang 4 Hero",
    sub: [
      { slug: "aqliyah-islamiyah", nama: "Aqliyah Islamiyah", deskripsi: "Pola pikir — cara memahami realitas lewat kacamata Islam" },
      { slug: "nafsiyah-islamiyah", nama: "Nafsiyah Islamiyah", deskripsi: "Pola sikap — cara memenuhi kebutuhan sesuai syariat" },
    ],
  },
  {
    slug: "bisnis-syariah",
    nama: "Bisnis & Syariah",
    deskripsi: "Muamalah, adab berbisnis, UKM, dan ekonomi Islam",
    sub: [
      { slug: "muamalah", nama: "Muamalah", deskripsi: "Akad, QRIS, jual-beli, riba" },
      { slug: "adab-berbisnis", nama: "Adab Berbisnis", deskripsi: "Etika dan akhlak dagang" },
      { slug: "ukm-skala", nama: "UKM & Skala", deskripsi: "Strategi UKM, case study" },
      { slug: "ekonomi-islam", nama: "Ekonomi Islam", deskripsi: "Koin, baitul mal, zakat" },
    ],
  },
  {
    slug: "bapikir",
    nama: "Bapikir",
    deskripsi: "Dalil aqli & kerangka berpikir inti brand — bukti rasional kualitas produk Bapikir",
    sub: [
      { slug: "tafkir", nama: "Tafkir", deskripsi: "Proses berpikir, penalaran, kesadaran" },
      { slug: "nizhom", nama: "Nizhom", deskripsi: "Sistem, keteraturan, struktur" },
    ],
  },
  {
    slug: "produktivitas",
    nama: "Produktivitas & Pikir",
    deskripsi: "Cara berpikir, produktivitas, teknologi, dan metode belajar",
    sub: [
      { slug: "cara-berpikir", nama: "Cara Berpikir", deskripsi: "Reformasi, anti-bapikir, framework" },
      { slug: "manajemen-waktu", nama: "Manajemen Waktu", deskripsi: "5 Lingkar, KAMAL, time management" },
      { slug: "belajar", nama: "Belajar", deskripsi: "Metode distilasi, cara baca kitab" },
    ],
  },
  {
    slug: "kehidupan",
    nama: "Kehidupan",
    deskripsi: "Keluarga, kesehatan, refleksi, dan nasihat",
    sub: [
      { slug: "keluarga", nama: "Keluarga", deskripsi: "Parenting, rumah tangga" },
      { slug: "kesehatan", nama: "Kesehatan", deskripsi: "SEAHAD, Sujok, thibbun nabawi" },
      { slug: "refleksi", nama: "Refleksi", deskripsi: "Curhat, insight, pengalaman hidup" },
      { slug: "nasihat", nama: "Nasihat", deskripsi: "Dakwah, tazkiyah, adab" },
    ],
  },
  {
    slug: "digital-marketing",
    nama: "Teknologi & Digital Marketing",
    deskripsi: "Troubleshooting, SEO, dan internet marketing",
    sub: [
      { slug: "troubleshooting", nama: "Troubleshooting", deskripsi: "Perbaikan hardware/software, tips teknis harian" },
      { slug: "seo", nama: "SEO", deskripsi: "Optimasi mesin pencari" },
      { slug: "internet-marketing", nama: "Internet Marketing", deskripsi: "Funnel, iklan, strategi traffic & konversi" },
    ],
  },
  {
    slug: "ai",
    nama: "AI",
    deskripsi: "Kecerdasan buatan — prompting, agentic AI, dan tools",
    sub: [
      { slug: "prompting", nama: "Prompting", deskripsi: "MVP — Mustanir Valuable Prompting, teknik prompt" },
      { slug: "agentic-ai", nama: "Agentic AI", deskripsi: "MAP — Mustanir Agentic Protocol, AI agent seperti MESA" },
      { slug: "ai-tools", nama: "AI Tools", deskripsi: "Review & tutorial tools AI umum" },
    ],
  },
];

// Produk/bisnis (GINK Digital, Seahad, Maliya, AMMA, Tibyan, MESA, dst) SENGAJA
// bukan kategori — kategori itu untuk topik (dipakai sebagai navigasi utama,
// harus sedikit & stabil), produk itu buat tag (bebas ditambah, satu artikel
// bisa relevan ke banyak produk sekaligus, dan produk baru tak perlu bongkar
// struktur kategori). Ini daftar tag produk yang sudah dipakai — tambah di
// sini kalau ada produk/bisnis baru, biar penulisannya konsisten (bukan kadang
// "ginkdigital" kadang "gink-digital" kadang "GINK Digital").
export const PRODUK_TAGS = [
  "ginkdigital",
  "seahad",
  "maliya",
  "amma",
  "tibyan",
  "mesa",
] as const;

export type BlogTier = "free" | "member" | "premium" | "exclusive";

export const BLOG_TIERS: { tier: BlogTier; label: string; icon: string; deskripsi: string }[] = [
  { tier: "free", label: "Gratis", icon: "🟢", deskripsi: "Publik — semua orang bisa baca" },
  { tier: "member", label: "Member", icon: "🟡", deskripsi: "Wajib login (gratis daftar)" },
  { tier: "premium", label: "Premium", icon: "🔒", deskripsi: "Bayar per artikel — 10 koin" },
  { tier: "exclusive", label: "Eksklusif", icon: "💎", deskripsi: "Hanya subscription member" },
];

export function getCategoryBySlug(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((c) => c.slug === slug);
}

export function getCategorySlugs(): string[] {
  return BLOG_CATEGORIES.map((c) => c.slug);
}

export function getTierLabel(tier: string): string {
  const found = BLOG_TIERS.find((t) => t.tier === tier);
  return found ? `${found.icon} ${found.label}` : "🟢 Gratis";
}
