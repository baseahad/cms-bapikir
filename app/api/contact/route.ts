import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getFeatureAvailability } from "@/lib/config/features";
import {
  applyRateLimitHeaders,
  createRateLimitResponse,
  getPublicRateLimitConfig,
  takeRateLimit,
} from "@/lib/rate-limit";
import { contactRequestSchema } from "@/lib/validations";
import { siteConfig } from "@/config/site";

export async function POST(req: Request) {
  const rateLimit = await takeRateLimit(getPublicRateLimitConfig("contact", req));
  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit, "Terlalu banyak pesan. Coba lagi nanti.");
  }

  const contactFeature = getFeatureAvailability("contact");
  if (!contactFeature.enabled) {
    return applyRateLimitHeaders(
      NextResponse.json({ error: contactFeature.message }, { status: 503 }),
      rateLimit,
    );
  }

  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM ?? `${siteConfig.name} <noreply@example.com>`;
  const emailTo = process.env.CONTACT_EMAIL;

  if (!emailTo) {
    // Sengaja gak ada fallback ke alamat tertentu di sini — kalau CONTACT_EMAIL
    // gak diisi, pesan kontak dari klien lain bisa nyasar ke inbox yang salah.
    return applyRateLimitHeaders(
      NextResponse.json(
        { error: "Fitur kontak belum dikonfigurasi (CONTACT_EMAIL kosong)." },
        { status: 503 },
      ),
      rateLimit,
    );
  }

  const parsed = contactRequestSchema.safeParse(await req.json());
  if (!parsed.success) {
    return applyRateLimitHeaders(
      NextResponse.json({ error: "Semua field wajib diisi." }, { status: 400 }),
      rateLimit,
    );
  }
  const { name, email, message } = parsed.data;

  const resend = new Resend(resendKey);

  const { error } = await resend.emails.send({
    from: emailFrom,
    to: emailTo,
    replyTo: email,
    subject: `Pesan baru dari ${name} — ${siteConfig.shortName}`,
    text: `Nama: ${name}\nEmail: ${email}\n\nPesan:\n${message}`,
  });

  if (error) {
    return applyRateLimitHeaders(
      NextResponse.json({ error: "Gagal mengirim pesan." }, { status: 500 }),
      rateLimit,
    );
  }

  return applyRateLimitHeaders(NextResponse.json({ success: true }), rateLimit);
}
