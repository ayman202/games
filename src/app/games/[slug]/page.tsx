import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { toggleFavorite } from "@/app/actions/users";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await prisma.game.findUnique({ where: { slug: params.slug } });
  if (!game) return {};
  return {
    title: `${game.title} — GameHub`,
    description: game.description.slice(0, 155),
    openGraph: {
      title: game.title,
      description: game.description.slice(0, 155),
      images: game.coverImage ? [game.coverImage] : [],
    },
  };
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await prisma.game.findUnique({
    where: { slug: params.slug },
    include: { links: true },
  });

  if (!game) notFound();

  // Fire-and-forget view counter (don't block rendering on it).
  prisma.game.update({ where: { id: game.id }, data: { views: { increment: 1 } } }).catch(() => {});

  const session = await getUserSession();
  let isFavorite = false;
  if (session) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_gameId: { userId: session.userId, gameId: game.id } },
    });
    isFavorite = !!fav;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description,
    image: game.coverImage || undefined,
    genre: game.category,
    softwareVersion: game.version || undefined,
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative aspect-[3/4] card overflow-hidden">
        {game.coverImage ? (
          <Image src={game.coverImage} alt={game.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">No cover</div>
        )}
      </div>

      <div className="md:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{game.title}</h1>
          {session && (
            <form action={toggleFavorite.bind(null, game.id)}>
              <button
                className={`px-3 py-1.5 rounded-lg text-sm border ${
                  isFavorite ? "bg-accent border-accent" : "border-white/20 hover:border-accent"
                }`}
              >
                {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
              </button>
            </form>
          )}
        </div>

        <div className="flex gap-3 text-sm text-gray-400 mt-2 flex-wrap">
          <span>{game.category}</span>
          {game.version && <span>v{game.version}</span>}
          {game.sizeLabel && <span>{game.sizeLabel}</span>}
          <span>{game.views.toLocaleString()} views</span>
          <span>{game.downloadCount.toLocaleString()} downloads</span>
        </div>

        <p className="mt-4 text-gray-300 whitespace-pre-line">{game.description}</p>

        <div className="mt-8">
          <h2 className="font-semibold mb-3">Download links</h2>
          <div className="flex flex-col gap-2">
            {game.links.map((link) => (
              <a
                key={link.id}
                href={`/go/${link.id}`}
                className="card px-4 py-3 hover:border-accent transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
