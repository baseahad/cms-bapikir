import { Package } from "lucide-react";

interface TemplateBannerProps {
  description?: string;
}

export function TemplateBanner({ description }: TemplateBannerProps) {
  return (
    <div className="border-b bg-primary/5">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2 text-sm text-muted-foreground">
        <Package className="h-4 w-4 flex-shrink-0 text-primary" />
        <span>
          <span className="font-medium text-foreground">Template termasuk dalam starter</span>
          {description
            ? ` — ${description}`
            : " — halaman ini bundled dalam CMS Bapikir, bisa kamu kustomisasi untuk produkmu sendiri."}
        </span>
      </div>
    </div>
  );
}
