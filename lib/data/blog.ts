import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

export type BlogPostRow = Database["public"]["Tables"]["blog_posts"]["Row"];
export type BlogPostInsert = Database["public"]["Tables"]["blog_posts"]["Insert"];
export type BlogPostUpdate = Database["public"]["Tables"]["blog_posts"]["Update"];

export type BlogPostPublic = Pick<
  BlogPostRow,
  "id" | "slug" | "title" | "description" | "author" | "tags" | "category" | "access" | "reading_time" | "cover_image" | "created_at" | "updated_at"
>;

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

// --- PUBLIC: published posts only ---

export async function getAllPublishedPosts(): Promise<BlogPostPublic[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title, description, author, tags, category, access, reading_time, cover_image, created_at, updated_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getPublishedPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  return data;
}

export async function getPublishedPostsByCategory(category: string): Promise<BlogPostPublic[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title, description, author, tags, category, access, reading_time, cover_image, created_at, updated_at")
    .eq("published", true)
    .eq("category", category)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getPublishedPostsByAccess(access: string): Promise<BlogPostPublic[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("id, slug, title, description, author, tags, category, access, reading_time, cover_image, created_at, updated_at")
    .eq("published", true)
    .eq("access", access)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getFilteredPublishedPosts(filters: {
  category?: string;
  access?: string;
}): Promise<BlogPostPublic[]> {
  const supabase = await createClient();
  let query = supabase
    .from("blog_posts")
    .select("id, slug, title, description, author, tags, category, access, reading_time, cover_image, created_at, updated_at")
    .eq("published", true);

  if (filters.category) query = query.eq("category", filters.category);
  if (filters.access) query = query.eq("access", filters.access);

  const { data } = await query.order("created_at", { ascending: false });
  return data ?? [];
}

export async function getActiveCategories(): Promise<{ slug: string; count: number }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("category")
    .eq("published", true)
    .not("category", "is", null);

  if (!data) return [];

  const counts = new Map<string, number>();
  for (const row of data) {
    if (row.category) {
      counts.set(row.category, (counts.get(row.category) || 0) + 1);
    }
  }

  return Array.from(counts.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count);
}

// --- ADMIN: all posts (including drafts) ---

export async function getAllPostsAdmin(): Promise<BlogPostRow[]> {
  if (!hasServiceRoleEnv) return [];

  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getPostByIdAdmin(id: string): Promise<BlogPostRow | null> {
  if (!hasServiceRoleEnv) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  return data;
}

export async function createPostAdmin(post: BlogPostInsert): Promise<BlogPostRow | null> {
  if (!hasServiceRoleEnv) return null;

  const readingTime = post.content ? estimateReadingTime(post.content) : 1;
  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .insert({ ...post, reading_time: readingTime })
    .select()
    .single();

  return data;
}

export async function updatePostAdmin(id: string, post: BlogPostUpdate): Promise<BlogPostRow | null> {
  if (!hasServiceRoleEnv) return null;

  const updateData: BlogPostUpdate = { ...post };
  if (post.content) {
    updateData.reading_time = estimateReadingTime(post.content);
  }

  const admin = createAdminClient();
  const { data } = await admin
    .from("blog_posts")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  return data;
}

export async function deletePostAdmin(id: string): Promise<boolean> {
  if (!hasServiceRoleEnv) return false;

  const admin = createAdminClient();
  const { error } = await admin
    .from("blog_posts")
    .delete()
    .eq("id", id);

  return !error;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  const supabase = await createClient();
  let query = supabase.from("blog_posts").select("id").eq("slug", slug).maybeSingle();
  const { data } = await query;
  if (!data) return false;
  if (excludeId && data.id === excludeId) return false;
  return true;
}
