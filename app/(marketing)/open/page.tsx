import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TemplateBanner } from "@/components/ui/template-banner";
import { Check, CreditCard, Star, TrendingUp, Users } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { openStartupConfig } from "@/config/open-startup";

export const metadata = createMetadata({
  title: "Open Startup — CMS Bapikir",
  description: "Metrik bisnis dan progres milestone secara transparan.",
  path: "/open",
});

const statIcons = {
  CreditCard,
  Star,
  TrendingUp,
  Users,
} as const;

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function OpenStartupPage() {
  const { stats, milestones, monthlyRevenue, lastUpdated } = openStartupConfig;

  return (
    <>
      <TemplateBanner description="Halaman open startup — transparansi metrik bisnis, isi dengan data produkmu sendiri" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Open Startup</h1>
          <p className="text-muted-foreground">
            Kami transparan soal angka. Berikut metrik bisnis kami secara real-time.
          </p>
          <p className="text-xs text-muted-foreground">Terakhir diperbarui: {lastUpdated}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-12">
          {stats.map((stat) => {
            const Icon = statIcons[stat.icon];
            return (
              <Card key={stat.label} className="border-border/50">
                <CardHeader className="pb-1 flex flex-row items-center justify-between space-y-0">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs mt-1 ${stat.positive ? "text-green-600 dark:text-green-400" : "text-muted-foreground"}`}>
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Separator className="mb-10" />

        <div className="mb-12 space-y-4">
          <h2 className="text-lg font-semibold">Pendapatan Bulanan (MRR)</h2>
          <Card className="border-border/50">
            <CardContent className="pt-4 divide-y">
              {monthlyRevenue.map((row) => (
                <div key={row.month} className="flex items-center justify-between py-2 first:pt-0 last:pb-0">
                  <span className="text-sm text-muted-foreground">{row.month}</span>
                  <span className="text-sm font-medium">{formatRupiah(row.mrr)}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Milestone</h2>
          <div className="space-y-2">
            {milestones.map((milestone) => (
              <div key={milestone.text} className="flex items-start gap-3 text-sm">
                <div
                  className={`mt-0.5 h-4 w-4 rounded-full flex-shrink-0 flex items-center justify-center ${
                    milestone.done ? "bg-primary text-primary-foreground" : "border border-muted-foreground/40"
                  }`}
                >
                  {milestone.done && <Check className="h-3 w-3" />}
                </div>
                <div>
                  <span className={milestone.done ? "" : "text-muted-foreground"}>{milestone.text}</span>
                  <span className="text-xs text-muted-foreground ml-2">{milestone.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
