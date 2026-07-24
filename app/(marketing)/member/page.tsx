import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createMetadata } from "@/lib/seo";
import { QrCode, User, Handshake } from "lucide-react";

export const metadata = createMetadata({
  title: "Member Area — Avathur Rahman",
  description: "Daftar member MESA. Isi data diri, pilih sapaan, dan aktivasi akun Anda.",
  path: "/member",
});

export default function MemberPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <User className="h-8 w-8 mx-auto mb-4 text-primary" />
        <h1 className="text-4xl font-bold mb-2">Daftar Member</h1>
        <p className="text-muted-foreground">
          Isi data diri, pilih sapaan, selesaikan pembayaran.
        </p>
      </div>

      <Separator className="mb-10" />

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Data Diri</CardTitle>
          <CardDescription>
            MESA akan menyapa Anda sesuai pilihan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nama */}
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input id="nama" placeholder="Masukkan nama Anda" />
          </div>

          {/* Sapaan */}
          <div className="space-y-2">
            <Label>Pilihan Sapaan</Label>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex-1 gap-2 h-auto py-4"
                id="sapaan-salam"
              >
                <Handshake className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Assalamu&apos;alaikum</div>
                  <div className="text-xs text-muted-foreground">Untuk yang memilih salam</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2 h-auto py-4"
                id="sapaan-halo"
              >
                <Handshake className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Halo</div>
                  <div className="text-xs text-muted-foreground">Sapaan netral</div>
                </div>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QRIS */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pembayaran</CardTitle>
          <CardDescription>
            Scan QRIS di bawah untuk aktivasi. Tidak ada potongan — biaya flat.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-muted rounded-xl p-8 inline-block">
            <QrCode className="h-48 w-48 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground mt-2">QRIS — scan untuk bayar</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Cara aktivasi:</p>
            <ol className="list-decimal list-inside space-y-1 text-left">
              <li>Isi data diri di atas</li>
              <li>Scan QRIS & transfer sesuai nominal</li>
              <li>Klik tombol &quot;Saya sudah bayar&quot; di bawah</li>
              <li>Admin akan konfirmasi & aktivasi dalam 1x24 jam</li>
            </ol>
          </div>

          <Button className="w-full gap-2" size="lg">
            <Handshake className="h-5 w-5" />
            Saya sudah bayar
          </Button>
        </CardContent>
      </Card>

      {/* Catatan */}
      <div className="text-xs text-muted-foreground text-center space-y-1">
        <p>Dengan mendaftar, Anda menyetujui ketentuan layanan MESA.</p>
        <p>Pertanyaan? Hubungi via WhatsApp yang tertera di halaman kontak.</p>
      </div>
    </main>
  );
}
