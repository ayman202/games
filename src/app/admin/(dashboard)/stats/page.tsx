import { prisma } from "@/lib/prisma";
import StatsChart from "@/components/StatsChart";

export default async function StatsPage() {
  const [gameCount, userCount, contactCount, totals, topGames, dailyStats, topSearches, noResultSearches] =
    await Promise.all([
      prisma.game.count(),
      prisma.user.count(),
      prisma.contactMessage.count(),
      prisma.game.aggregate({ _sum: { views: true, downloadCount: true } }),
      prisma.game.findMany({
        orderBy: { downloadCount: "desc" },
        take: 5,
        select: { title: true, views: true, downloadCount: true },
      }),
      prisma.dailyStat.findMany({ orderBy: { date: "asc" }, take: 30 }),
      prisma.searchLog.groupBy({
        by: ["query"],
        _count: { query: true },
        orderBy: { _count: { query: "desc" } },
        take: 10,
      }),
      prisma.searchLog.findMany({
        where: { resultCount: 0 },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { query: true, createdAt: true },
      }),
    ]);

  const cards = [
    { label: "Games", value: gameCount },
    { label: "Registered users", value: userCount },
    { label: "Total views", value: totals._sum.views || 0 },
    { label: "Total downloads", value: totals._sum.downloadCount || 0 },
    { label: "Contact messages", value: contactCount },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Stats</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="card p-4">
            <p className="text-2xl font-bold">{c.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-4 mb-8">
        <h2 className="font-semibold mb-3">Views &amp; downloads over time</h2>
        {dailyStats.length > 0 ? (
          <StatsChart data={dailyStats.map((d) => ({ date: d.date, views: d.views, downloads: d.downloads }))} />
        ) : (
          <p className="text-gray-400 text-sm">No daily data yet — check back after some traffic comes in.</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-semibold mb-3">Top games by downloads</h2>
          <div className="card divide-y divide-white/10">
            {topGames.map((g) => (
              <div key={g.title} className="flex justify-between p-3 text-sm">
                <span>{g.title}</span>
                <span className="text-gray-400">{g.views} views · {g.downloadCount} downloads</span>
              </div>
            ))}
            {topGames.length === 0 && <p className="p-3 text-gray-400 text-sm">No data yet.</p>}
          </div>
        </div>

        <div>
          <h2 className="font-semibold mb-3">Top search terms</h2>
          <div className="card divide-y divide-white/10">
            {topSearches.map((s) => (
              <div key={s.query} className="flex justify-between p-3 text-sm">
                <span>{s.query}</span>
                <span className="text-gray-400">{s._count.query} searches</span>
              </div>
            ))}
            {topSearches.length === 0 && <p className="p-3 text-gray-400 text-sm">No searches logged yet.</p>}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Recent searches with no results (add these games!)</h2>
        <div className="card divide-y divide-white/10">
          {noResultSearches.map((s, i) => (
            <div key={i} className="flex justify-between p-3 text-sm">
              <span>{s.query}</span>
              <span className="text-gray-500 text-xs">{s.createdAt.toLocaleDateString()}</span>
            </div>
          ))}
          {noResultSearches.length === 0 && <p className="p-3 text-gray-400 text-sm">None — good sign.</p>}
        </div>
      </div>
    </div>
  );
}
