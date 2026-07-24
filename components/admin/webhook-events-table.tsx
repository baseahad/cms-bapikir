import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { WebhookEventSummary } from "@/lib/data/webhook-events";

const statusVariant: Record<
  WebhookEventSummary["status"],
  "default" | "secondary" | "destructive"
> = {
  failed: "destructive",
  processed: "default",
  processing: "secondary",
};

const statusLabel: Record<WebhookEventSummary["status"], string> = {
  failed: "Gagal",
  processed: "Selesai",
  processing: "Diproses",
};

function formatDateTime(iso: string | null) {
  if (!iso) {
    return "—";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function WebhookEventsTable({
  events,
}: {
  events: WebhookEventSummary[];
}) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Belum ada event webhook yang tercatat.
      </p>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Provider</TableHead>
            <TableHead>Event</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Order ID</TableHead>
            <TableHead className="hidden sm:table-cell">Diterima</TableHead>
            <TableHead className="hidden lg:table-cell">Diproses</TableHead>
            <TableHead className="hidden xl:table-cell">Error</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>
                <Badge variant="outline">{event.provider}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{event.event_type}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[event.status]}>
                  {statusLabel[event.status]}
                </Badge>
              </TableCell>
              <TableCell className="hidden font-mono text-xs md:table-cell">
                {event.external_id}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                {formatDateTime(event.created_at)}
              </TableCell>
              <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                {formatDateTime(event.processed_at)}
              </TableCell>
              <TableCell className="hidden max-w-xs truncate text-sm text-muted-foreground xl:table-cell">
                {event.error_message ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
