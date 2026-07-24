import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { X, Check } from "lucide-react";

const tasks = [
  { task: "Setup payment flow & verifikasi transfer manual", hours: "8+ jam" },
  { task: "Konfigurasi email biar nggak masuk spam", hours: "4+ jam" },
  { task: "Design landing page dari nol", hours: "6+ jam" },
  { task: "Setup authentication & user management", hours: "4+ jam" },
  { task: "SEO tags & meta optimization", hours: "2+ jam" },
  { task: "DNS records & deployment", hours: "3+ jam" },
  { task: "Protected API routes & middleware", hours: "2+ jam" },
];

export function PainPointsSection() {
  return (
    <section className="marketing-section px-4">
      <div className="marketing-section__inner max-w-3xl">
        <div className="mb-10 space-y-3 text-left">
          <Badge
            variant="outline"
            className="marketing-eyebrow text-destructive border-destructive/30"
          >
            Tanpa CMS Bapikir
          </Badge>
          <h2 className="marketing-heading">
            Ini yang bakal kamu hadapi kalau setup dari nol.
          </h2>
          <p className="marketing-copy text-lg">
            Kebanyakan developer stuck di sini. Padahal ini semua belum termasuk bikin
            fitur utama produk kamu.
          </p>
        </div>

        <div className="marketing-table-shell overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Yang Harus Dikerjain</TableHead>
                <TableHead className="text-right font-semibold text-destructive">
                  Waktu Kebuang
                </TableHead>
                <TableHead className="text-right font-semibold text-primary w-28">
                  CMS Bapikir
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((t) => (
                <TableRow key={t.task}>
                  <TableCell className="text-sm">{t.task}</TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-destructive font-medium flex items-center justify-end gap-1">
                      <X className="h-3.5 w-3.5" />
                      {t.hours}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="text-sm text-primary font-medium flex items-center justify-end gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Siap
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-semibold">
                <TableCell>Total</TableCell>
                <TableCell className="text-right text-destructive">29+ jam kebuang</TableCell>
                <TableCell className="text-right text-primary">0 menit</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <p className="marketing-note mt-6 text-center italic text-sm">
          Capek? Sama. Makanya CMS Bapikir dibuat.
        </p>
      </div>
    </section>
  );
}
