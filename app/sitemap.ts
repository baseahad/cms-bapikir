import { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getAllPublishedPosts } from "@/lib/data/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const posts = await getAllPublishedPosts();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/tulis`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const blogRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    let lastMod: Date | undefined;
    try {
      lastMod = post.updated_at ? new Date(post.updated_at) : new Date(post.created_at);
      if (lastMod && isNaN(lastMod.getTime())) lastMod = undefined;
    } catch { lastMod = undefined; }
    return {
      url: `${base}/blog/${post.slug}`,
      lastModified: lastMod,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    };
  });

  return [...staticRoutes, ...blogRoutes];
}
