"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbLink,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Upload, Trash2, FileImage, Loader2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";

type MediaItem = {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  alt_text: string;
  url: string;
  created_at: string;
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(mime: string): boolean {
  return mime.startsWith("image/");
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadMedia = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setMedia(data.media || []);
    } catch {
      toast.error("Gagal memuat media");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadMedia(); }, [loadMedia]);

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Gagal upload");
        return;
      }

      toast.success("Upload berhasil!");
      setMedia((prev) => [data.media, ...prev]);
    } catch {
      toast.error("Gagal upload file");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, filename: string) {
    if (!confirm(`Hapus "${filename}"?`)) return;

    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("File dihapus");
      setMedia((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Gagal menghapus");
    }
  }

  function copyUrl(url: string, id: string) {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success("URL disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-6">
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
            <BreadcrumbPage>Media</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {media.length} file — JPG, PNG, WebP, GIF, SVG, PDF maks 10MB
          </p>
        </div>
        <div className="relative">
          <Button disabled={uploading} asChild>
            <label className="cursor-pointer">
              {uploading ? (
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1" />
              )}
              {uploading ? "Mengupload..." : "Upload File"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
                className="hidden"
                onChange={handleFileSelect}
              />
            </label>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <FileImage className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">Belum ada file.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload gambar untuk dipasang di konten blog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {media.map((item) => (
            <Card key={item.id} className="group overflow-hidden border-border/50">
              <div className="relative aspect-square bg-muted/30">
                {isImage(item.mime_type) ? (
                  <Image
                    src={item.url}
                    alt={item.alt_text || item.original_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 20vw"
                    unoptimized={item.url.startsWith("http") && !item.url.includes("supabase.co")}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FileImage className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => copyUrl(item.url, item.id)}
                    title="Salin URL"
                  >
                    {copiedId === item.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleDelete(item.id, item.original_name)}
                    title="Hapus"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-2 space-y-1">
                <p className="text-xs truncate font-medium">{item.original_name}</p>
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>{formatBytes(item.size_bytes)}</span>
                  <span>{formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: id })}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
