"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type PlanConfig = {
  plan: string;
  amount: number;
  label: string;
  items: { id: string; price: number; quantity: number; name: string }[];
};

export function PaymentButton({ config }: { config: PlanConfig }) {
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: config.plan,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Gagal membuat pembayaran");
        return;
      }

      const data = await res.json();
      window.location.href = `/order/${data.orderId}`;
    } catch {
      toast.error("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePayment} disabled={loading} className="w-full">
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {config.label}
    </Button>
  );
}
