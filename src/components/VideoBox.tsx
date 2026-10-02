"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type VideoInfo =
  | { kind: "youtube"; id: string; embedUrl: string; thumbnail: string }
  | { kind: "vimeo"; id: string; embedUrl: string }
  | { kind: "unsupported" };

function parseVideo(url: string): VideoInfo {
  const yt = url.match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (yt) {
    const id = yt[1];
    return {
      kind: "youtube",
      id,
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1`,
      thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
    };
  }

  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:[/?]h=([a-zA-Z0-9]+))?/);
  if (vimeo) {
    const id = vimeo[1];
    const hash = vimeo[2];
    return {
      kind: "vimeo",
      id,
      embedUrl: `https://player.vimeo.com/video/${id}?autoplay=1${hash ? `&h=${hash}` : ""}`,
    };
  }

  return { kind: "unsupported" };
}

export default function VideoBox({ url }: { url: string }) {
  const [open, setOpen] = useState(false);
  const [vimeoThumb, setVimeoThumb] = useState<string | null>(null);
  const info = parseVideo(url);

  useEffect(() => {
    if (info.kind !== "vimeo") return;
    let cancelled = false;
    fetch(`https://vimeo.com/api/oembed.json?url=${encodeURIComponent(`https://vimeo.com/${info.id}`)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data?.thumbnail_url) setVimeoThumb(data.thumbnail_url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  if (info.kind === "unsupported") return null;

  const thumbnail = info.kind === "youtube" ? info.thumbnail : vimeoThumb;

  return (
    <>
      <div className="card p-4">
        <h2 className="font-semibold mb-3">Trailer</h2>
        <button
          onClick={() => setOpen(true)}
          className="relative w-full max-w-xs aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/10 flex items-center justify-center hover:border-accent group"
        >
          {thumbnail && <Image src={thumbnail} alt="" fill sizes="320px" className="object-cover" unoptimized />}
          <span className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <span className="relative w-12 h-12 rounded-full bg-accent/90 flex items-center justify-center btn-on-accent text-xl group-hover:scale-110 transition-transform">
            ▶
          </span>
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-2xl aspect-video" onClick={(e) => e.stopPropagation()}>
            <iframe src={info.embedUrl} className="w-full h-full rounded-lg" allow="autoplay; fullscreen" allowFullScreen title="Trailer" />
          </div>
          <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-white text-xl hover:text-red-400">
            ✕
          </button>
        </div>
      )}
    </>
  );
}
