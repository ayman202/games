"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Slide = { slug: string; title: string; coverImage: string | null; category?: string };

export default function HeroCarousel({ games }: { games: Slide[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (games.length <= 1) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % games.length), 4000);
    return () => clearInterval(timer);
  }, [games.length]);

  if (games.length === 0) return null;

  return (
    <div className="relative rounded-2xl overflow-hidden border border-white/10 h-64 md:h-80 mb-10">
      {games.map((g, i) => (
        <Link
          href={`/games/${g.slug}`}
          key={g.slug}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === index ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          {g.coverImage && <Image src={g.coverImage} alt={g.title} fill className="object-cover" priority={i === 0} />}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6">
            {g.category && <p className="text-xs text-accent2 mb-1">{g.category}</p>}
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">{g.title}</h2>
          </div>
        </Link>
      ))}

      <div className="absolute bottom-3 right-4 flex gap-1.5">
        {games.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-white" : "bg-white/30"}`}
          />
        ))}
      </div>
    </div>
  );
}
