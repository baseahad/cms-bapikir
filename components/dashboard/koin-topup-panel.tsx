"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { KOIN_BP_PACKAGES } from "@/config/koin";
import { createClient } from "@/lib/supabase/client";
import type { KoinTopupRequest } from "@/lib/data/koin-topup";

type Rekening = {
  bank: string;
  nomor: string;
  atasNama: string;
  qris: string;
};

const rupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value);

export function KoinTopupPanel({
  pendingRequest,
  rekening,
}: {
  pendingRequest: KoinTopupRequest | null;
  rekening: Rekening;
}) {
  const router = useRouter();
  const [creatingId, setCreatingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [proofState, setProofState] = useState({
    bank: pendingRequest?.bank ?? "",
    nama_pengirim: pendingRequest?.nama_pengirim ?? "",
    tanggal_transfer: pendingRequest?.tanggal_transfer ?? "",
  });

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handlePilihPaket(packageId: string) {
    const pkg = KOIN_BP_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) return;

    setCreatingId(packageId);
    try {
      const response = await fetch("/api/koin/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tipe: "bapikir", jumlah: pkg.koin }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Gagal buat permintaan top-up.");
        return;
      }

      toast.success("Permintaan top-up dibuat. Silakan transfer lalu upload bukti.");
      refresh();
    } catch {
      toast.error("Gagal buat permintaan top-up.");
    } finally {
      setCreatingId(null);
    }
  }

  async function handleUploadBukti(file: File) {
    if (!pendingRequest) return;

    setUploading(true);
    try {
      const urlResponse = await fetch("/api/koin/bukti-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: pendingRequest.id,
          fileSize: file.size,
          fileType: file.type,
        }),
      });
      const urlData = await urlResponse.json();

      if (!urlResponse.ok) {
        toast.error(urlData.error ?? "Gagal menyiapkan upload bukti.");
        return;
      }

      const supabase = createClient();
      const { error: uploadError } = await supabase.storage
        .from(urlData.bucket)
        .uploadToSignedUrl(urlData.path, urlData.token, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        });

      if (uploadError) {
        toast.error("Gagal mengunggah bukti transfer.");
        return;
      }

      const confirmResponse = await fetch("/api/koin/konfirmasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          request_id: pendingRequest.id,
          bukti_path: urlData.path,
          ...proofState,
        }),
      });
      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        toast.error(confirmData.error ?? "Gagal konfirmasi top-up.");
        return;
      }

      toast.success("Bukti transfer terkirim. Menunggu verifikasi admin.");
      refresh();
    } catch {
      toast.error("Gagal mengunggah bukti transfer.");
    } finally {
      setUploading(false);
    }
  }

  if (!pendingRequest) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {KOIN_BP_PACKAGES.map((pkg) => (
          <Card key={pkg.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{pkg.label}</CardTitle>
                <span className="text-sm font-semibold text-primary">{pkg.koin.toLocaleString("id-ID")} Bp</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-bold mb-3">{rupiah(pkg.harga)}</p>
              <Button
                onClick={() => handlePilihPaket(pkg.id)}
                disabled={creatingId !== null}
                className="w-full"
              >
                {creatingId === pkg.id ? "Memproses..." : "Top-up"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pendingRequest.bukti_path) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Menunggu Verifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Permintaan top-up {pendingRequest.jumlah.toLocaleString("id-ID")} Bp sedang menunggu verifikasi admin.
            Saldo akan bertambah otomatis setelah disetujui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Transfer {pendingRequest.jumlah.toLocaleString("id-ID")} Bp
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="inline-block text-left bg-muted/30 rounded-lg p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Transfer ke
            </p>
            <p className="font-mono text-sm">{rekening.nomor}</p>
            <p className="text-sm text-muted-foreground">a.n. {rekening.atasNama}</p>
            {rekening.bank && <p className="text-xs text-muted-foreground mt-1">{rekening.bank}</p>}
          </div>
          {rekening.qris && (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Atau scan QRIS
              </p>
              <ImageLightbox src={rekening.qris} alt="QRIS" label="Scan untuk bayar" />
            </div>
          )}
        </div>

        <Separator />

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="grid gap-2">
            <Label htmlFor="proof-bank">Bank pengirim</Label>
            <Input
              id="proof-bank"
              value={proofState.bank}
              onChange={(e) => setProofState((s) => ({ ...s, bank: e.target.value }))}
              placeholder="BCA"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proof-nama">Nama pengirim</Label>
            <Input
              id="proof-nama"
              value={proofState.nama_pengirim}
              onChange={(e) => setProofState((s) => ({ ...s, nama_pengirim: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="proof-tanggal">Tanggal transfer</Label>
            <Input
              id="proof-tanggal"
              type="date"
              value={proofState.tanggal_transfer}
              onChange={(e) => setProofState((s) => ({ ...s, tanggal_transfer: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="proof-file">Bukti transfer (JPG/PNG/PDF, maks 5MB)</Label>
          <Input
            id="proof-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadBukti(file);
            }}
          />
          {uploading && <p className="text-xs text-muted-foreground">Mengunggah...</p>}
        </div>
      </CardContent>
    </Card>
  );
}
