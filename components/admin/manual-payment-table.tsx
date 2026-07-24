"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { planLabels } from "@/config/subscriptions";
import type { ManualPaymentForAdmin } from "@/lib/data/payments";

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function ManualPaymentTable({
  payments,
}: {
  payments: ManualPaymentForAdmin[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(payments);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<ManualPaymentForAdmin | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  function removeRow(externalId: string) {
    setRows((current) => current.filter((r) => r.external_id !== externalId));
    router.refresh();
  }

  async function handleApprove(payment: ManualPaymentForAdmin) {
    if (!confirm(`Setujui pembayaran ${rupiah(payment.amount)} (${planLabels[payment.plan]}) untuk ${payment.email}?`)) {
      return;
    }

    setPendingId(payment.external_id);
    try {
      const res = await fetch(`/api/payments/admin/${payment.external_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal approve pembayaran.");
        return;
      }

      toast.success("Pembayaran disetujui, subscription user sudah aktif.");
      removeRow(payment.external_id);
    } catch {
      toast.error("Gagal approve pembayaran.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;

    setPendingId(rejectTarget.external_id);
    try {
      const res = await fetch(`/api/payments/admin/${rejectTarget.external_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", catatan: rejectReason }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal reject pembayaran.");
        return;
      }

      toast.success("Pembayaran ditolak.");
      removeRow(rejectTarget.external_id);
      setRejectTarget(null);
      setRejectReason("");
    } catch {
      toast.error("Gagal reject pembayaran.");
    } finally {
      setPendingId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Tidak ada pembayaran transfer manual yang menunggu verifikasi.
      </p>
    );
  }

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead className="hidden sm:table-cell">Bank / Pengirim</TableHead>
              <TableHead className="hidden md:table-cell">Diajukan</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell className="text-sm">{payment.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {planLabels[payment.plan]} · {rupiah(payment.amount)}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {payment.bank || "—"}
                  {payment.nama_pengirim ? ` · ${payment.nama_pengirim}` : ""}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {formatDateTime(payment.created_at)}
                </TableCell>
                <TableCell>
                  {payment.bukti_signed_url ? (
                    <a
                      className="text-sm text-primary underline underline-offset-2"
                      href={payment.bukti_signed_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Lihat
                    </a>
                  ) : (
                    <span className="text-sm text-muted-foreground">Belum ada</span>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    disabled={pendingId === payment.external_id || !payment.bukti_path}
                    onClick={() => handleApprove(payment)}
                    size="sm"
                  >
                    Setujui
                  </Button>
                  <Button
                    disabled={pendingId === payment.external_id}
                    onClick={() => {
                      setRejectTarget(payment);
                      setRejectReason("");
                    }}
                    size="sm"
                    variant="outline"
                  >
                    Tolak
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog onOpenChange={(open) => !open && setRejectTarget(null)} open={Boolean(rejectTarget)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tolak pembayaran</DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            <Label htmlFor="reject-reason">Alasan (opsional, akan dilihat user)</Label>
            <Textarea
              id="reject-reason"
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Contoh: bukti transfer tidak sesuai jumlah."
              value={rejectReason}
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setRejectTarget(null)} variant="outline">
              Batal
            </Button>
            <Button disabled={pendingId === rejectTarget?.external_id} onClick={handleReject} variant="destructive">
              Tolak Pembayaran
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
