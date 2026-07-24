import { Badge } from "@/components/ui/badge";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PAID: "default",
  SUCCESS: "default",
  ACTIVE: "default",
  PENDING: "secondary",
  CANCELED: "secondary",
  REFUNDED: "secondary",
  FAILED: "destructive",
  PAST_DUE: "destructive",
  UNPAID: "destructive",
  EXPIRED: "outline",
};

const statusLabel: Record<string, string> = {
  PAID: "Lunas",
  SUCCESS: "Berhasil",
  ACTIVE: "Aktif",
  PENDING: "Menunggu",
  CANCELED: "Dibatalkan",
  REFUNDED: "Dikembalikan",
  FAILED: "Gagal",
  PAST_DUE: "Terlambat",
  UNPAID: "Belum Bayar",
  EXPIRED: "Kadaluarsa",
};

export function PaymentStatusBadge({
  status,
  showLabel = false,
}: {
  status: string;
  showLabel?: boolean;
}) {
  return (
    <Badge variant={statusVariant[status] ?? "secondary"}>
      {showLabel ? (statusLabel[status] ?? status) : status}
    </Badge>
  );
}
