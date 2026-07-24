import Link from "next/link";
import { Suspense } from "react";
import { Menu } from "lucide-react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { DesignSwitcher } from "@/components/marketing/design-switcher";
import { siteConfig } from "@/config/site";
import { marketingNav, dashboardNav, isNavGroup, type NavEntry } from "@/config/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DesktopNav } from "@/components/layout/desktop-nav";
import { cn } from "@/lib/utils";

type HeaderVariant = "marketing" | "dashboard";

const navEntries: Record<HeaderVariant, NavEntry[]> = {
  marketing: marketingNav,
  dashboard: dashboardNav,
};

export function Header({ variant = "marketing" }: { variant?: HeaderVariant }) {
  const entries = navEntries[variant];

  return (
    <header
      className={cn(
        "w-full border-b sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        variant === "marketing" && "marketing-header",
      )}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="marketing-brand font-semibold text-sm mr-2">
            {siteConfig.name}
          </Link>
          <div className="hidden md:flex">
            <DesktopNav entries={entries} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {variant === "marketing" ? <DesignSwitcher /> : null}
          <ThemeSwitcher />
          <div className="hidden md:block">
            <Suspense>
              <AuthButton />
            </Suspense>
          </div>

          {/* Mobile nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Buka menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 p-0 sm:w-[420px]">
              <SheetHeader className="px-4 pt-4 pb-2">
                <SheetTitle className="text-left">{siteConfig.name}</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-80px)]">
                <div className="space-y-4 px-3 pb-6">
                  {entries.map((entry) => {
                    if (isNavGroup(entry)) {
                      return (
                        <div key={entry.label} className="space-y-2 rounded-lg border p-3">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                            {entry.label}
                          </p>
                          {entry.children.map((group) => (
                            <div key={group.group} className="space-y-1.5">
                              <p className="px-1 pt-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground first:pt-0">
                                {group.group}
                              </p>
                              {group.items.map((item) => (
                                <Button
                                  key={item.href}
                                  variant="ghost"
                                  className="h-auto w-full justify-start px-3 py-3"
                                  asChild
                                >
                                  <Link href={item.href}>
                                    <span className="flex flex-col items-start text-left">
                                      <span className="text-sm font-medium">{item.label}</span>
                                      {item.description && (
                                        <span className="text-xs text-muted-foreground whitespace-normal">
                                          {item.description}
                                        </span>
                                      )}
                                    </span>
                                  </Link>
                                </Button>
                              ))}
                            </div>
                          ))}
                        </div>
                      );
                    }

                    return (
                      <Button
                        key={entry.href}
                        variant="ghost"
                        className="h-auto w-full justify-start rounded-lg border px-3 py-3"
                        asChild
                      >
                        <Link href={entry.href}>
                          <span className="flex flex-col items-start text-left">
                            <span className="text-sm font-medium">{entry.label}</span>
                            {entry.description && (
                              <span className="text-xs text-muted-foreground whitespace-normal">
                                {entry.description}
                              </span>
                            )}
                          </span>
                        </Link>
                      </Button>
                    );
                  })}
                  <Separator className="my-3" />
                  <div className="px-1">
                    <Suspense>
                      <AuthButton />
                    </Suspense>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
