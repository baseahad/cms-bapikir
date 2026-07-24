import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateBanner } from "@/components/ui/template-banner";
import { createMetadata } from "@/lib/seo";
import { roadmapPageConfig, type RoadmapStatus } from "@/config/roadmap";

export const metadata = createMetadata({
  title: "Roadmap — CMS Bapikir",
  description: "Fitur yang sudah rilis, sedang dikerjakan, dan direncanakan.",
  path: "/roadmap",
});

const statusGroups: { status: RoadmapStatus; title: string; badgeClass: string }[] = [
  { status: "shipped", title: "Sudah Rilis", badgeClass: "text-green-600 dark:text-green-400" },
  { status: "in-progress", title: "Sedang Dikerjakan", badgeClass: "text-yellow-600 dark:text-yellow-400" },
  { status: "planned", title: "Direncanakan", badgeClass: "text-muted-foreground" },
];

export default function RoadmapPage() {
  const { items, lastUpdated } = roadmapPageConfig;

  return (
    <>
      <TemplateBanner description="Halaman roadmap — isi dengan rencana rilis produkmu sendiri" />
      <div className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-10 space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Roadmap</h1>
          <p className="text-muted-foreground">
            Fitur yang sudah rilis, sedang dikerjakan, dan direncanakan.
          </p>
          <p className="text-xs text-muted-foreground">Terakhir diperbarui: {lastUpdated}</p>
        </div>

        <div className="space-y-10">
          {statusGroups.map((group) => {
            const groupItems = items.filter((item) => item.status === group.status);
            if (groupItems.length === 0) return null;

            return (
              <div key={group.status} className="space-y-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  {group.title} ({groupItems.length})
                </h2>
                <div className="space-y-2">
                  {groupItems.map((item) => (
                    <Card key={item.title} className="border-border/50">
                      <CardContent className="pt-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium">{item.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                        </div>
                        {"quarter" in item && item.quarter && (
                          <Badge variant="outline" className={`whitespace-nowrap ${group.badgeClass}`}>
                            {item.quarter}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
