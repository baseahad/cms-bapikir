import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TemplateBanner } from "@/components/ui/template-banner";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { serviceStatusPageConfig, type ServiceStatus } from "@/config/status-page";

export const metadata = createMetadata({
  title: "Status Layanan — CMS Bapikir",
  description: "Status uptime dan riwayat insiden layanan.",
  path: "/status",
});

const statusMeta: Record<
  ServiceStatus,
  { icon: typeof CheckCircle2; label: string; className: string }
> = {
  operational: { icon: CheckCircle2, label: "Operational", className: "text-green-600 dark:text-green-400" },
  degraded: { icon: AlertTriangle, label: "Degraded", className: "text-yellow-600 dark:text-yellow-400" },
  down: { icon: XCircle, label: "Down", className: "text-destructive" },
};

export default function StatusPage() {
  const { services, incidents, lastUpdated } = serviceStatusPageConfig;
  const allOperational = services.every((s) => s.status === "operational");

  return (
    <>
      <TemplateBanner description="Halaman status layanan — sambungkan ke monitoring nyatamu (uptime checker, incident log) sebelum dipakai serius" />
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Status Layanan</h1>
          <p className="text-muted-foreground">
            {allOperational
              ? "Semua sistem berjalan normal."
              : "Beberapa layanan sedang mengalami gangguan."}
          </p>
          <p className="text-xs text-muted-foreground">Terakhir diperbarui: {lastUpdated}</p>
        </div>

        <Card className="border-border/50 mb-10">
          <CardContent className="pt-4 divide-y">
            {services.map((service) => {
              const meta = statusMeta[service.status];
              const Icon = meta.icon;
              return (
                <div key={service.name} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">{service.name}</p>
                    <p className="text-xs text-muted-foreground">{service.description}</p>
                  </div>
                  <Badge variant="outline" className={`gap-1.5 ${meta.className}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {meta.label}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Separator className="mb-8" />

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Riwayat Insiden</h2>
          {incidents.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada insiden yang tercatat.</p>
          ) : (
            <div className="space-y-3">
              {incidents.map((incident) => (
                <Card key={incident.title} className="border-border/50">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <p className="text-sm font-medium">{incident.title}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {incident.date}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{incident.detail}</p>
                    {incident.resolved && (
                      <Badge variant="outline" className="mt-2 text-green-600 dark:text-green-400">
                        Selesai
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
