"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type ImageLightboxProps = {
  src: string;
  alt: string;
  label?: string;
};

export function ImageLightbox({ src, alt, label }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="cursor-pointer">
          <Image
            src={src}
            alt={alt}
            width={160}
            height={160}
            className="rounded-lg hover:opacity-80 transition-opacity"
          />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-4">
        <div className="relative">
          <Image
            src={src}
            alt={alt}
            width={400}
            height={400}
            className="rounded-lg mx-auto"
          />
          {label && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              {label}
            </p>
          )}
          <div className="flex justify-center mt-3">
            <Button
              variant="outline"
              size="sm"
              asChild
            >
              <a href={src} download target="_blank">
                <Download className="h-4 w-4 mr-1" />
                Download
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
