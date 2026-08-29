import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAuthenticatedUser } from "@/lib/data/auth";
import { isAdminUser } from "@/lib/data/user-roles";
import { hostFromHeaders, GATED_FEATURES } from "@/lib/license/gate";
import { evaluateLicense, licenseRequired } from "@/lib/license/verify";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Lisensi — CMS Bapikir",
  description: "Status lisensi instance ini dan cara mengaktifkannya.",
  path: "/admin/license",
  noIndex: true,
});

function fmt(unix: number | null | undefined): string {
  if (!unix) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(unix * 1000));
}

const STATUS_LABEL: Record<string, { text: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  valid: { text: "Aktif", variant: "default" },
  grace: { text: "Masa tenggang", variant: "secondary" },
  invalid: { text: "Mode terbatas", variant: "destructive" },
  revoked: { text: "Dicabut", variant: "destructive" },
};

export default async function LicensePage() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/auth/login");
  if (!(await isAdminUser(user.id, user.email))) redirect("/dashboard");

  const host = hostFromHeaders(await headers());
  const state = await evaluateLicense(host);
  const required = licenseRequired(host);
  const s = STATUS_LABEL[state.status] ?? STATUS_LABEL.invalid;

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
            <BreadcrumbPage>Lisensi</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Lisensi</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Host: <span className="font-mono">{host ?? "—"}</span> ·{" "}
          {required ? "produksi publik — butuh license key" : "tidak butuh key (dev / internal)"}
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Status</CardTitle>
          <Badge variant={s.variant}>{s.text}</Badge>
        </CardHeader>
        <CardContent className="text-sm space-y-1">
          <p className="text-muted-foreground">Alasan: <span className="font-mono">{state.reason}</span></p>
          {state.status === "grace" && (
            <p className="text-muted-foreground">
              Fitur terkunci pada: {fmt(state.graceEndsAt)}
            </p>
          )}
          {state.claims && (
            <div className="pt-2 grid grid-cols-2 gap-x-6 gap-y-1">
              <span className="text-muted-foreground">Lisensi</span>
              <span className="font-mono">{state.claims.id}</span>
              <span className="text-muted-foreground">Untuk</span>
              <span>{state.claims.sub}</span>
              <span className="text-muted-foreground">Paket</span>
              <span className="capitalize">{state.claims.tier}</span>
              <span className="text-muted-foreground">Domain</span>
              <span className="font-mono">
                {state.claims.domains === "*" ? "semua" : state.claims.domains.join(", ")}
              </span>
              <span className="text-muted-foreground">Berlaku s.d.</span>
              <span>{state.claims.exp ? fmt(state.claims.exp) : "selamanya"}</span>
              <span className="text-muted-foreground">Update s.d.</span>
              <span>{fmt(state.claims.updates_until)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {!state.entitled && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Aktifkan</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>
              Set <span className="font-mono">BAPIKIR_LICENSE_KEY</span> di{" "}
              <span className="font-mono">.env</span> instance ini, lalu restart
              (<span className="font-mono">pm2 restart --update-env</span>).
            </p>
            <p>
              Belum punya key? Hubungi{" "}
              <a href="mailto:lisensi@avathur.id" className="underline underline-offset-2">
                lisensi@avathur.id
              </a>
              .
            </p>
            <p className="text-muted-foreground">
              Selama mode terbatas, yang terkunci: {GATED_FEATURES.join(", ")}.
              Blog, halaman marketing, dan dashboard pengguna tetap berjalan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
