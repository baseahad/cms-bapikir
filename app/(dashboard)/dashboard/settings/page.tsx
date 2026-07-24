import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getFeatureAvailability } from "@/lib/config/features";
import { createClient } from "@/lib/supabase/server";
import { hasEnvVars } from "@/lib/utils";
import { SupabaseEnvNotice } from "@/components/auth/supabase-env-notice";
import { ProfileForm } from "@/components/dashboard/profile-form";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UpdatePasswordForm } from "@/components/update-password-form";
import { getProfileForCurrentUser } from "@/lib/data/profiles";
import { getUserRoleForCurrentUser } from "@/lib/data/user-roles";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Pengaturan — CMS Bapikir",
  description: "Kelola akun dan password kamu.",
  path: "/dashboard/settings",
  noIndex: true,
});

async function SettingsContent() {
  if (!hasEnvVars) return <SupabaseEnvNotice />;

  const profileWritesFeature = getFeatureAvailability("profileWrites");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) redirect("/auth/login");

  const email = data.claims.email as string;
  const userId = data.claims.sub as string;
  const profile = await getProfileForCurrentUser(userId);
  const role = await getUserRoleForCurrentUser(userId, email);
  const displayName = profile?.full_name?.trim() || email;
  const initials = displayName.slice(0, 2).toUpperCase();
  const memberSince = profile?.created_at
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(profile.created_at))
    : "Akun aktif";

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Pengaturan</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div>
        <h1 className="text-2xl font-bold">Pengaturan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola akun dan preferensi kamu.
        </p>
      </div>

      <Separator />

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Profil</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            {profile?.avatar_image_url && (
              <AvatarImage src={profile.avatar_image_url} alt={displayName} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-sm">{displayName}</p>
              <Badge variant="outline" className="capitalize">
                {role}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{email}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Member sejak {memberSince}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Edit Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            avatarImageUrl={profile?.avatar_image_url ?? null}
            avatarPath={profile?.avatar_path ?? null}
            avatarUrl={profile?.avatar_url ?? null}
            editingEnabled={profileWritesFeature.enabled}
            email={email}
            fullName={profile?.full_name ?? null}
            userId={userId}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Ganti Password</CardTitle>
        </CardHeader>
        <CardContent>
          <UpdatePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense>
      <SettingsContent />
    </Suspense>
  );
}
