import { createAdminClient, hasServiceRoleEnv } from "@/lib/supabase/admin";
import type { Row } from "@/types/database";

export type WebhookEventRecord = Row<"webhook_events">;
export type WebhookEventSummary = Pick<
  WebhookEventRecord,
  "created_at" | "error_message" | "event_type" | "external_id" | "id" | "processed_at" | "provider" | "status"
>;

export async function getRecentWebhookEvents(limit = 10): Promise<WebhookEventSummary[]> {
  if (!hasServiceRoleEnv) {
    return [];
  }

  const adminClient = createAdminClient();
  const { data } = await adminClient
    .from("webhook_events")
    .select("id, provider, external_id, event_type, status, error_message, created_at, processed_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  return data ?? [];
}
