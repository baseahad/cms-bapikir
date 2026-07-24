import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type MediaRow = Database["public"]["Tables"]["media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["media"]["Insert"];

export type MediaItem = Pick<MediaRow, "id" | "filename" | "original_name" | "mime_type" | "size_bytes" | "alt_text" | "created_at"> & {
  url: string;
};

function getPublicUrl(storagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  return `${supabaseUrl}/storage/v1/object/public/media/${storagePath}`;
}

// --- PUBLIC: anyone can view ---

export async function getAllMedia(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("id, filename, original_name, mime_type, size_bytes, alt_text, storage_path, created_at")
    .order("created_at", { ascending: false });

  if (!data) return [];

  return data.map((m) => ({
    id: m.id,
    filename: m.filename,
    original_name: m.original_name,
    mime_type: m.mime_type,
    size_bytes: m.size_bytes,
    alt_text: m.alt_text || "",
    created_at: m.created_at,
    url: getPublicUrl(m.storage_path),
  }));
}

export async function getMediaById(id: string): Promise<(MediaItem & { storage_path: string }) | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!data) return null;

  return {
    id: data.id,
    filename: data.filename,
    original_name: data.original_name,
    mime_type: data.mime_type,
    size_bytes: data.size_bytes,
    alt_text: data.alt_text || "",
    created_at: data.created_at,
    storage_path: data.storage_path,
    url: getPublicUrl(data.storage_path),
  };
}

// --- ADMIN ---

export async function getMediaCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase.from("media").select("*", { count: "exact", head: true });
  return count ?? 0;
}

export async function insertMediaRecord(record: MediaInsert): Promise<MediaRow | null> {
  if (!hasServiceRoleEnv) return null;

  const admin = createAdminClient();
  const { data } = await admin.from("media").insert(record).select().single();
  return data;
}

export async function deleteMediaRecord(id: string): Promise<boolean> {
  if (!hasServiceRoleEnv) return false;

  try {
    const admin = createAdminClient();

    // Dapatkan storage_path dulu
    const { data: existing } = await admin.from("media").select("storage_path").eq("id", id).maybeSingle();
    if (!existing) return false;

    // Hapus dari storage
    await admin.storage.from("media").remove([existing.storage_path]);

    // Hapus record
    const { error } = await admin.from("media").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}
