import { NextResponse } from "next/server";
import { hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { deleteMediaRecord } from "@/lib/data/media";

export const dynamic = "force-dynamic";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const { id } = await params;
  const ok = await deleteMediaRecord(id);
  if (!ok) {
    return NextResponse.json({ error: "Gagal menghapus media" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
