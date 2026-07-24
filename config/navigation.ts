export type NavItem = {
  label: string;
  href: string;
  description?: string;
};

export type NavSection = {
  group: string;
  items: NavItem[];
};

export type NavGroup = {
  label: string;
  children: NavSection[];
};

export type NavEntry = NavItem | NavGroup;

export function isNavGroup(entry: NavEntry): entry is NavGroup {
  return "children" in entry;
}

const exploreSections: NavSection[] = [
  {
    group: "Konten",
    items: [
      {
        label: "Blog",
        href: "/blog",
        description: "Artikel, refleksi, dan catatan",
      },
      {
        label: "Tulis dengan AI",
        href: "/tulis",
        description: "AI Scribe — bantu nulis cerita & dokumentasi",
      },
      {
        label: "Arc Kehidupan",
        href: "/arc",
        description: "Timeline perjalanan hidup",
      },
    ],
  },
  {
    group: "Produk & Jasa",
    items: [
      {
        label: "Toko",
        href: "/toko",
        description: "Produk digital & jasa",
      },
      {
        label: "Konsultasi",
        href: "/konsultasi",
        description: "Booking konsultasi & coaching",
      },
      {
        label: "GINK Digital",
        href: "https://ginkdigital.com",
        description: "Web development, SEO, copywriting",
      },
      {
        label: "MESA by Bapikir",
        href: "https://mesa.avathur.id",
        description: "AI pribadi di laptop Anda",
      },
    ],
  },
];

const updateSections: NavSection[] = [
  {
    group: "Lebih Lanjut",
    items: [
      {
        label: "Tentang",
        href: "/about",
        description: "Profil dan latar belakang",
      },
      {
        label: "Kontak",
        href: "/contact",
        description: "Hubungi untuk konsultasi & kerja sama",
      },
    ],
  },
  {
    group: "Legal",
    items: [
      {
        label: "Privasi",
        href: "/privacy",
        description: "Kebijakan privasi",
      },
      {
        label: "Syarat",
        href: "/terms",
        description: "Syarat dan ketentuan",
      },
    ],
  },
];

const authSections: NavSection[] = [
  {
    group: "Akun",
    items: [
      {
        label: "Masuk",
        href: "/auth/login",
        description: "Login ke akun",
      },
      {
        label: "Daftar",
        href: "/auth/sign-up",
        description: "Buat akun baru",
      },
    ],
  },
];

const workspaceSections: NavSection[] = [
  {
    group: "Dashboard",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        description: "Ringkasan aktivitas",
      },
      {
        label: "Koin",
        href: "/dashboard/koin",
        description: "Saldo & top-up Koin Bapikir",
      },
      {
        label: "Pengaturan",
        href: "/dashboard/settings",
        description: "Kelola profil",
      },
    ],
  },
];

export const dashboardNav: NavEntry[] = [
  {
    label: "Dashboard",
    children: workspaceSections,
  },
];

export const marketingNav: NavEntry[] = [
  {
    label: "Blog",
    href: "/blog",
  },
  {
    label: "Tulis",
    href: "/tulis",
  },
  {
    label: "Jelajahi",
    children: exploreSections,
  },
  {
    label: "Lainnya",
    children: updateSections,
  },
  {
    label: "Akun",
    children: [...authSections, ...workspaceSections],
  },
];
