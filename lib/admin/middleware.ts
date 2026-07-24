import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/data/user-roles";

type AdminContext = {
  userId: string;
  email: string;
};

export async function authorizeAdminRequest(): Promise<AdminContext | NextResponse> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getClaims();

  if (authError || !authData?.claims?.sub || !authData.claims.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authData.claims.sub as string;
  const email = authData.claims.email as string;

  if (!(await isAdminUser(userId, email))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return { userId, email };
}
