import { prisma } from "@/lib/prisma";
import CheckLinkButton from "@/components/CheckLinkButton";
import Link from "next/link";

export default async function LinksPage() {
  const links = await prisma.downloadLink.findMany({
    orderBy: { createdAt: "desc" },
    include: { game: { select: { title: true, slug: true, id: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Download links</h1>
      <div className="card divide-y divide-white/10">
        {links.length === 0 && <p className="p-4 text-gray-400">No links yet.</p>}
        {links.map((l) => (
          <div key={l.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-semibold">
                {l.label} <span className="text-xs text-gray-500">({l.provider})</span>
              </p>
              <p className="text-xs text-gray-400">
                <Link href={`/admin/games/${l.game.id}`} className="hover:underline">{l.game.title}</Link>
                {" · "}{l.clicks} clicks
                {l.lastCheckedAt && (
                  <>
                    {" · "}
                    {l.isWorking ? <span className="text-accent2">working</span> : <span className="text-red-400">dead link</span>}
                    {" "}(checked {l.lastCheckedAt.toLocaleString()})
                  </>
                )}
                {!l.lastCheckedAt && <> · not checked yet</>}
              </p>
            </div>
            <CheckLinkButton linkId={l.id} />
          </div>
        ))}
      </div>
    </div>
  );
}
