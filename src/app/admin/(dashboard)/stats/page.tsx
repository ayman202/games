import { prisma } from "@/lib/prisma";

export default async function StatsPage() {
  const [gameCount, userCount, contactCount, totals, topGames] = await Promise.all([
    prisma.game.count(),
    prisma.user.count(),
    prisma.contactMessage.count(),
    prisma.game.aggregate({ _sum: { views: true, downloadCount: true } }),
    prisma.game.findMany({
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { title: true, views: true, downloadCount: true },
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
  );
}
