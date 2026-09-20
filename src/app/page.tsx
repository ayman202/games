import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import Link from "next/link";
import { guardMaintenance } from "@/lib/maintenance";
import { promoteScheduledGames } from "@/app/actions/games";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  await guardMaintenance();
  await promoteScheduledGames();

  const q = searchParams.q?.trim() || "";
  const categorySlug = searchParams.category?.trim() || "";

  const [games, categories] = await Promise.all([
    prisma.game.findMany({
      where: {
        status: "PUBLISHED",
        AND: [
          q ? { title: { contains: q, mode: "insensitive" } } : {},
          categorySlug ? { category: { slug: categorySlug } } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (q) {
    prisma.searchLog.create({ data: { query: q, resultCount: games.length } }).catch(() => {});
  }

  return (
    <div>
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/10 border border-white/10 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Find your next game.</h1>
        <p className="text-gray-300 mt-2 max-w-xl">
          A clean, organized library — search, filter by category, and grab download links in one click.
        </p>
      </section>

      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-full text-sm border ${!categorySlug ? "bg-accent border-accent" : "border-white/15 hover:border-accent"}`}
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/?category=${c.slug}`}
              className={`px-3 py-1.5 rounded-full text-sm border ${categorySlug === c.slug ? "bg-accent border-accent" : "border-white/15 hover:border-accent"}`}
            >
              {c.icon && <span className="mr-1">{c.icon}</span>}
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <form className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search games..."
          className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-accent"
        />
        {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
        <button className="bg-accent text-white rounded-lg px-5 py-2 font-semibold hover:opacity-90">Search</button>
      </form>

      {(q || categorySlug) && (
        <p className="text-sm text-gray-400 mb-4">
          {games.length} result(s) {q && <>for "{q}"</>} — <Link href="/" className="text-accent2 hover:underline">clear</Link>
        </p>
      )}

      {games.length === 0 ? (
        <p className="text-gray-400">No games match. Try clearing filters, or add games from the admin panel.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((g) => (
            <GameCard key={g.id} slug={g.slug} title={g.title} coverImage={g.coverImage} category={g.category?.name || "General"} sizeLabel={g.sizeLabel} />
          ))}
        </div>
      )}
    </div>
  );
}
