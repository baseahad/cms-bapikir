"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type SubscriptionAction = "cancel" | "resume";

export function SubscriptionManageButton({
  action,
  label,
  pendingLabel,
  successMessage,
  variant = "outline",
}: {
  action: SubscriptionAction;
  label: string;
  pendingLabel: string;
  successMessage: string;
  variant?: "default" | "outline" | "secondary" | "destructive";
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error ?? "Gagal memperbarui subscription.");
        return;
      }

      toast.success(successMessage);
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Gagal memperbarui subscription.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" variant={variant} onClick={handleClick} disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
