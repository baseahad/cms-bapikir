import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, PencilIcon, EyeIcon } from "lucide-react";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { isAdminUser } from "@/lib/data/user-roles";
import { createMetadata } from "@/lib/seo";
import { getAllPostsAdmin } from "@/lib/data/blog";
import { hasSupabasePublicEnv } from "@/lib/config/public-features";

export const metadata = createMetadata({
  title: "Blog — Admin CMS Bapikir",
  description: "Kelola artikel blog.",
  path: "/admin/blog",
  noIndex: true,
});

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function statusBadge(published: boolean) {
  return published
    ? <Badge className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Terbit</Badge>
    : <Badge variant="secondary" className="text-xs">Draft</Badge>;
}

async function BlogList() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");
  if (!(await isAdminUser(user.id, user.email))) redirect("/dashboard");

  const posts = await getAllPostsAdmin();

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
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {posts.length} artikel — {posts.filter(p => p.published).length} terbit, {posts.filter(p => !p.published).length} draft
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/tulis">
            <PlusIcon className="h-4 w-4 mr-1" />
            Tulis Baru
          </Link>
        </Button>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 border rounded-lg">
          <p className="text-muted-foreground">Belum ada artikel.</p>
          <Button asChild className="mt-4" variant="outline">
            <Link href="/admin/blog/tulis">Tulis artikel pertama</Link>
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40%]">Judul</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Kategori</TableHead>
                <TableHead className="hidden md:table-cell">Akses</TableHead>
                <TableHead className="hidden md:table-cell">Tanggal</TableHead>
                <TableHead className="w-[100px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell className="font-medium">
                    <div className="space-y-1">
                      <span className="line-clamp-1">{post.title}</span>
                      <span className="text-xs text-muted-foreground font-mono block">
                        /blog/{post.slug}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{statusBadge(post.published ?? false)}</TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground capitalize">
                    {post.category || "—"}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline" className="text-xs capitalize">
                      {post.access}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {formatDate(post.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/admin/blog/tulis?id=${post.id}`}>
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <Link href={`/blog/${post.slug}`} target="_blank">
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

export default function AdminBlogPage() {
  if (!hasSupabasePublicEnv) {
    return <p className="text-muted-foreground">Supabase belum dikonfigurasi.</p>;
  }

  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <BlogList />
    </Suspense>
  );
}
