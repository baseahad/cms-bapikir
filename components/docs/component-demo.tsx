import { cn } from "@/lib/utils";

export function ComponentDemo({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div>
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div
        className={cn(
          "rounded-lg border bg-background p-6 flex flex-wrap items-center justify-center gap-3 min-h-[80px]",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function DemoSection({
  title,
  children,
  columns = 2,
}: {
  title: string;
  children: React.ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <section className="space-y-4">
      <h3 className="text-base font-semibold text-muted-foreground uppercase tracking-wide text-xs border-b pb-2">
        {title}
      </h3>
      <div
        className={cn(
          "grid grid-cols-1 gap-6",
          columns === 2 && "md:grid-cols-2"
        )}
      >
        {children}
      </div>
    </section>
  );
}
