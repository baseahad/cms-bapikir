import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AccessBadge } from "@/components/blog/access-badge";
import type { BlogPostPublic } from "@/lib/data/blog";

export function ArticleCard({ post }: { post: BlogPostPublic }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <Card className="h-full border-border/50 transition-colors group-hover:border-primary/50">
        <CardHeader className="pb-2">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            {post.category && (
              <Badge variant="secondary" className="text-xs capitalize">
                {post.category}
              </Badge>
            )}
            <AccessBadge access={post.access} />
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
            {" · "}
            {post.reading_time} menit baca
          </p>
          <h2 className="text-lg font-semibold leading-snug group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground mb-3">{post.description}</p>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
