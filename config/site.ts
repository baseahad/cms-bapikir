// Ganti semua nilai di bawah ini dengan identitas bisnis/personal kamu sendiri
// sebelum deploy. Ini config branding pusat — dipakai di layout, metadata, JSON-LD, dst.
export const siteConfig = {
  name: "Nama Anda",
  shortName: "namadomain.id",
  description:
    "Deskripsi singkat tentang siapa kamu dan apa yang kamu tawarkan ke audiens kamu.",
  tagline: "Tagline singkat yang mewakili brand kamu",
  motto: "Motto atau kutipan singkat yang jadi prinsip kamu.",
  url: "https://namadomain.id",
  links: {
    github: "https://github.com/namaakun",
    telegram: "https://t.me/namaakun",
    linkedin: "https://linkedin.com/in/namaakun",
  },
};

export type SiteConfig = typeof siteConfig;
