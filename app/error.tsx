"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-muted-foreground mb-2">Error</p>
      <h1 className="text-3xl font-bold tracking-tight mb-3">
        Terjadi kesalahan
      </h1>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Ada sesuatu yang nggak beres. Coba lagi atau hubungi support kalau masalah berlanjut.
      </p>
      <Button onClick={reset}>Coba Lagi</Button>
    </div>
  );
}
