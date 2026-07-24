import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const DEFAULT_OG_IMAGE = "/og-default.svg";
const DEFAULT_TWITTER_IMAGE = "/og-default.svg";

type CreateMetadataParams = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
  image?: string;
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function createMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  noIndex = false,
  image,
}: CreateMetadataParams): Metadata {
  const canonical = path ? { canonical: path } : undefined;
  const url = path ? absoluteUrl(path) : undefined;
  const ogImage = image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE);

  return {
    title,
    description,
    ...(keywords ? { keywords } : {}),
    ...(canonical ? { alternates: canonical } : {}),
    openGraph: {
      title,
      description,
      siteName: siteConfig.name,
      locale: "id_ID",
      type,
      images: [ogImage],
      ...(url ? { url } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    ...(noIndex
      ? {
          robots: {
            index: false,
            follow: false,
          },
        }
      : {}),
  };
}

export function toJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
