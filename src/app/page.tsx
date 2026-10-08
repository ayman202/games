import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import HeroCarousel from "@/components/HeroCarousel";
import Pagination from "@/components/Pagination";
import Link from "next/link";
import { Fragment } from "react";
import { guardMaintenance } from "@/lib/maintenance";
import { getSettings } from "@/lib/settings";
import { promoteScheduledGames } from "@/app/actions/games";
import type { Metadata } from "next";

const PAGE_SIZE = 20;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; page?: string };
}): Promise<Metadata> {
  const isFiltering = !!(searchParams.q || searchParams.category);
  const isPaged = Number(searchParams.page || 1) > 1;
  return {
    alternates: { canonical: "/" },
    robots: isFiltering || isPaged ? { index: false, follow: true } : { index: true, follow: true },
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; page?: string };
}) {
  await guardMaintenance();
  await promoteScheduledGames();

  const q = searchParams.q?.trim() || "";
  const categorySlug = searchParams.category?.trim() || "";
  const isFiltering = !!(q || categorySlug);
  const page = Math.max(1, Number(searchParams.page || 1));

  if (isFiltering) {
    const where = {
      status: "PUBLISHED" as const,
      AND: [
        q ? { title: { contains: q, mode: "insensitive" as const } } : {},
        categorySlug ? { category: { slug: categorySlug } } : {},
      ],
    };

    const [games, total] = await Promise.all([
      prisma.game.findMany({
        where,
        orderBy: { createdAt: "desc" },
        include: { category: true },
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
      }),
      prisma.game.count({ where }),
    ]);

    if (q && page === 1) {
      prisma.searchLog.create({ data: { query: q, resultCount: total } }).catch(() => {});
    }

    return (
      <div>
        <SearchBar q={q} categorySlug={categorySlug} />
        <p className="text-sm text-gray-400 mb-4">
          {total} result(s) {q && <>for "{q}"</>} — <Link href="/" className="text-accent2 hover:underline">clear</Link>
        </p>
        {games.length === 0 ? (
          <p className="text-gray-400">No games match. Try clearing filters.</p>
        ) : (
          <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {games.map((g) => (
              <GameCard key={g.id} slug={g.slug} title={g.title} coverImage={g.coverImage} category={g.category?.name || "General"} sizeLabel={g.sizeLabel} />
            ))}
          </div>
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / PAGE_SIZE)}
            basePath="/"
            extraParams={{ ...(q ? { q } : {}), ...(categorySlug ? { category: categorySlug } : {}) }}
          />
          </>
        )}
      </div>
    );
  }

  const settings = await getSettings();

  const [featured, categories] = await Promise.all([
    prisma.game.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { createdAt: "desc" },
      take: settings.heroImageCount,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  const rows = await Promise.all(
    categories.map(async (c) => ({
      category: c,
      games: await prisma.game.findMany({
        where: { categoryId: c.id, status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    }))
  );

  const uncategorized = await prisma.game.findMany({
    where: { categoryId: null, status: "PUBLISHED" },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const visibleRows = rows.filter((r) => r.games.length > 0);

  return (
    <div>
      <HeroCarousel games={featured.map((g) => ({ slug: g.slug, title: g.title, coverImage: g.coverImage, category: g.category?.name, description: g.description }))} />

      <SearchBar q={q} categorySlug={categorySlug} />

      <div className="flex flex-col gap-10 mt-8">
        {visibleRows.map((r, i) => (
          <Fragment key={r.category.id}>
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">
                  {r.category.icon && <span className="mr-2">{r.category.icon}</span>}
                  {r.category.name}
                </h2>
                <Link href={`/category/${r.category.slug}`} className="text-sm text-accent2 hover:underline">
                  See all
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {r.games.map((g) => (
                  <div key={g.id} className="w-40 shrink-0">
                    <GameCard slug={g.slug} title={g.title} coverImage={g.coverImage} category={r.category.name} sizeLabel={g.sizeLabel} />
                  </div>
                ))}
              </div>
            </section>
            {settings.adSlotHomeBetweenRows && i < visibleRows.length - 1 && (
              <div className="flex justify-center">
                <div dangerouslySetInnerHTML={{ __html: settings.adSlotHomeBetweenRows }} />
              </div>
            )}
          </Fragment>
        ))}

        {uncategorized.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3">More games</h2>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {uncategorized.map((g) => (
                <div key={g.id} className="w-40 shrink-0">
                  <GameCard slug={g.slug} title={g.title} coverImage={g.coverImage} category="General" sizeLabel={g.sizeLabel} />
                </div>
              ))}
            </div>
          </section>
        )}

        {visibleRows.length === 0 && uncategorized.length === 0 && (
          <p className="text-gray-400">No games yet. Add some from the admin panel.</p>
        )}
      </div>
    </div>
  );
}

function SearchBar({ q, categorySlug }: { q: string; categorySlug: string }) {
  return (
    <form className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        name="q"
        defaultValue={q}
        placeholder="Search games..."
        className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-accent"
      />
      {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
      <button className="bg-accent btn-on-accent rounded-lg px-5 py-2 font-semibold hover:opacity-90">Search</button>
    </form>
  );
}
