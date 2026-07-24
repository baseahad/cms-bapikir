import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import BlogEditor from "./blog-editor";

export default function BlogTulisPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <BlogEditor />
    </Suspense>
  );
}
