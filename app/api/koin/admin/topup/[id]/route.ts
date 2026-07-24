import { NextResponse } from "next/server";
import { hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { approveTopupRequest, rejectTopupRequest } from "@/lib/data/koin-topup";

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

  const { id } = await params;
  const { action, catatan } = await request.json();

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action harus 'approve' atau 'reject'." }, { status: 400 });
  }

  if (action === "approve") {
    const result = await approveTopupRequest(id, auth.userId);
    if (result.status !== "success") {
      return NextResponse.json({ error: `Gagal approve: ${result.status}` }, { status: 409 });
    }
    return NextResponse.json({ status: "approved", saldo_setelah: result.saldo_setelah });
  }

  const result = await rejectTopupRequest(id, auth.userId, catatan || "");
  if (result.status !== "success") {
    return NextResponse.json({ error: `Gagal reject: ${result.status}` }, { status: 409 });
  }
  return NextResponse.json({ status: "rejected" });
}
