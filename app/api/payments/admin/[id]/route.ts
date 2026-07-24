import { NextResponse } from "next/server";
import { hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { approveManualPayment, rejectManualPayment } from "@/lib/data/payments";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  // "id" di sini adalah external_id (order id), bukan payments.id — konsisten
  // dengan /order/[id] yang juga dikunci ke external_id.
  const { id } = await params;
  const { action, catatan } = await request.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action harus 'approve' atau 'reject'." }, { status: 400 });
  }

  if (action === "approve") {
    const result = await approveManualPayment(id, auth.userId);
    if (result.status !== "success") {
      return NextResponse.json({ error: `Gagal approve: ${result.status}` }, { status: 409 });
    }
    return NextResponse.json({ currentPeriodEnd: result.currentPeriodEnd, status: "approved" });
  }

  const result = await rejectManualPayment(id, auth.userId, catatan || "");
  if (result.status !== "success") {
    return NextResponse.json({ error: `Gagal reject: ${result.status}` }, { status: 409 });
  }
  return NextResponse.json({ status: "rejected" });
}
