"use client";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AdminUserRecord } from "@/lib/data/admin";
import { UserDetailSheet } from "@/components/admin/user-detail-sheet";
import { UserTable } from "@/components/admin/user-table";

export function AdminUserManagement({
  currentAdminUserId,
  users,
}: {
  currentAdminUserId: string;
  users: AdminUserRecord[];
}) {
  const router = useRouter();
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userState, setUserState] = useState(users);

  const selectedUser = userState.find((user) => user.id === selectedUserId) ?? null;

  async function handleRoleChange(userId: string, nextRole: "member" | "admin") {
    setPendingUserId(userId);

    try {
      const response = await fetch("/api/admin/users/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: nextRole,
          user_id: userId,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error ?? "Gagal memperbarui role user.");
        return;
      }

      setUserState((current) =>
        current.map((entry) =>
          entry.id === userId
            ? {
                ...entry,
                role: nextRole,
              }
            : entry,
        ),
      );
      toast.success(
        nextRole === "admin"
          ? "User berhasil dipromosikan menjadi admin."
          : "User berhasil diturunkan menjadi member.",
      );
      startTransition(() => {
        router.refresh();
      });
    } catch {
      toast.error("Gagal memperbarui role user.");
    } finally {
      setPendingUserId(null);
    }
  }

  return (
    <>
      <UserTable users={userState} onViewUser={(user) => setSelectedUserId(user.id)} />
      <UserDetailSheet
        currentAdminUserId={currentAdminUserId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUserId(null);
          }
        }}
        onRoleChange={handleRoleChange}
        open={Boolean(selectedUser)}
        pendingRoleChange={pendingUserId === selectedUser?.id}
        user={selectedUser}
      />
    </>
  );
}
