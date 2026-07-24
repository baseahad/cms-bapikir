import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import type { Json, Row } from "@/types/database";

export type AuditEventType =
  | "admin.action"
  | "payment.failed"
  | "payment.success"
  | "profile.update"
  | "subscription.change"
  | "user.login"
  | "user.signup";

type AuditLogRecord = Row<"audit_logs">;

export type AuditEntry = Pick<
  AuditLogRecord,
  "actor_email" | "created_at" | "description" | "id"
> & {
  metadata?: Record<string, unknown> | null;
  type: AuditEventType;
};

export async function createAuditLog(input: {
  actorEmail: string;
  actorUserId?: string | null;
  description: string;
  metadata?: Json | null;
  type: AuditEventType;
}) {
  if (!hasServiceRoleEnv) {
    return;
  }

  const adminClient = createAdminClient();
  await adminClient.from("audit_logs").insert({
    actor_email: input.actorEmail,
    actor_user_id: input.actorUserId ?? null,
    description: input.description,
    metadata: input.metadata ?? null,
    type: input.type,
  });
}

export async function getRecentAuditLogs(limit = 20): Promise<AuditEntry[]> {
  if (!hasServiceRoleEnv) {
    return [];
  }

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("audit_logs")
    .select("id, type, actor_email, description, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []) as AuditEntry[];
}
