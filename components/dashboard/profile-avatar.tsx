"use client";

import { useRef, useState } from "react";
import { CameraIcon, Loader2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProfileAvatar({
  src,
  fallback,
  size = "lg",
  editable = false,
  onUpload,
}: {
  src?: string | null;
  fallback: string;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onUpload?: (file: File) => Promise<void>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const sizeClass =
    size === "sm" ? "h-10 w-10" : size === "md" ? "h-16 w-16" : "h-24 w-24";

  const textSize =
    size === "sm"
      ? "text-sm"
      : size === "md"
        ? "text-lg"
        : "text-2xl";

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !onUpload) return;

    setUploading(true);
    try {
      await onUpload(file);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="relative inline-block">
      <Avatar className={cn(sizeClass)}>
        {src && <AvatarImage src={src} alt={fallback} />}
        <AvatarFallback
          className={cn("bg-primary/10 text-primary font-medium", textSize)}
        >
          {fallback.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {editable && onUpload && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full shadow-sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2Icon className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <CameraIcon className="h-3.5 w-3.5" />
            )}
          </Button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </>
      )}
    </div>
  );
}
