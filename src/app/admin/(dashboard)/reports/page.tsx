import { prisma } from "@/lib/prisma";
import { resolveReport } from "@/app/actions/reports";

export default async function ReportsPage() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      game: { select: { title: true } },
      link: { select: { label: true, url: true } },
      user: { select: { email: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>
      <div className="card divide-y divide-white/10">
        {reports.length === 0 && <p className="p-4 text-gray-400">No reports yet.</p>}
        {reports.map((r) => (
          <div key={r.id} className="flex items-start justify-between p-4 text-sm gap-4">
            <div>
              <p className="font-semibold">
                {r.reason} <span className="text-xs text-gray-500">({r.status})</span>
              </p>
              <p className="text-gray-400 text-xs">
                {r.game?.title || "General"} {r.link && <>· link: {r.link.label}</>} {r.user && <>· by {r.user.email}</>}
              </p>
              {r.message && <p className="text-gray-300 mt-1">{r.message}</p>}
            </div>
            {r.status === "OPEN" && (
              <div className="flex gap-2 whitespace-nowrap">
                <form action={resolveReport.bind(null, r.id, "RESOLVED")}>
                  <button className="text-accent2 hover:underline">Resolve</button>
                </form>
                <form action={resolveReport.bind(null, r.id, "DISMISSED")}>
                  <button className="text-gray-400 hover:underline">Dismiss</button>
                </form>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
