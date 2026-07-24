export type RoadmapStatus = "shipped" | "in-progress" | "planned";

export const roadmapPageConfig = {
  items: [
    { title: "Supabase Auth lengkap", description: "Email, Google OAuth, Magic Link, OTP verification", status: "shipped" as RoadmapStatus },
    { title: "Transfer manual (MALIYA CENTER)", description: "Bebas gateway fee-persentase — bukti transfer + admin approve, subscription aktif otomatis", status: "shipped" as RoadmapStatus },
    { title: "Resend + React Email", description: "Email transaksional dengan template Bahasa Indonesia", status: "shipped" as RoadmapStatus },
    { title: "Admin dashboard", description: "Revenue chart, user stats, payment overview", status: "shipped" as RoadmapStatus },
    { title: "MDX Blog system", description: "Blog dengan frontmatter, reading time, tags", status: "shipped" as RoadmapStatus },
    { title: "44 UI Components", description: "shadcn/ui lengkap dengan dark mode", status: "shipped" as RoadmapStatus },
    { title: "Marketing funnel pages", description: "Landing page 10 seksi + waitlist, compare, roadmap, status", status: "shipped" as RoadmapStatus },
    { title: "Subscription management UI", description: "Upgrade/downgrade plan, cancel subscription flow", quarter: "Q2 2026", status: "in-progress" as RoadmapStatus },
    { title: "Team / multi-tenant", description: "Invite anggota tim, role-based access (owner, member, viewer)", quarter: "Q2 2026", status: "in-progress" as RoadmapStatus },
    { title: "API keys management", description: "Create, revoke, scope API keys untuk produk kamu", quarter: "Q2 2026", status: "in-progress" as RoadmapStatus },
    { title: "Onboarding wizard", description: "Multi-step welcome flow untuk increase activation", quarter: "Q2 2026", status: "planned" as RoadmapStatus },
    { title: "Notification system", description: "In-app notification center + real-time dengan Supabase Realtime", quarter: "Q3 2026", status: "planned" as RoadmapStatus },
    { title: "Usage metering", description: "Track dan tampilkan usage per-feature dengan limit indicator", quarter: "Q3 2026", status: "planned" as RoadmapStatus },
    { title: "Referral program", description: "Referral link, earnings tracker, automatic discount", quarter: "Q3 2026", status: "planned" as RoadmapStatus },
    { title: "WhatsApp OTP integration", description: "Verifikasi via WhatsApp untuk pasar Indonesia", quarter: "Q4 2026", status: "planned" as RoadmapStatus },
    { title: "Expo React Native starter", description: "Companion mobile app template dengan shared auth", quarter: "Q4 2026", status: "planned" as RoadmapStatus },
  ],
  lastUpdated: "10 Juli 2026",
};
