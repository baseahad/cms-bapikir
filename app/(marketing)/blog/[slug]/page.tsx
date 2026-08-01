import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { createMetadata } from "@/lib/seo";
import { getPublishedPostBySlug } from "@/lib/data/blog";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { getSubscriptionByUserId, isPaidPlan } from "@/lib/data/subscriptions";
import { createClient } from "@/lib/supabase/server";
import { AccessBadge, resolveAccess } from "@/components/blog/access-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronLeftIcon, LockIcon } from "lucide-react";
import PromptToolbar from "@/components/PromptToolbar";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) return { title: "Artikel tidak ditemukan" };

  return createMetadata({
    title: `${post.title} — Blog Avathur Rahman`,
    description: post.description || `Baca artikel ${post.title}`,
    path: `/blog/${slug}`,
    image: post.cover_image || undefined,
  });
}

async function resolveGate(access: string | null, slug: string) {
  const level = resolveAccess(access);

  if (level === "free") {
    return { locked: false as const };
  }

  const user = await getAuthenticatedUser();

  if (level === "member") {
    if (user) return { locked: false as const };
    return {
      locked: true as const,
      title: "Artikel ini butuh login",
      description: "Masuk dulu (gratis) untuk lanjut membaca artikel ini.",
      cta: { href: `/auth/login?redirect=/blog/${slug}`, label: "Login" },
    };
  }

  if (level === "exclusive") {
    if (!user) {
      return {
        locked: true as const,
        title: "Artikel eksklusif untuk member berbayar",
        description: "Masuk dulu, lalu upgrade plan untuk buka artikel ini.",
        cta: { href: `/auth/login?redirect=/blog/${slug}`, label: "Login" },
      };
    }

    const supabase = await createClient();
    const subscription = await getSubscriptionByUserId(supabase, user.id);
    if (subscription && isPaidPlan(subscription.plan)) {
      return { locked: false as const };
    }

    return {
      locked: true as const,
      title: "Artikel eksklusif untuk member berbayar",
      description: "Artikel ini cuma bisa dibaca dengan plan berbayar aktif.",
      cta: { href: "/checkout", label: "Lihat Plan" },
    };
  }

  // premium — pembelian per-artikel belum dibangun (belum ada artikel yang pakai tier ini).
  return {
    locked: true as const,
    title: "Artikel premium",
    description: "Pembelian akses per-artikel belum tersedia — segera hadir.",
    cta: null,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const gate = await resolveGate(post.access, slug);

  return (
    <>
      <main className="max-w-3xl mx-auto px-4 py-16">
        <Button variant="ghost" size="sm" asChild className="mb-8">
          <Link href="/blog">
            <ChevronLeftIcon className="h-4 w-4 mr-1" />
            Kembali ke Blog
          </Link>
        </Button>

        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {post.category && (
              <Badge variant="outline" className="capitalize text-xs">
                {post.category}
              </Badge>
            )}
            <AccessBadge access={post.access} />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {post.title}
          </h1>

          <div className="text-sm text-muted-foreground">
            {post.author && (
              <span className="font-medium text-foreground">{post.author}</span>
            )}
            {post.author && " · "}
            {new Date(post.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {post.reading_time} menit baca
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags?.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <Separator className="mb-10" />

        {gate.locked ? (
          <>
            {post.description && (
              <p className="text-muted-foreground leading-relaxed mb-6">
                {post.description}
              </p>
            )}
            <Card className="border-dashed">
              <CardContent className="pt-6 flex flex-col items-center text-center gap-3">
                <LockIcon className="h-6 w-6 text-muted-foreground" />
                <p className="font-semibold">{gate.title}</p>
                <p className="text-sm text-muted-foreground">{gate.description}</p>
                {gate.cta && (
                  <Button asChild>
                    <Link href={gate.cta.href}>{gate.cta.label}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <article className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXRemote
              source={post.content}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              components={{ PromptToolbar }}
            />
          </article>
        )}
      </main>
    </>
  );
}
