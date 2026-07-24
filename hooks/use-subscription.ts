"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "./use-auth";
import type { Row } from "@/types/database";

type Subscription = Row<"subscriptions">;

export function useSubscription() {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const userId = user.id;

    async function loadSubscription() {
      try {
        const { data } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", userId)
          .single();

        setSubscription(data);
      } catch {
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }

    void loadSubscription();
  }, [user, authLoading]);

  const isPro = subscription?.plan === "PRO" || subscription?.plan === "ULTIMATE";
  const isActive = subscription?.status === "ACTIVE";

  return { subscription, loading, isPro, isActive };
}
