import { headers } from "next/headers";
import Link from "next/link";

import { hostFromHeaders, limitedModeBanner } from "@/lib/license/gate";

/**
 * Renders a strip at the top of every page when the app is unlicensed (or in
 * the post-expiry grace window). Renders nothing when fully licensed or when a
 * license is not required (dev / internal host).
 */
export async function LimitedModeBanner() {
  const h = await headers();
  const banner = await limitedModeBanner(hostFromHeaders(h));
  if (!banner?.show) return null;

  const tone =
    banner.tone === "warn"
      ? "bg-amber-500 text-black"
      : "bg-sky-600 text-white";

  return (
    <div
      role="status"
      className={`${tone} px-4 py-2 text-center text-sm font-medium`}
    >
      {banner.text}{" "}
      <Link href="/admin/license" className="underline underline-offset-2">
        Status lisensi
      </Link>
    </div>
  );
}
