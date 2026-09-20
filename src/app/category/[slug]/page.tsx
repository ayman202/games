import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";

const PAGE_SIZE = 20;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } });
  if (!category) notFound();

  const page = Math.max(1, Number(searchParams.page || 1));

  const [games, total] = await Promise.all([
    prisma.game.findMany({
      where: { categoryId: category.id, status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.game.count({ where: { categoryId: category.id, status: "PUBLISHED" } }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {category.icon && <span className="mr-2">{category.icon}</span>}
        {category.name}
      </h1>
      {games.length === 0 ? (
        <p className="text-gray-400">No games in this category yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((g) => (
              <GameCard key={g.id} slug={g.slug} title={g.title} coverImage={g.coverImage} category={category.name} sizeLabel={g.sizeLabel} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} basePath={`/category/${category.slug}`} />
        </>
      )}
    </div>
  );
}
