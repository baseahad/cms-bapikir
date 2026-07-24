import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { IBM_Plex_Sans as IbmPlexSansFont } from "next/font/google";
import { JetBrains_Mono as JetBrainsMonoFont } from "next/font/google";
import { Manrope as ManropeFont } from "next/font/google";
import { Playfair_Display as PlayfairDisplayFont } from "next/font/google";
import { Source_Serif_4 as SourceSerifFont } from "next/font/google";

import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

import "@/app/globals.css";

const ibmPlexSans = IbmPlexSansFont({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ibm-plex-sans",
});

const jetBrainsMono = JetBrainsMonoFont({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

const manrope = ManropeFont({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfairDisplay = PlayfairDisplayFont({
  subsets: ["latin"],
  variable: "--font-playfair-display",
});

const sourceSerif = SourceSerifFont({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-serif",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: "/",
  },
  title: siteConfig.name + " — " + siteConfig.tagline,
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name + " — " + siteConfig.tagline,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          GeistSans.className,
          GeistSans.variable,
          GeistMono.variable,
          ibmPlexSans.variable,
          jetBrainsMono.variable,
          manrope.variable,
          playfairDisplay.variable,
          sourceSerif.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: siteConfig.name,
              description: siteConfig.tagline,
              url: siteConfig.url,
            }),
          }}
        />
      </body>
    </html>
  );
}
