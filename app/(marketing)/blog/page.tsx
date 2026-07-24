import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { createMetadata } from "@/lib/seo";
import { getActiveCategories, getFilteredPublishedPosts } from "@/lib/data/blog";
import { ArticleCard } from "@/components/blog/article-card";
import { FilterBar } from "@/components/blog/filter-bar";

export const dynamic = "force-dynamic";

export const metadata = createMetadata({
  title: "Blog — Avathur Rahman",
  description: "Artikel tentang produktivitas, teknologi, parenting, dan refleksi hidup.",
  path: "/blog",
});

async function BlogList({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; access?: string }>;
}) {
  const { category, access } = await searchParams;
  const [posts, categories] = await Promise.all([
    getFilteredPublishedPosts({ category, access }),
    getActiveCategories(),
  ]);

  return (
    <>
      <FilterBar categories={categories} />

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Belum ada artikel untuk filter ini.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {posts.map((post) => (
            <ArticleCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </>
  );
}

export default function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; access?: string }>;
}) {
  return (
    <main className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground mb-8">
        Artikel, catatan, dan refleksi dari Avathur Rahman.
      </p>
      <Separator className="mb-8" />

      <Suspense>
        <BlogList searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
