import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { createAuditLog } from "@/lib/data/audit-logs";
import { isAdminUser, setUserRoleForUser } from "@/lib/data/user-roles";
import { adminRoleUpdateRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!(await isAdminUser(user.id, user.email))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const parsed = adminRoleUpdateRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Permintaan role tidak valid." }, { status: 400 });
  }

  if (parsed.data.user_id === user.id && parsed.data.role === "member") {
    return NextResponse.json(
      { error: "Admin tidak bisa menurunkan role akun sendiri." },
      { status: 400 },
    );
  }

  try {
    const { error } = await setUserRoleForUser(parsed.data.user_id, parsed.data.role);
    if (error) {
      return NextResponse.json({ error: "Gagal memperbarui role user." }, { status: 500 });
    }

    await createAuditLog({
      actorEmail: user.email ?? "unknown@user.local",
      actorUserId: user.id,
      description: `Role user ${parsed.data.user_id} diubah menjadi ${parsed.data.role}`,
      metadata: {
        role: parsed.data.role,
        target_user_id: parsed.data.user_id,
      },
      type: "admin.action",
    });
  } catch (error) {
    console.error("admin_role_update_error", error);
    return NextResponse.json(
      { error: "Fitur admin memerlukan konfigurasi server tambahan." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    role: parsed.data.role,
    success: true,
    user_id: parsed.data.user_id,
  });
}
