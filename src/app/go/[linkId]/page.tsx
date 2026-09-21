import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { bumpDailyStat } from "@/lib/dailyStats";
import DownloadCountdown from "@/components/DownloadCountdown";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function DownloadWaitPage({ params }: { params: { linkId: string } }) {
  const link = await prisma.downloadLink.findUnique({
    where: { id: params.linkId },
    include: { game: { select: { title: true, slug: true } } },
  });

  if (!link) notFound();

  await prisma.$transaction([
    prisma.downloadLink.update({ where: { id: link.id }, data: { clicks: { increment: 1 } } }),
    prisma.game.update({ where: { id: link.gameId }, data: { downloadCount: { increment: 1 } } }),
  ]);
  await bumpDailyStat("downloads");

  const settings = await getSettings();

  return (
    <div className="max-w-md mx-auto text-center">
      <p className="text-sm text-gray-400 mb-1">Downloading</p>
      <h1 className="text-xl font-bold mb-6">
        <Link href={`/games/${link.game.slug}`} className="hover:text-accent2">{link.game.title}</Link>
        <span className="text-gray-500 font-normal"> — {link.label}</span>
      </h1>

      {settings.adSlotDownloadTop && (
        <div className="mb-6" dangerouslySetInnerHTML={{ __html: settings.adSlotDownloadTop }} />
      )}

      <div className="card p-8">
        <DownloadCountdown url={link.url} seconds={settings.downloadWaitSeconds} />
      </div>

      {settings.adSlotDownloadBottom && (
        <div className="mt-6" dangerouslySetInnerHTML={{ __html: settings.adSlotDownloadBottom }} />
      )}
    </div>
  );
}
