import { getFeatureAvailability } from "@/lib/config/features";
import { ContactForm } from "@/components/contact-form";
import { Separator } from "@/components/ui/separator";
import { Mail, Send } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";

export const metadata = createMetadata({
  title: `Kontak — ${siteConfig.name}`,
  description: `Hubungi ${siteConfig.name} untuk konsultasi, kerja sama, atau diskusi.`,
  path: "/contact",
});

export default function ContactPage() {
  const contactFeature = getFeatureAvailability("contact");
  const displayEmail = process.env.CONTACT_EMAIL ?? "";
  const telegramHandle = siteConfig.links.telegram.replace("https://t.me/", "@");

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Hubungi Saya</h1>
        <p className="text-muted-foreground">
          15 menit konsultasi gratis. Diskusi tentang web, AI, produktivitas,
          atau apapun yang bisa saya bantu.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayEmail && (
          <div className="flex items-start gap-3 rounded-lg border p-4">
            <Mail className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs text-muted-foreground mt-0.5">{displayEmail}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Send className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Telegram</p>
            <p className="text-xs text-muted-foreground mt-0.5">{telegramHandle}</p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Kirim Pesan</h2>
        <ContactForm
          notice={
            contactFeature.enabled
              ? null
              : {
                  description: contactFeature.message,
                  missingEnv: contactFeature.missingEnv,
                  title: contactFeature.title,
                  toggleEnv: contactFeature.toggleEnv,
                }
          }
        />
      </div>
    </div>
  );
}
