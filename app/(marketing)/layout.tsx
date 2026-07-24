import { MarketingDesignProvider } from "@/components/marketing/design-provider";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingDesignProvider>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </MarketingDesignProvider>
  );
}
