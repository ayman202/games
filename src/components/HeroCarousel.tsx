"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { slug: string; title: string; coverImage: string | null; category?: string };

const SLIDE_SECONDS = 6;

export default function HeroCarousel({ games }: { games: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % games.length), SLIDE_SECONDS * 1000);
    return () => clearInterval(timer);
  }, [games.length]);

  if (games.length === 0) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 h-[22rem] md:h-[30rem] mb-12 shadow-2xl shadow-black/50 bg-black">
      {games.map((g, i) => (
        <div
          key={g.slug}
          aria-hidden={i !== index}
          className={`absolute inset-0 transition-opacity duration-[1200ms] ease-out ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {g.coverImage && (
            <Image
              key={i === index ? `active-${g.slug}` : g.slug}
              src={g.coverImage}
              alt=""
              fill
              className={`object-cover object-top ${i === index ? "ken-burns" : ""}`}
              priority={i === 0}
            />
          )}
          {/* Layered gradients for a premium storefront-banner look */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />

          <div className="absolute inset-0 flex items-end">
            <div className="p-6 md:p-10 max-w-xl">
              {g.category && (
                <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-accent2 bg-accent2/10 border border-accent2/30 rounded-full px-3 py-1 mb-3">
                  {g.category}
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg leading-tight">
                {g.title}
              </h2>
              <Link
                href={`/games/${g.slug}`}
                className="inline-flex items-center gap-2 mt-5 bg-accent text-white font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
              >
                View game <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {/* Slim progress-bar indicators instead of plain dots */}
      {games.length > 1 && (
        <div className="absolute top-4 left-0 right-0 z-20 flex gap-1.5 px-6 md:px-10">
          {games.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className="relative h-1 flex-1 rounded-full bg-white/25 overflow-hidden"
              aria-label={`Slide ${i + 1}`}
            >
              {i === index && (
                <span
                  key={index}
                  className="absolute inset-y-0 left-0 bg-white rounded-full"
                  style={{ animation: `heroProgress ${SLIDE_SECONDS}s linear forwards` }}
                />
              )}
              {i < index && <span className="absolute inset-0 bg-white rounded-full" />}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes heroProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
