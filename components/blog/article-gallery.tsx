"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

export function ArticleGallery({ images, title }: { images: string[]; title: string }) {
  const [selectedIdx, setSelectedIdx] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Active Featured Image Display */}
      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-xl bg-muted relative group">
        <img
          src={images[selectedIdx] || images[0]}
          alt={`${title} - Photo ${selectedIdx + 1}`}
          className="w-full h-full object-cover transition-all duration-300"
        />
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md">
            <ImageIcon className="w-4 h-4 text-primary" />
            <span>
              Photo {selectedIdx + 1} of {images.length}
            </span>
          </div>
        )}
      </div>

      {/* Gallery Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIdx(idx)}
              className={`relative rounded-xl overflow-hidden border-2 h-20 w-32 shrink-0 transition-all ${
                selectedIdx === idx
                  ? "border-primary ring-2 ring-primary/30 scale-105 shadow-md"
                  : "border-border/60 opacity-60 hover:opacity-100"
              }`}
            >
              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
