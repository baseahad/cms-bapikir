"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function forceLogout() {
      // 1. Hapus cookies via API
      await fetch("/api/auth/logout", { method: "POST" });

      // 2. Sign out via Supabase
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
      } catch {}

      // 3. Redirect
      router.push("/auth/login");
    }
    forceLogout();
  }, [router]);

  return (
    <div className="flex min-h-svh items-center justify-center">
      <p className="text-muted-foreground">Keluar...</p>
    </div>
  );
}
