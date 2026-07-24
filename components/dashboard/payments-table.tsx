"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentStatusBadge } from "./payment-status-badge";

type Payment = {
  external_id: string;
  id: string;
  amount: number;
  status: string;
  provider: string;
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
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function PaymentsTable() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setPayments([]);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase
      .from("payments")
      .select("id, external_id, amount, status, provider, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => {
        setPayments(data ?? []);
        setLoading(false);
      });
  }, [user]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Riwayat Pembayaran</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-muted-foreground px-6 pb-6">
            Belum ada riwayat pembayaran.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-mono text-xs">{p.external_id}</TableCell>
                  <TableCell>{formatRupiah(p.amount)}</TableCell>
                  <TableCell className="capitalize text-sm">{p.provider}</TableCell>
                  <TableCell>
                    <PaymentStatusBadge status={p.status} showLabel />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                    {formatDate(p.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
