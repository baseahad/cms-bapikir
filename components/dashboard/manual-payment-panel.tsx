"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ImageLightbox } from "@/components/ui/image-lightbox";
import { createClient } from "@/lib/supabase/client";

type Rekening = {
  bank: string;
  nomor: string;
  atasNama: string;
  qris: string;
};

export function ManualPaymentPanel({
  orderId,
  buktiPath,
  rekening,
}: {
  orderId: string;
  buktiPath: string | null;
  rekening: Rekening;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [proofState, setProofState] = useState({
    bank: "",
    nama_pengirim: "",
    tanggal_transfer: "",
  });

  function refresh() {
    startTransition(() => {
      router.refresh();
    });
  }

  async function handleUploadBukti(file: File) {
    setUploading(true);
    try {
      const urlResponse = await fetch("/api/payments/bukti-upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
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

      const confirmResponse = await fetch("/api/payments/konfirmasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: orderId,
          bukti_path: urlData.path,
          ...proofState,
        }),
      });
      const confirmData = await confirmResponse.json();

      if (!confirmResponse.ok) {
        toast.error(confirmData.error ?? "Gagal konfirmasi pembayaran.");
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

  if (buktiPath) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Menunggu Verifikasi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Bukti transfer sudah diterima dan sedang menunggu verifikasi admin. Plan akan aktif
            otomatis setelah disetujui.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Selesaikan Transfer Manual</CardTitle>
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
