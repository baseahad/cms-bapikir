import { Suspense } from "react";
import { createMetadata } from "@/lib/seo";
import { Skeleton } from "@/components/ui/skeleton";
import { ComponentShowcase } from "@/components/dashboard/showcase/component-showcase";

export const metadata = createMetadata({
  title: "Component Showcase — CMS Bapikir",
  description: "Showcase semua komponen dashboard dan admin.",
  path: "/dashboard/components",
  noIndex: true,
});

export default function ComponentShowcasePage() {
  return (
    <Suspense fallback={<Skeleton className="h-96 w-full" />}>
      <ComponentShowcase />
    </Suspense>
  );
}
