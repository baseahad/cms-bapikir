"use client";

import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import { BellIcon, CheckCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type Notification = {
  id: string;
  title: string;
  body?: string;
  read: boolean;
  created_at: string;
};

export function NotificationDropdown({
  notifications,
  onMarkAllRead,
  onMarkRead,
}: {
  notifications: Notification[];
  onMarkAllRead?: () => void;
  onMarkRead?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3">
          <h4 className="text-sm font-semibold">Notifikasi</h4>
          {unreadCount > 0 && onMarkAllRead && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto py-1 px-2 text-xs"
              onClick={onMarkAllRead}
            >
              <CheckCheckIcon className="mr-1 h-3 w-3" />
              Tandai semua dibaca
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="max-h-80">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Tidak ada notifikasi.
            </p>
          ) : (
            <div>
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  className={cn(
                    "flex w-full flex-col gap-0.5 px-4 py-3 text-left hover:bg-muted/50 transition-colors",
                    !notif.read && "bg-primary/5"
                  )}
                  onClick={() => onMarkRead?.(notif.id)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm",
                        !notif.read && "font-semibold"
                      )}
                    >
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                    )}
                  </div>
                  {notif.body && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notif.body}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notif.created_at), {
                      addSuffix: true,
                      locale: id,
                    })}
                  </p>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
