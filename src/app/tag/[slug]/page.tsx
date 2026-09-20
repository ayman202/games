import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import { notFound } from "next/navigation";

export default async function TagPage({ params }: { params: { slug: string } }) {
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });
  if (!tag) notFound();

  const links = await prisma.gameTag.findMany({
    where: { tagId: tag.id, game: { status: "PUBLISHED" } },
    include: { game: { include: { category: true } } },
    orderBy: { game: { createdAt: "desc" } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">#{tag.name}</h1>
      {links.length === 0 ? (
        <p className="text-gray-400">No games with this tag yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {links.map((l) => (
            <GameCard key={l.game.id} slug={l.game.slug} title={l.game.title} coverImage={l.game.coverImage} category={l.game.category?.name || "General"} sizeLabel={l.game.sizeLabel} />
          ))}
        </div>
      )}
    </div>
  );
}
