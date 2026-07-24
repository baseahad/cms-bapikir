"use client";

import { startTransition, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FeatureNotice } from "@/components/config/feature-notice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileAvatar } from "@/components/dashboard/profile-avatar";
import {
  AVATAR_ALLOWED_TYPES,
  AVATAR_BUCKET,
  AVATAR_MAX_BYTES,
  isSupportedAvatarType,
} from "@/lib/storage/avatar-config";
import { createClient } from "@/lib/supabase/client";

export function ProfileForm({
  avatarImageUrl,
  avatarPath,
  avatarUrl,
  editingEnabled,
  email,
  fullName,
  userId,
}: {
  avatarImageUrl: string | null;
  avatarPath: string | null;
  avatarUrl: string | null;
  editingEnabled: boolean;
  email: string;
  fullName: string | null;
  userId: string;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);
  const [formState, setFormState] = useState({
    avatar_path: avatarPath ?? "",
    avatar_url: avatarUrl ?? "",
    full_name: fullName ?? "",
  });
  const displayName = formState.full_name.trim() || email;
  const avatarPreview =
    uploadedPreviewUrl ??
    (formState.avatar_path ? avatarImageUrl : formState.avatar_url || null);

  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedPreviewUrl);
      }
    };
  }, [uploadedPreviewUrl]);

  async function handleAvatarUpload(file: File) {
    if (file.size > AVATAR_MAX_BYTES) {
      toast.error("Ukuran avatar maksimal 2MB.");
      return;
    }

    if (!isSupportedAvatarType(file.type)) {
      toast.error(`Format avatar harus salah satu dari: ${AVATAR_ALLOWED_TYPES.join(", ")}`);
      return;
    }

    setUploadingAvatar(true);

    try {
      const response = await fetch("/api/profile/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileSize: file.size,
          fileType: file.type,
          userId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Gagal menyiapkan upload avatar.");
        return;
      }

      const supabase = createClient();
      const { error } = await supabase.storage.from(AVATAR_BUCKET).uploadToSignedUrl(
        data.path,
        data.token,
        file,
        {
          cacheControl: "3600",
          contentType: file.type,
          upsert: true,
        },
      );

      if (error) {
        toast.error("Gagal mengunggah avatar.");
        return;
      }

      if (uploadedPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(uploadedPreviewUrl);
      }

      setUploadedPreviewUrl(URL.createObjectURL(file));
      setFormState((current) => ({
        ...current,
        avatar_path: data.path,
      }));
      toast.success("Avatar berhasil diunggah. Simpan profil untuk menerapkan.");
    } catch {
      toast.error("Gagal mengunggah avatar.");
    } finally {
      setUploadingAvatar(false);
    }
  }

  function handleAvatarClear() {
    if (uploadedPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(uploadedPreviewUrl);
    }

    setUploadedPreviewUrl(null);
    setFormState((current) => ({
      ...current,
      avatar_path: "",
    }));
    toast.success("Avatar upload dihapus dari profil. Simpan perubahan untuk menerapkan.");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingEnabled) {
      return;
    }
    setPending(true);

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Gagal memperbarui profil.");
        return;
      }

      toast.success("Profil berhasil diperbarui.");
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Gagal memperbarui profil.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit}>
      {!editingEnabled ? (
        <FeatureNotice
          description="Profil tetap bisa dibaca, tapi penyimpanan perubahan butuh SUPABASE_SERVICE_ROLE_KEY."
          missingEnv={["SUPABASE_SERVICE_ROLE_KEY"]}
          title="Edit profil dinonaktifkan"
        />
      ) : null}
      <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <ProfileAvatar
            src={avatarPreview}
            fallback={displayName}
            editable={editingEnabled}
            onUpload={handleAvatarUpload}
          />
          <div className="space-y-1">
            <p className="text-sm font-medium">Avatar</p>
            <p className="text-xs text-muted-foreground">
              Upload JPG, PNG, WebP, atau GIF sampai 2MB. Avatar upload akan diprioritaskan
              dibanding URL manual.
            </p>
          </div>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={handleAvatarClear}
          disabled={!editingEnabled || uploadingAvatar || !formState.avatar_path}
        >
          Hapus Avatar Upload
        </Button>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="profile-email">Email</Label>
        <Input id="profile-email" value={email} disabled readOnly />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="profile-full-name">Nama lengkap</Label>
        <Input
          id="profile-full-name"
          disabled={!editingEnabled}
          value={formState.full_name}
          onChange={(event) =>
            setFormState((current) => ({
              ...current,
              full_name: event.target.value,
            }))
          }
          placeholder="Nama kamu"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="profile-avatar-url">Avatar URL</Label>
        <Input
          id="profile-avatar-url"
          type="url"
          disabled={!editingEnabled}
          value={formState.avatar_url}
          onChange={(event) =>
            setFormState((current) => ({
              ...current,
              avatar_url: event.target.value,
            }))
          }
          placeholder="https://..."
        />
        <p className="text-xs text-muted-foreground">
          URL ini dipakai sebagai fallback jika kamu tidak memakai avatar upload dari storage.
        </p>
      </div>
      <div>
        <Button type="submit" disabled={!editingEnabled || pending || uploadingAvatar}>
          {editingEnabled ? (pending ? "Menyimpan..." : "Simpan Profil") : "Edit Profil Belum Aktif"}
        </Button>
      </div>
    </form>
  );
}
