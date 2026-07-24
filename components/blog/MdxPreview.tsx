"use client";

import { useEffect, useState } from "react";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import PromptToolbar from "@/components/PromptToolbar";

// Pratinjau MDX di editor admin — pakai render pipeline yang SAMA dengan
// halaman publik (remark-gfm + komponen PromptToolbar), lewat satu API
// (/api/admin/blog/preview) yang meng-compile server-side. Ini satu-satunya
// cara "Tulis"/"Pratinjau" tak pernah beda dari yang benar-benar terbit.

export default function MdxPreview({ content }: { content: string }) {
  const [source, setSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (!content.trim()) {
        setSource(null);
        setError("");
        return;
      }
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/admin/blog/preview", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) {
          setError(data.error || "Gagal merender pratinjau");
          setSource(null);
        } else {
          setSource(data.mdxSource);
        }
      } catch {
        if (!cancelled) setError("Gagal menghubungi server untuk pratinjau");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [content]);

  if (loading && !source) {
    return <p className="text-sm text-muted-foreground">Merender pratinjau…</p>;
  }
  if (error) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        Gagal merender: {error}
      </p>
    );
  }
  if (!source) {
    return <p className="text-sm text-muted-foreground">Belum ada konten untuk dipratinjau.</p>;
  }

  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <MDXRemote {...source} components={{ PromptToolbar }} />
    </article>
  );
}
