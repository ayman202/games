"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { slug: string; title: string; coverImage: string | null; category?: string; description?: string };

const SLIDE_SECONDS = 6;

function truncate(text: string, max: number) {
  const plain = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > max ? plain.slice(0, max).trim() + "…" : plain;
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
    <div className="relative rounded-3xl overflow-hidden border border-white/10 mb-12 shadow-2xl shadow-black/50">
      {/* Animated gradient-mesh backdrop, colors fully controlled from Site settings */}
      <div className="absolute inset-0" style={{ backgroundColor: "var(--hero-bg)" }}>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-[100px] animate-pulse opacity-30" style={{ backgroundColor: "var(--hero-blob1)" }} />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-[110px] animate-pulse opacity-20" style={{ backgroundColor: "var(--hero-blob2)", animationDelay: "1.5s" }} />
      </div>

      <div className="relative grid md:grid-cols-2 gap-6 items-center p-6 md:p-12 min-h-[24rem] md:min-h-[26rem]">
        {/* Text side */}
        <div className="order-2 md:order-1 text-center md:text-left">
          {active.category && (
            <span className="inline-block text-[11px] font-semibold tracking-wide uppercase text-accent2 bg-black/50 border border-accent2/40 rounded-full px-3 py-1 mb-4">
              {active.category}
            </span>
          )}
          <h2 key={active.slug} className="text-3xl md:text-5xl font-extrabold text-white leading-tight fade-in">
            {active.title}
          </h2>
          {active.description && (
            <p key={`${active.slug}-desc`} className="text-gray-300 mt-3 max-w-md mx-auto md:mx-0 fade-in">
              {truncate(active.description, 140)}
            </p>
          )}
          <Link
            href={`/games/${active.slug}`}
            className="inline-flex items-center gap-2 mt-6 bg-accent btn-on-accent font-semibold px-6 py-3 rounded-xl hover:opacity-90 hover:gap-3 transition-all"
          >
            View game <span aria-hidden>→</span>
          </Link>

          {games.length > 1 && (
            <div className="flex md:justify-start justify-center gap-1.5 mt-8">
              {games.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className="relative h-1 w-8 rounded-full bg-white/15 overflow-hidden"
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

        {/* Poster side — full artwork, never cropped, floating with its own shadow */}
        <div className="order-1 md:order-2 flex justify-center">
          <div key={active.slug} className="relative w-40 md:w-56 aspect-[3/4] fade-in">
            <div className="absolute inset-0 rounded-2xl bg-black/40 blur-2xl scale-95 translate-y-4" />
            {active.coverImage ? (
              <Image
                src={active.coverImage}
                alt={active.title}
                fill
                sizes="(max-width: 768px) 160px, 224px"
                className="object-cover rounded-2xl border border-white/10 shadow-2xl relative"
                priority={index === 0}
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-white/5 border border-white/10" />
            )}
          </div>
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
