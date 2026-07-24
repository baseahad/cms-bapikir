import { NextResponse } from "next/server";
import { hasServiceRoleEnv } from "@/lib/supabase/admin";
import { authorizeAdminRequest } from "@/lib/admin/middleware";
import { getAllWaitlistAdmin } from "@/lib/data/waitlist";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await authorizeAdminRequest();
  if (auth instanceof NextResponse) return auth;

  if (!hasServiceRoleEnv) {
    return NextResponse.json({ error: "Service role key not configured" }, { status: 500 });
  }

  const entries = await getAllWaitlistAdmin();
  return NextResponse.json({ entries });
}
