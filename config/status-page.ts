export type ServiceStatus = "operational" | "degraded" | "down";

export const serviceStatusPageConfig = {
  incidents: [
    {
      date: "10 Mar 2026",
      detail:
        "Resend mengalami degradasi selama ~45 menit. Semua email terkirim setelah pemulihan.",
      resolved: true,
      title: "Email pengiriman lambat — diselesaikan",
    },
  ],
  lastUpdated: "10 Juli 2026",
  services: [
    { name: "Website", description: "kilatkoding.com", status: "operational" as ServiceStatus },
    { name: "Autentikasi", description: "Login, register, OAuth", status: "operational" as ServiceStatus },
    { name: "Database", description: "Supabase Postgres", status: "operational" as ServiceStatus },
    { name: "Email", description: "Resend transactional email", status: "operational" as ServiceStatus },
    { name: "Payment — Transfer Manual", description: "Verifikasi bukti transfer (MALIYA CENTER)", status: "operational" as ServiceStatus },
    { name: "CDN & Hosting", description: "Vercel Edge Network", status: "operational" as ServiceStatus },
    { name: "API", description: "REST API endpoints", status: "operational" as ServiceStatus },
  ],
};
