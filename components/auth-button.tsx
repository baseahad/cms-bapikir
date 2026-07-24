import Link from "next/link";
import { SupabaseEnvNotice } from "@/components/auth/supabase-env-notice";
import { hasEnvVars } from "@/lib/utils";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { createClient } from "@/lib/supabase/server";
import { getProfileForCurrentUser } from "@/lib/data/profiles";
import { getUserRoleForCurrentUser } from "@/lib/data/user-roles";

export async function AuthButton() {
  if (!hasEnvVars()) {
    return <SupabaseEnvNotice compact />;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Masuk</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Daftar</Link>
        </Button>
      </div>
    );
  }

  const email = user.email as string;
  const userId = user.sub as string;
  const [profile, role] = await Promise.all([
    getProfileForCurrentUser(userId),
    getUserRoleForCurrentUser(userId, email),
  ]);
  const displayName = profile?.full_name?.trim() || email;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
          <Avatar className="h-9 w-9">
            {profile?.avatar_image_url && (
              <AvatarImage src={profile.avatar_image_url} alt={displayName} />
            )}
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <p className="text-sm font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
          Workspace
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">Billing</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">Pengaturan</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/components">Component Showcase</Link>
        </DropdownMenuItem>
        {role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              Admin
            </DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href="/admin">Admin Dashboard</Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/logout">Keluar</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
