"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FeatureNotice } from "@/components/config/feature-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type ContactFormNotice = {
  description: string;
  missingEnv: string[];
  title: string;
  toggleEnv?: string;
} | null;

export function ContactForm({ notice = null }: { notice?: ContactFormNotice }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const disabled = Boolean(notice);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Gagal mengirim pesan.");
        return;
      }

      setDone(true);
      toast.success("Pesan terkirim! Kami akan balas secepatnya.");
    } catch {
      toast.error("Terjadi kesalahan. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center space-y-2">
        <p className="font-medium">Pesan terkirim!</p>
        <p className="text-sm text-muted-foreground">
          Terima kasih sudah menghubungi kami. Kami akan balas dalam 1–2 hari kerja.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {notice ? (
        <FeatureNotice
          description={notice.description}
          missingEnv={notice.missingEnv}
          title={notice.title}
          toggleEnv={notice.toggleEnv}
        />
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Nama</Label>
          <Input id="name" name="name" placeholder="Nama kamu" required disabled={disabled} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="nama@domain.com" required disabled={disabled} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="message">Pesan</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Ceritakan apa yang ingin kamu tanyakan atau sampaikan..."
          rows={5}
          required
          disabled={disabled}
        />
      </div>
      <Button type="submit" disabled={loading || disabled} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {disabled ? "Form Kontak Belum Aktif" : "Kirim Pesan"}
      </Button>
    </form>
  );
}
