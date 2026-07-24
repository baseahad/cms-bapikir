import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground mb-2">404</p>
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Halaman gak ketemu
      </h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Mungkin halaman ini belum dibuat, udah dipindah, atau emang gak pernah
        ada. Kayak SSD 128 GB — kelihatan besar, tapi cepet penuh.
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/">Ke Beranda</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blog">Cari Artikel</Link>
        </Button>
      </div>
    </div>
  );
}
