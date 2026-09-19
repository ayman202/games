import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const q = searchParams.q?.trim() || "";
  const category = searchParams.category?.trim() || "";

  const [games, categories] = await Promise.all([
    prisma.game.findMany({
      where: {
        AND: [
          q ? { title: { contains: q } } : {},
          category ? { category } : {},
        ],
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.game.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);

  return (
    <div>
      <section className="mb-10 rounded-2xl bg-gradient-to-br from-accent/20 to-accent2/10 border border-white/10 p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Find your next game.
        </h1>
        <p className="text-gray-300 mt-2 max-w-xl">
          A clean, organized library — search, filter by category, and grab download links in one click.
        </p>
      </section>

      <form className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Search games..."
          className="flex-1 bg-surface border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-accent"
        />
        <select
          name="category"
          defaultValue={category}
          className="bg-surface border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-accent"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.category} value={c.category}>
              {c.category}
            </option>
          ))}
        </select>
        <button className="bg-accent text-white rounded-lg px-5 py-2 font-semibold hover:opacity-90">
          Filter
        </button>
      </form>

      {(q || category) && (
        <p className="text-sm text-gray-400 mb-4">
          {games.length} result(s) {q && <>for "{q}"</>} {category && <>in {category}</>} —{" "}
          <Link href="/" className="text-accent2 hover:underline">clear</Link>
        </p>
      )}

      {games.length === 0 ? (
        <p className="text-gray-400">No games match. Try clearing filters, or add games from the admin panel.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {games.map((g) => (
            <GameCard
              key={g.id}
              slug={g.slug}
              title={g.title}
              coverImage={g.coverImage}
              category={g.category}
              sizeLabel={g.sizeLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
