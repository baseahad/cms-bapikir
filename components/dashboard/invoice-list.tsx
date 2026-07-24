"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { DownloadIcon, ReceiptIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "./payment-status-badge";
import { EmptyState } from "./empty-state";

type Invoice = {
  id: string;
  external_id: string;
  amount: number;
  status: string;
  provider: string;
  paid_at: string | null;
  created_at: string;
};

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function InvoiceList({ limit = 10 }: { limit?: number }) {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setInvoices([]);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("payments")
      .select(
        "id, external_id, amount, status, provider, paid_at, created_at"
      )
      .eq("user_id", user.id)
      .eq("status", "PAID")
      .order("created_at", { ascending: false })
      .limit(limit)
      .then(({ data }) => {
        setInvoices(data ?? []);
        setLoading(false);
      });
  }, [user, limit]);

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <EmptyState
            icon={<ReceiptIcon className="h-6 w-6" />}
            title="Belum ada invoice"
            description="Invoice akan muncul setelah kamu melakukan pembayaran."
          />
        ) : (
          <div className="space-y-3">
            {invoices.map((inv) => (
              <div
                key={inv.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium font-mono">
                    {inv.external_id}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(inv.paid_at ?? inv.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-sm font-semibold">
                      {formatRupiah(inv.amount)}
                    </p>
                    <PaymentStatusBadge status={inv.status} />
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <DownloadIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
