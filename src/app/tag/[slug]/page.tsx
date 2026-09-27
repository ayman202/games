import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import Pagination from "@/components/Pagination";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const PAGE_SIZE = 20;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });
  if (!tag) return {};
  return {
    title: `${tag.name} games`,
    description: `Games tagged "${tag.name}".`,
    alternates: { canonical: `/tag/${tag.slug}` },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { page?: string };
}) {
  const tag = await prisma.tag.findUnique({ where: { slug: params.slug } });
  if (!tag) notFound();

  const page = Math.max(1, Number(searchParams.page || 1));
  const where = { tagId: tag.id, game: { status: "PUBLISHED" as const } };

  const [links, total] = await Promise.all([
    prisma.gameTag.findMany({
      where,
      include: { game: { include: { category: true } } },
      orderBy: { game: { createdAt: "desc" } },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.gameTag.count({ where }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">#{tag.name}</h1>
      {links.length === 0 ? (
        <p className="text-gray-400">No games with this tag yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {links.map((l) => (
              <GameCard key={l.game.id} slug={l.game.slug} title={l.game.title} coverImage={l.game.coverImage} category={l.game.category?.name || "General"} sizeLabel={l.game.sizeLabel} />
            ))}
          </div>
          <Pagination currentPage={page} totalPages={Math.ceil(total / PAGE_SIZE)} basePath={`/tag/${tag.slug}`} />
        </>
      )}
    </div>
  );
}
