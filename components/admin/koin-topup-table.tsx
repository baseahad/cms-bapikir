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
import type { KoinTopupRequestForAdmin } from "@/lib/data/koin-topup";

const tipeLabel: Record<KoinTopupRequestForAdmin["tipe"], string> = {
  bapikir: "Bp",
  protokol: "Pt",
};

function formatDateTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function KoinTopupTable({
  requests,
}: {
  requests: KoinTopupRequestForAdmin[];
}) {
  const router = useRouter();
  const [rows, setRows] = useState(requests);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [rejectTarget, setRejectTarget] = useState<KoinTopupRequestForAdmin | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  function removeRow(id: string) {
    setRows((current) => current.filter((r) => r.id !== id));
    router.refresh();
  }

  async function handleApprove(request: KoinTopupRequestForAdmin) {
    if (!confirm(`Setujui top-up ${request.jumlah.toLocaleString("id-ID")} ${tipeLabel[request.tipe]} untuk ${request.email}?`)) {
      return;
    }

    setPendingId(request.id);
    try {
      const res = await fetch(`/api/koin/admin/topup/${request.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal approve top-up.");
        return;
      }

      toast.success("Top-up disetujui, saldo user sudah bertambah.");
      removeRow(request.id);
    } catch {
      toast.error("Gagal approve top-up.");
    } finally {
      setPendingId(null);
    }
  }

  async function handleReject() {
    if (!rejectTarget) return;

    setPendingId(rejectTarget.id);
    try {
      const res = await fetch(`/api/koin/admin/topup/${rejectTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", catatan: rejectReason }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Gagal reject top-up.");
        return;
      }

      toast.success("Permintaan top-up ditolak.");
      removeRow(rejectTarget.id);
      setRejectTarget(null);
      setRejectReason("");
    } catch {
      toast.error("Gagal reject top-up.");
    } finally {
      setPendingId(null);
    }
  }

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Tidak ada permintaan top-up yang menunggu verifikasi.
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
              <TableHead>Jumlah</TableHead>
              <TableHead className="hidden sm:table-cell">Bank / Pengirim</TableHead>
              <TableHead className="hidden md:table-cell">Diajukan</TableHead>
              <TableHead>Bukti</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((request) => (
              <TableRow key={request.id}>
                <TableCell className="text-sm">{request.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {request.jumlah.toLocaleString("id-ID")} {tipeLabel[request.tipe]}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                  {request.bank || "—"}
                  {request.nama_pengirim ? ` · ${request.nama_pengirim}` : ""}
                </TableCell>
                <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                  {formatDateTime(request.created_at)}
                </TableCell>
                <TableCell>
                  {request.bukti_signed_url ? (
                    <a
                      className="text-sm text-primary underline underline-offset-2"
                      href={request.bukti_signed_url}
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
                    disabled={pendingId === request.id || !request.bukti_path}
                    onClick={() => handleApprove(request)}
                    size="sm"
                  >
                    Setujui
                  </Button>
                  <Button
                    disabled={pendingId === request.id}
                    onClick={() => {
                      setRejectTarget(request);
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
            <DialogTitle>Tolak permintaan top-up</DialogTitle>
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
            <Button disabled={pendingId === rejectTarget?.id} onClick={handleReject} variant="destructive">
              Tolak Permintaan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
