import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deleteGame } from "@/app/actions/games";

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "text-gray-400",
  SCHEDULED: "text-yellow-400",
  PUBLISHED: "text-accent2",
  HIDDEN: "text-red-400",
};

export default async function AdminDashboard() {
  const games = await prisma.game.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Games</h1>
        <Link href="/admin/games/new" className="bg-accent btn-on-accent px-4 py-2 rounded-lg font-semibold">
          + Add game
        </Link>
      </div>

      <div className="card divide-y divide-white/10">
        {games.length === 0 && <p className="p-4 text-gray-400">No games yet.</p>}
        {games.map((g) => (
          <div key={g.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">
                {g.title} <span className={`text-xs font-normal ${STATUS_COLORS[g.status]}`}>({g.status})</span>
              </p>
              <p className="text-xs text-gray-400">
                {g.category?.name || "Uncategorized"} · /{g.slug} · {g.views} views · {g.downloadCount} downloads
                {g.ratingCount > 0 && <> · ★ {g.avgRating.toFixed(1)} ({g.ratingCount})</>}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <Link href={`/admin/games/${g.id}`} className="text-accent2 hover:underline">Edit</Link>
              <form action={deleteGame.bind(null, g.id)}>
                <button className="text-red-400 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
