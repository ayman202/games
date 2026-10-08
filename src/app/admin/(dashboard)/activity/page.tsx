import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ActivityPage() {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") redirect("/admin");

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { admin: { select: { name: true, email: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Activity log</h1>
      <div className="card divide-y divide-white/10">
        {logs.map((l) => (
          <div key={l.id} className="p-3 text-sm flex justify-between">
            <span>
              <b>{l.admin?.name || "Unknown"}</b> — {l.action} {l.entityType && <>({l.entityType})</>} {l.details && <>: {l.details}</>}
            </span>
            <span className="text-gray-500 text-xs whitespace-nowrap">{l.createdAt.toLocaleString()}</span>
          </div>
        ))}
        {logs.length === 0 && <p className="p-4 text-gray-400">No activity yet.</p>}
      </div>
    </div>
  );
}
