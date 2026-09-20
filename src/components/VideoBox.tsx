"use client";

import { useState } from "react";

function parseVideo(url: string): { kind: "youtube" | "vimeo" | "file" | "link"; embedUrl?: string } {
  const yt = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (yt) return { kind: "youtube", embedUrl: `https://www.youtube.com/embed/${yt[1]}?autoplay=1` };

  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return { kind: "vimeo", embedUrl: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` };

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(url)) return { kind: "file" };

  return { kind: "link" };
}

export default function VideoBox({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const info = parseVideo(url);

  return (
    <>
      <div className="card p-4">
        <h2 className="font-semibold mb-3">Trailer</h2>
        {info.kind === "link" ? (
          <a href={url} target="_blank" rel="noopener noreferrer" className="text-accent2 hover:underline text-sm">
            ▶ Watch trailer (opens on the original site)
          </a>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="relative w-full max-w-xs aspect-video rounded-lg bg-black/50 border border-white/10 flex items-center justify-center hover:border-accent group"
          >
            <span className="w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform">
              ▶
            </span>
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-2xl aspect-video" onClick={(e) => e.stopPropagation()}>
            {info.kind === "file" ? (
              <video src={url} controls autoPlay className="w-full h-full rounded-lg" />
            ) : (
              <iframe src={info.embedUrl} className="w-full h-full rounded-lg" allow="autoplay; fullscreen" allowFullScreen title="Trailer" />
            )}
          </div>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white text-xl hover:text-red-400">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
