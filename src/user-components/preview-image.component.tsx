"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface PreviewImageProps {
  src: string;
  alt?: string;
  className?: string;
}

export function PreviewImage({ src, alt = "Preview", className }: PreviewImageProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-pointer">
          <img
            src={src}
            alt={alt}
            width={150}
            height={150}
            className={`rounded-lg object-cover ${className ?? ""}`}
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-4xl p-4">
        <DialogTitle className="sr-only">Halo</DialogTitle>
        <div className="flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            width={800}
            height={800}
            className="rounded-lg object-contain max-h-[80vh] w-auto"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
