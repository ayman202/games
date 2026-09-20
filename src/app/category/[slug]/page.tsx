import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const games = await prisma.game.findMany({
    where: { categoryId: category.id, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {category.icon && <span className="mr-2">{category.icon}</span>}
        {category.name}
      </h1>
      {games.length === 0 ? (
        <p className="text-gray-400">No games in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((g) => (
            <GameCard key={g.id} slug={g.slug} title={g.title} coverImage={g.coverImage} category={category.name} sizeLabel={g.sizeLabel} />
          ))}
        </div>
      )}
    </div>
  );
}
