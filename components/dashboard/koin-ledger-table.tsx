import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KoinLedgerEntry } from "@/lib/data/koin-topup";

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function describeEntry(entry: KoinLedgerEntry) {
  if (entry.keterangan) return entry.keterangan;
  return entry.mutasi >= 0 ? "Top-up" : `Pembelian${entry.produk ? ` — ${entry.produk}` : ""}`;
}

export function KoinLedgerTable({ entries }: { entries: KoinLedgerEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Belum ada riwayat transaksi.</p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead className="text-right">Mutasi</TableHead>
            <TableHead className="text-right">Saldo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDateTime(entry.created_at)}
              </TableCell>
              <TableCell className="text-sm">{describeEntry(entry)}</TableCell>
              <TableCell
                className={`text-right text-sm font-medium whitespace-nowrap ${
                  entry.mutasi >= 0 ? "text-primary" : "text-destructive"
                }`}
              >
                {entry.mutasi >= 0 ? "+" : ""}
                {entry.mutasi.toLocaleString("id-ID")} Bp
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground whitespace-nowrap">
                {entry.saldo_setelah.toLocaleString("id-ID")} Bp
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
