"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { slug: string; title: string; coverImage: string | null; category?: string; description?: string };

const SLIDE_SECONDS = 6;

function plainText(text: string) {
  return text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export default function HeroCarousel({ games }: { games: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % games.length), SLIDE_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [games.length]);

  if (games.length === 0) return null;
  const active = games[index];

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl shadow-black/50 h-72 md:h-80">
      {/* Animated gradient-mesh backdrop, colors fully controlled from Site settings */}
      <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-bg)" }}>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] animate-pulse opacity-30" style={{ backgroundColor: "var(--hero-blob1)" }} />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-[110px] animate-pulse opacity-20" style={{ backgroundColor: "var(--hero-blob2)", animationDelay: "1.5s" }} />
      </div>

      {/* Fixed-height layout: poster on the left, text card fully on the right */}
      <div className="relative h-full grid grid-cols-[auto_1fr] md:grid-cols-2 gap-4 md:gap-6 items-center px-4 md:px-12 py-4">
        {/* Poster — full artwork, never cropped */}
        <div className="flex justify-center h-full items-center">
          <div key={active.slug} className="relative w-24 h-56 md:w-44 md:h-64 fade-in">
            <div className="absolute inset-0 rounded-2xl bg-black/40 blur-2xl scale-95 translate-y-4" />
            {active.coverImage ? (
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/30">
                <Image
                  src={active.coverImage}
                  alt={active.title}
                  fill
                  sizes="(max-width: 768px) 96px, 176px"
                  style={{ objectFit: "fill", width: "100%", height: "100%" }}
                  priority={index === 0}
                />
              </div>
            ) : (
              <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10" />
            )}
          </div>
        </div>

        {/* Text card — fully on the right, fixed height, content clamped so it never grows the hero */}
        <div className="h-full flex flex-col justify-center text-right overflow-hidden">
          {active.category && (
            <span className="inline-block self-end text-[10px] font-semibold tracking-wide uppercase text-accent2 bg-black/50 border border-accent2/40 rounded-full px-3 py-1 mb-2 w-fit">
              {active.category}
            </span>
          )}
          <h2
            key={active.slug}
            dir="auto"
            className="text-lg md:text-2xl font-extrabold text-white leading-tight fade-in line-clamp-2"
          >
            {active.title}
          </h2>
          {active.description && (
            <p
              key={`${active.slug}-desc`}
              dir="auto"
              className="text-gray-300 text-sm mt-2 fade-in line-clamp-2 md:line-clamp-3"
            >
              {plainText(active.description)}
            </p>
          )}
          <Link
            href={`/games/${active.slug}`}
            className="inline-flex items-center gap-2 self-end mt-3 bg-accent btn-on-accent font-semibold px-4 py-2 text-sm rounded-xl hover:opacity-90 hover:gap-3 transition-all w-fit"
          >
            View game <span aria-hidden>←</span>
          </Link>

          {games.length > 1 && (
            <div className="flex justify-end gap-1.5 mt-4">
              {games.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="relative h-1 w-6 rounded-full bg-white/15 overflow-hidden"
                  aria-label={`Slide ${i + 1}`}
                >
                  {i === index && (
                    <span key={index} className="absolute inset-y-0 left-0 bg-white rounded-full" style={{ animation: `heroProgress ${SLIDE_SECONDS}s linear forwards` }} />
                  )}
                  {i < index && <span className="absolute inset-0 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
