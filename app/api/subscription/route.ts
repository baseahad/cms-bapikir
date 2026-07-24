import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/data/auth";
import {
  cancelSubscriptionAtPeriodEnd,
  resumeSubscription,
  syncExpiredSubscription,
} from "@/lib/data/subscriptions";
import { subscriptionManageRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = subscriptionManageRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Aksi subscription tidak valid." }, { status: 400 });
  }

  try {
    await syncExpiredSubscription(user.id);

    if (parsed.data.action === "cancel") {
      await cancelSubscriptionAtPeriodEnd(user.id);
      return NextResponse.json({ success: true, status: "cancel_at_period_end" });
    }

    await resumeSubscription(user.id);
    return NextResponse.json({ success: true, status: "active" });
  } catch (error) {
    console.error("subscription_manage_error", error);
    return NextResponse.json(
      { error: "Manajemen subscription memerlukan konfigurasi server tambahan." },
      { status: 503 },
    );
  }
}
