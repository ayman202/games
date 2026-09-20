"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { slug: string; title: string; coverImage: string | null; category?: string };

export default function HeroCarousel({ games }: { games: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % games.length), 5000);
    return () => clearInterval(timer);
  }, [games.length]);

  if (games.length === 0) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 h-72 md:h-96 mb-10 shadow-2xl shadow-black/40 bg-black/40">
      {games.map((g, i) => (
        <div
          key={g.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
        >
          {g.coverImage && (
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={g.coverImage}
                alt=""
                fill
                className={`object-contain ${i === index ? "ken-burns" : ""}`}
                priority={i === 0}
              />
              {/* Soft blurred backdrop so a portrait cover still fills the wide banner nicely */}
              <Image src={g.coverImage} alt="" fill className="object-cover blur-2xl scale-110 opacity-30 -z-10" aria-hidden />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

          <Link href={`/games/${g.slug}`} className="absolute bottom-0 left-0 p-6 max-w-lg">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              {g.category && <p className="text-xs text-accent2 mb-1">{g.category}</p>}
              <h2 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow">{g.title}</h2>
              <span className="inline-block mt-2 text-sm text-accent2 hover:underline">View game →</span>
            </div>
          </Link>
        </div>
      ))}

      <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-colors ${i === index ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
