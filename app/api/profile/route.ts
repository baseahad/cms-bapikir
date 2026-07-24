import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { createAuditLog } from "@/lib/data/audit-logs";
import { getProfileForCurrentUser, updateProfileForUser } from "@/lib/data/profiles";
import { deleteAvatarObject } from "@/lib/storage/avatars";
import { profileUpdateRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = profileUpdateRequestSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Profil tidak valid." }, { status: 400 });
  }

  const fullName = parsed.data.full_name?.trim() || null;
  const avatarPath = parsed.data.avatar_path?.trim() || null;
  const avatarUrl = parsed.data.avatar_url?.trim() || null;
  const sapaan = parsed.data.sapaan?.trim() || null;
  const previousProfile = await getProfileForCurrentUser(user.id);

  try {
    const { error } = await updateProfileForUser(user.id, {
      avatar_path: avatarPath,
      avatar_url: avatarUrl,
      full_name: fullName,
    });

    if (error) {
      return NextResponse.json({ error: "Gagal memperbarui profil." }, { status: 500 });
    }

    if (
      previousProfile?.avatar_path &&
      previousProfile.avatar_path !== avatarPath
    ) {
      try {
        await deleteAvatarObject(previousProfile.avatar_path);
      } catch (error) {
        console.error("avatar_cleanup_error", error);
      }
    }

    await createAuditLog({
      actorEmail: user.email ?? "unknown@user.local",
      actorUserId: user.id,
      description: "Profil pengguna diperbarui",
      metadata: {
        has_avatar_path: Boolean(avatarPath),
        has_avatar_url: Boolean(avatarUrl),
        has_full_name: Boolean(fullName),
      },
      type: "profile.update",
    });
  } catch (error) {
    console.error("profile_update_error", error);
    return NextResponse.json(
      { error: "Fitur profil memerlukan konfigurasi server tambahan." },
      { status: 503 },
    );
  }

  return NextResponse.json({
    success: true,
    profile: {
      avatar_path: avatarPath,
      avatar_url: avatarUrl,
      full_name: fullName,
    },
  });
}
