import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeftIcon } from "lucide-react";
import { createMetadata } from "@/lib/seo";
import { getPublishedPostsByCategory } from "@/lib/data/blog";
import { ArticleCard } from "@/components/blog/article-card";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  return createMetadata({
    title: `Kategori: ${slug} — Blog Avathur Rahman`,
    description: `Artikel dalam kategori ${slug}.`,
    path: `/blog/kategori/${slug}`,
  });
}

export const dynamic = "force-dynamic";

export default async function BlogCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const posts = await getPublishedPostsByCategory(slug);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <Button variant="ghost" size="sm" asChild className="mb-6">
        <Link href="/blog">
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Kembali ke Blog
        </Link>
      </Button>

      <h1 className="text-3xl font-bold mb-2 capitalize">{slug}</h1>
      <p className="text-muted-foreground mb-8">
        {posts.length} artikel dalam kategori ini.
      </p>
      <Separator className="mb-8" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <ArticleCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
