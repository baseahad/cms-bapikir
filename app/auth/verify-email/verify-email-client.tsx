"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SupabaseEnvNotice } from "@/components/auth/supabase-env-notice";
import { TemplateBanner } from "@/components/ui/template-banner";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { hasEnvVars } from "@/lib/utils";

export function VerifyEmailClient() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (!hasEnvVars) {
    return (
      <>
        <TemplateBanner description="Halaman verifikasi email — ganti noreply@kilatkoding.com dengan domain email produkmu" />
        <div className="min-h-screen flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full">
            <SupabaseEnvNotice />
          </div>
        </div>
      </>
    );
  }

  async function handleResend() {
    setLoading(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) {
        toast.error("Sesi tidak ditemukan. Coba daftar ulang.");
        return;
      }

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });

      if (error) {
        toast.error("Gagal kirim ulang. Coba beberapa menit lagi.");
        return;
      }

      setSent(true);
      toast.success("Email verifikasi dikirim ulang!");
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <TemplateBanner description="Halaman verifikasi email — ganti noreply@kilatkoding.com dengan domain email produkmu" />
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <div className="max-w-md w-full space-y-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Cek email kamu</h1>
            <p className="text-muted-foreground">
              Kami sudah kirim link verifikasi ke email yang kamu daftarkan. Klik
              link tersebut untuk mengaktifkan akun kamu.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4 text-sm text-muted-foreground space-y-2 text-left">
            <p className="font-medium text-foreground">Tips:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Cek folder Spam atau Promotions</li>
              <li>
                Tambahkan noreply@kilatkoding.com ke kontak untuk mencegah masuk
                spam
              </li>
              <li>Link valid selama 24 jam</li>
            </ul>
          </div>

          {sent ? (
            <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Email verifikasi sudah dikirim ulang.
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Tidak menerima email?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Kirim Ulang Email Verifikasi
              </Button>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Email salah?{" "}
            <a
              href="/auth/sign-up"
              className="text-primary underline underline-offset-4"
            >
              Daftar ulang dengan email berbeda.
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
