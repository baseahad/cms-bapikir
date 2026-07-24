"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, ArrowLeft, Upload, ClipboardPaste } from "lucide-react";
import { BLOG_CATEGORIES } from "@/config/blog-categories";
import MdxPreview from "@/components/blog/MdxPreview";

type PostData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  tags: string[];
  category: string;
  access: "free" | "member" | "premium" | "exclusive";
  published: boolean;
  featured: boolean;
  cover_image: string;
};

const emptyPost: PostData = {
  title: "",
  slug: "",
  description: "",
  content: "",
  author: "Avathur Rahman",
  tags: [],
  category: "",
  access: "free",
  published: false,
  featured: false,
  cover_image: "",
};

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Kategori ditarik dari config/blog-categories.ts — satu-satunya sumber kebenaran
// taksonomi blog (dipakai juga oleh filter kategori di halaman publik). Dulu di sini
// ada daftar hardcode terpisah yang nilainya tak pernah cocok dengan taksonomi asli —
// artikel yang dikategorikan lewat editor ini jadi tak pernah muncul di filter manapun.
const CATEGORIES = BLOG_CATEGORIES.map((c) => ({ value: c.slug, label: c.nama }));

export default function BlogEditor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("id");

  const [post, setPost] = useState<PostData>(emptyPost);
  const [loading, setLoading] = useState(!!editId);
  const [saving, setSaving] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [contentTab, setContentTab] = useState<"tulis" | "pratinjau">("tulis");
  const [importing, setImporting] = useState(false);
  const [importWarning, setImportWarning] = useState("");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing post
  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    fetch(`/api/admin/blog/${editId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.post) {
          setPost({
            id: data.post.id,
            title: data.post.title,
            slug: data.post.slug,
            description: data.post.description || "",
            content: data.post.content,
            author: data.post.author || "Avathur Rahman",
            tags: data.post.tags || [],
            category: data.post.category || "",
            access: data.post.access || "free",
            published: data.post.published,
            featured: data.post.featured,
            cover_image: data.post.cover_image || "",
          });
        }
      })
      .catch(() => setError("Gagal memuat artikel"))
      .finally(() => setLoading(false));
  }, [editId]);

  // Auto-generate slug from title
  const handleTitleChange = useCallback(
    (val: string) => {
      setPost((p) => ({ ...p, title: val }));
      if (!slugManuallyEdited) {
        setPost((p) => ({ ...p, slug: toSlug(val) }));
      }
    },
    [slugManuallyEdited]
  );

  const updateField = <K extends keyof PostData>(
    key: K,
    val: PostData[K]
  ) => {
    setPost((p) => ({ ...p, [key]: val }));
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !post.tags.includes(tag)) {
      setPost((p) => ({ ...p, tags: [...p.tags, tag] }));
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setPost((p) => ({ ...p, tags: p.tags.filter((t) => t !== tag) }));
  };

  // Impor artikel .md/.mdx (dari Nizhom, ChatGPT, Notion, dll) — parse di server,
  // cuma ISI FORM, tidak langsung terbit. Kategori dari file lama/tak dikenal
  // TIDAK diam-diam diterima — dibiarkan kosong + peringatan, minta dipilih manual.
  async function handleImport(raw: string) {
    setError("");
    setImportWarning("");
    setImporting(true);
    try {
      const res = await fetch("/api/admin/blog/parse-md", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ raw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Gagal memproses berkas");
        return;
      }

      setPost((p) => ({
        ...p,
        title: data.title || p.title,
        slug: data.title ? toSlug(data.title) : p.slug,
        description: data.description || p.description,
        content: data.content || p.content,
        author: data.author || p.author,
        tags: data.tags?.length ? data.tags : p.tags,
        category: data.category || p.category,
        cover_image: data.cover_image || p.cover_image,
      }));
      setSlugManuallyEdited(false);

      if (data.categoryRaw && !data.categoryValid) {
        setImportWarning(
          `Kategori "${data.categoryRaw}" di berkas tak dikenal sistem — pilih kategori yang benar secara manual sebelum menerbitkan.`
        );
      }
      setSuccess("Berkas diimpor. Cek isian di bawah sebelum menyimpan.");
      setPasteOpen(false);
      setPasteText("");
    } catch {
      setError("Gagal memproses berkas. Coba lagi.");
    } finally {
      setImporting(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleImport(String(reader.result || ""));
    reader.readAsText(file);
    e.target.value = "";
  }

  async function handleSave(publish: boolean) {
    setError("");
    setSuccess("");

    const payload = { ...post, published: publish || post.published };
    const isEdit = !!editId;

    try {
      setSaving(true);
      const url = isEdit ? `/api/admin/blog/${editId}` : "/api/admin/blog";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal menyimpan");
        if (data.details) {
          const msgs = Object.entries(data.details).map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`);
          setError(msgs.join("\n"));
        }
        return;
      }

      setSuccess(publish ? "Artikel diterbitkan!" : "Artikel disimpan sebagai draft.");
      if (!isEdit && data.post?.id) {
        // After create, redirect to edit URL
        setTimeout(() => router.push(`/admin/blog/tulis?id=${data.post.id}`), 1000);
      }
    } catch {
      setError("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/blog">Blog</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{editId ? "Edit Artikel" : "Tulis Baru"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{editId ? "Edit Artikel" : "Tulis Baru"}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {editId ? "Perbarui artikel yang sudah ada." : "Buat artikel blog baru."}
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/admin/blog">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Kembali
          </Link>
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-300">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span className="whitespace-pre-line">{error}</span>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg text-sm text-green-700 dark:text-green-300">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {importWarning && (
        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{importWarning}</span>
        </div>
      )}

      {/* IMPOR .md */}
      <div className="rounded-lg border border-dashed p-4 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-sm font-medium">Impor dari berkas .md / .mdx</p>
            <p className="text-xs text-muted-foreground">
              Punya draft dari Nizhom, ChatGPT, atau Notion? Isi form di bawah otomatis dari frontmatter-nya.
            </p>
          </div>
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.mdx,text/markdown,text/plain"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={importing}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-4 w-4 mr-1" />
              {importing ? "Memproses..." : "Upload berkas"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPasteOpen((v) => !v)}
            >
              <ClipboardPaste className="h-4 w-4 mr-1" />
              Tempel teks
            </Button>
          </div>
        </div>
        {pasteOpen && (
          <div className="space-y-2">
            <Textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={"---\ntitle: \"Judul Artikel\"\n---\n\nTempel isi .md di sini..."}
              rows={8}
              className="font-mono text-sm"
            />
            <Button
              type="button"
              size="sm"
              disabled={importing || !pasteText.trim()}
              onClick={() => handleImport(pasteText)}
            >
              {importing ? "Memproses..." : "Proses teks"}
            </Button>
          </div>
        )}
      </div>

      {/* JUDUL */}
      <div className="space-y-2">
        <Label htmlFor="title">Judul</Label>
        <Input
          id="title"
          value={post.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Masukkan judul artikel..."
        />
      </div>

      {/* SLUG */}
      <div className="space-y-2">
        <Label htmlFor="slug">Slug</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>/blog/</span>
          <Input
            id="slug"
            value={post.slug}
            onChange={(e) => {
              setSlugManuallyEdited(true);
              updateField("slug", toSlug(e.target.value));
            }}
            className="font-mono text-sm"
            placeholder="judul-artikel"
          />
          {slugManuallyEdited && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSlugManuallyEdited(false);
                updateField("slug", toSlug(post.title));
              }}
            >
              Auto
            </Button>
          )}
        </div>
      </div>

      {/* DESKRIPSI */}
      <div className="space-y-2">
        <Label htmlFor="description">Deskripsi (meta)</Label>
        <Textarea
          id="description"
          value={post.description}
          onChange={(e) => updateField("description", e.target.value)}
          placeholder="Ringkasan singkat untuk SEO dan sharing..."
          rows={2}
        />
      </div>

      {/* KONTEN */}
      <div className="space-y-2">
        <Label>Konten (Markdown / MDX)</Label>
        <Tabs value={contentTab} onValueChange={(v) => setContentTab(v as "tulis" | "pratinjau")}>
          <TabsList>
            <TabsTrigger value="tulis">Tulis</TabsTrigger>
            <TabsTrigger value="pratinjau">Pratinjau</TabsTrigger>
          </TabsList>
          <TabsContent value="tulis" className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Tulis dalam format Markdown. HTML dan komponen JSX juga bisa digunakan.
            </p>
            <Textarea
              id="content"
              value={post.content}
              onChange={(e) => updateField("content", e.target.value)}
              placeholder="Tulis konten artikel di sini..."
              rows={20}
              className="font-mono text-sm leading-relaxed"
            />
          </TabsContent>
          <TabsContent value="pratinjau">
            <div className="rounded-lg border p-6 min-h-[200px]">
              {contentTab === "pratinjau" && <MdxPreview content={post.content} />}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* METADATA GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* KATEGORI */}
        <div className="space-y-2">
          <Label>Kategori</Label>
          <Select
            value={post.category}
            onValueChange={(v) => updateField("category", v)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih kategori" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* TIER AKSES */}
        <div className="space-y-2">
          <Label>Tier Akses</Label>
          <Select
            value={post.access}
            onValueChange={(v: "free" | "member" | "premium" | "exclusive") =>
              updateField("access", v)
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free — Semua orang</SelectItem>
              <SelectItem value="member">Member — Login aja</SelectItem>
              <SelectItem value="premium">Premium — Berbayar</SelectItem>
              <SelectItem value="exclusive">Exclusive — VIP</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* AUTHOR */}
        <div className="space-y-2">
          <Label htmlFor="author">Penulis</Label>
          <Input
            id="author"
            value={post.author}
            onChange={(e) => updateField("author", e.target.value)}
          />
        </div>

        {/* COVER IMAGE */}
        <div className="space-y-2">
          <Label htmlFor="cover_image">URL Cover Image</Label>
          <Input
            id="cover_image"
            value={post.cover_image}
            onChange={(e) => updateField("cover_image", e.target.value)}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* TAGS */}
      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex gap-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
            placeholder="Ketik tag lalu Enter..."
            className="flex-1"
          />
          <Button type="button" variant="outline" onClick={addTag}>
            Tambah
          </Button>
        </div>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* TOGGLES */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Switch
            id="published"
            checked={post.published}
            onCheckedChange={(v) => updateField("published", v)}
          />
          <Label htmlFor="published">Terbitkan</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            id="featured"
            checked={post.featured}
            onCheckedChange={(v) => updateField("featured", v)}
          />
          <Label htmlFor="featured">Unggulan</Label>
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          onClick={() => handleSave(false)}
          disabled={saving}
          variant="outline"
        >
          {saving ? "Menyimpan..." : "Simpan Draft"}
        </Button>
        <Button
          onClick={() => handleSave(true)}
          disabled={saving}
        >
          {saving ? "Menerbitkan..." : "Terbitkan"}
        </Button>
      </div>
    </div>
  );
}
