import { NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import {
  applyRateLimitHeaders,
  createRateLimitResponse,
  getPublicRateLimitConfig,
  takeRateLimit,
} from "@/lib/rate-limit";
import { createClient } from "@/lib/supabase/server";
import { waitlistRequestSchema } from "@/lib/validations";
import { siteConfig } from "@/config/site";

// Kalau ada gerbang unduh/landing di origin lain yang perlu manggil endpoint
// ini lintas-domain, tambahin ke NEXT_PUBLIC_WAITLIST_EXTRA_ORIGINS
// (comma-separated). Origin situs sendiri (siteConfig.url) selalu diizinkan.
const extraOrigins = (process.env.NEXT_PUBLIC_WAITLIST_EXTRA_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const ALLOWED_ORIGINS = new Set([siteConfig.url, ...extraOrigins]);

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    Vary: "Origin",
  };
}

// Helper rate-limit mengembalikan Response biasa, bukan NextResponse —
// generic supaya tipe aslinya tetap terjaga.
function withCors<T extends Response>(res: T, origin: string | null): T {
  for (const [k, v] of Object.entries(corsHeaders(origin))) {
    res.headers.set(k, v);
  }
  return res;
}

export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.has(origin)) {
    return new NextResponse(null, { status: 403 });
  }
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders(origin),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

export async function POST(req: Request) {
  const origin = req.headers.get("origin");

  const rateLimit = await takeRateLimit(getPublicRateLimitConfig("waitlist", req));
  if (!rateLimit.allowed) {
    return withCors(
      createRateLimitResponse(rateLimit, "Terlalu banyak pendaftaran. Coba lagi nanti."),
      origin,
    );
  }

  const waitlistFeature = getFeatureAvailability("waitlist");
  if (!waitlistFeature.enabled) {
    return withCors(
      applyRateLimitHeaders(
        NextResponse.json({ error: waitlistFeature.message }, { status: 503 }),
        rateLimit,
      ),
      origin,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return withCors(
      applyRateLimitHeaders(
        NextResponse.json({ error: "Permintaan tidak dikenali." }, { status: 400 }),
        rateLimit,
      ),
      origin,
    );
  }

  const parsed = waitlistRequestSchema.safeParse(body);
  if (!parsed.success) {
    return withCors(
      applyRateLimitHeaders(
        NextResponse.json(
          { error: parsed.error.issues[0]?.message ?? "Data tidak valid." },
          { status: 400 },
        ),
        rateLimit,
      ),
      origin,
    );
  }
  const { email, name, wa } = parsed.data;

  const supabase = await createClient();

  const { error } = await supabase.from("waitlist").insert({ email, name, wa });

  if (error) {
    if (error.code === "23505") {
      return withCors(
        applyRateLimitHeaders(
          NextResponse.json({ error: "Email sudah terdaftar." }, { status: 409 }),
          rateLimit,
        ),
        origin,
      );
    }
    return withCors(
      applyRateLimitHeaders(
        NextResponse.json({ error: "Gagal mendaftar. Coba lagi." }, { status: 500 }),
        rateLimit,
      ),
      origin,
    );
  }

  return withCors(applyRateLimitHeaders(NextResponse.json({ success: true }), rateLimit), origin);
}
