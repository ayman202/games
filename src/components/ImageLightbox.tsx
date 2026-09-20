"use client";

import { useState } from "react";
import Image from "next/image";

export default function ImageLightbox({ images }: { images: { id: string; url: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 mt-2">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setOpenIndex(i)}
            className="relative aspect-video card overflow-hidden cursor-zoom-in"
          >
            <Image src={img.url} alt="" fill className="object-cover" />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setOpenIndex(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 text-white text-3xl px-3 py-1 hover:text-accent2"
          >
            ‹
          </button>

          <div className="relative w-full max-w-3xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <Image src={images[openIndex].url} alt="" fill className="object-contain" />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenIndex((openIndex + 1) % images.length);
            }}
            className="absolute right-4 text-white text-3xl px-3 py-1 hover:text-accent2"
          >
            ›
          </button>

          <button onClick={() => setOpenIndex(null)} className="absolute top-4 right-4 text-white text-xl hover:text-red-400">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
