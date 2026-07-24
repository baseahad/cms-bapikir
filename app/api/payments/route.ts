import { NextRequest, NextResponse } from "next/server";
import { getFeatureAvailability } from "@/lib/config/features";
import { createClient } from "@/lib/supabase/server";
import { randomUUID } from "crypto";
import { paymentConfig } from "@/config/payment";
import { getPaidPlan } from "@/config/subscriptions";
import {
  createPaymentRecord,
  getPendingManualPaymentForUser,
} from "@/lib/data/payments";
import { syncExpiredSubscription } from "@/lib/data/subscriptions";
import {
  applyRateLimitHeaders,
  createRateLimitResponse,
  getPaymentRateLimitConfig,
  takeRateLimit,
} from "@/lib/rate-limit";
import { paymentRequestSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const paymentsFeature = getFeatureAvailability("payments");
  if (!paymentsFeature.enabled) {
    return NextResponse.json({ error: paymentsFeature.message }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authData.claims.sub as string;
  const rateLimit = await takeRateLimit(getPaymentRateLimitConfig(userId));

  if (!rateLimit.allowed) {
    return createRateLimitResponse(rateLimit, "Terlalu banyak percobaan pembayaran. Coba lagi nanti.");
  }

  const parsed = paymentRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return applyRateLimitHeaders(
      NextResponse.json(
        { error: "Missing or invalid required field: plan" },
        { status: 400 }
      ),
      rateLimit,
    );
  }

  const planConfig = getPaidPlan(parsed.data.plan);
  if (!planConfig) {
    return applyRateLimitHeaders(
      NextResponse.json({ error: "Plan tidak tersedia." }, { status: 400 }),
      rateLimit,
    );
  }

  await syncExpiredSubscription(userId);

  // Satu order transfer-manual pending per user pada satu waktu — kalau ada,
  // kembalikan yang lama supaya user tidak bikin order ganda yang membingungkan
  // saat verifikasi bukti transfer.
  const existingPending = await getPendingManualPaymentForUser(userId);
  if (existingPending) {
    return applyRateLimitHeaders(
      NextResponse.json({
        orderId: existingPending.external_id,
        provider: "manual",
        rekening: {
          atas_nama: paymentConfig.bankAccountName,
          bank: paymentConfig.bankName,
          nomor: paymentConfig.bankAccountNumber,
          qris: paymentConfig.qrisImage,
        },
      }),
      rateLimit,
    );
  }

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  const orderId = `KK-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`;

  let insertError: { message?: string } | null = null;

  try {
    ({ error: insertError } = await createPaymentRecord({
      amount: planConfig.price,
      currency: "IDR",
      external_id: orderId,
      items: planConfig.items,
      plan: planConfig.plan,
      provider: "MANUAL",
      status: "PENDING",
      subscription_id: subscription?.id ?? null,
      user_id: userId,
    }));
  } catch (error) {
    console.error("Payment service is not configured:", error);
    return applyRateLimitHeaders(
      NextResponse.json(
        { error: "Payment service not configured" },
        { status: 503 },
      ),
      rateLimit,
    );
  }

  if (insertError) {
    console.error("Failed to create payment record:", insertError);
    return applyRateLimitHeaders(
      NextResponse.json(
        { error: "Failed to create payment record" },
        { status: 500 }
      ),
      rateLimit,
    );
  }

  return applyRateLimitHeaders(
    NextResponse.json({
      orderId,
      provider: "manual",
      rekening: {
        atas_nama: paymentConfig.bankAccountName,
        bank: paymentConfig.bankName,
        nomor: paymentConfig.bankAccountNumber,
        qris: paymentConfig.qrisImage,
      },
    }),
    rateLimit,
  );
}
