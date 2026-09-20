import { prisma } from "@/lib/prisma";
import { getUserSession } from "@/lib/userAuth";
import { toggleFavorite } from "@/app/actions/users";
import { bumpDailyStat } from "@/lib/dailyStats";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ReportButton from "@/components/ReportButton";
import ReviewForm from "@/components/ReviewForm";
import ImageLightbox from "@/components/ImageLightbox";
import VideoBox from "@/components/VideoBox";
import GameCard from "@/components/GameCard";
import { getSettings } from "@/lib/settings";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await prisma.game.findUnique({ where: { slug: params.slug } });
  if (!game) return {};
  const description = game.metaDescription || game.description.replace(/<[^>]+>/g, "").slice(0, 155);
  return {
    title: game.metaTitle || `${game.title} — GameHub`,
    description,
    openGraph: { title: game.title, description, images: game.coverImage ? [game.coverImage] : [] },
  };
}

export default async function GamePage({ params }: { params: { slug: string } }) {
  const game = await prisma.game.findUnique({
    where: { slug: params.slug },
    include: {
      links: true,
      images: { orderBy: { order: "asc" } },
      tags: { include: { tag: true } },
      category: true,
      reviews: {
        where: { approved: true },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } },
        take: 20,
      },
    },
  });

  if (!game || game.status === "DRAFT" || game.status === "HIDDEN") notFound();
  if (game.status === "SCHEDULED" && (!game.publishAt || game.publishAt > new Date())) notFound();

  prisma.game.update({ where: { id: game.id }, data: { views: { increment: 1 } } }).catch(() => {});
  bumpDailyStat("views").catch(() => {});

  const session = await getUserSession();
  let isFavorite = false;
  let myReview = null;
  if (session) {
    const [fav, review] = await Promise.all([
      prisma.favorite.findUnique({ where: { userId_gameId: { userId: session.userId, gameId: game.id } } }),
      prisma.review.findUnique({ where: { userId_gameId: { userId: session.userId, gameId: game.id } } }),
    ]);
    isFavorite = !!fav;
    myReview = review;
  }

  const settings = await getSettings();

  const relatedGames = game.categoryId
    ? await prisma.game.findMany({
        where: { categoryId: game.categoryId, status: "PUBLISHED", id: { not: game.id } },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

  let sysReq: { os?: string; cpu?: string; gpu?: string; ram?: string; storage?: string; extra?: { label: string; value: string }[] } | null = null;
  try {
    sysReq = game.systemRequirements ? JSON.parse(game.systemRequirements) : null;
  } catch {
    sysReq = null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: game.description.replace(/<[^>]+>/g, ""),
    image: game.coverImage || undefined,
    genre: game.category?.name,
    softwareVersion: game.version || undefined,
    aggregateRating:
      game.ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: game.avgRating.toFixed(1), reviewCount: game.ratingCount }
        : undefined,
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div>
        <div className="relative aspect-[3/4] card overflow-hidden">
          {game.coverImage ? (
            <Image src={game.coverImage} alt={game.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">No cover</div>
          )}
        </div>
        {game.images.length > 0 && <ImageLightbox images={game.images} />}
        {game.videoUrl && (
          <div className="mt-2">
            <VideoBox url={game.videoUrl} />
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold">{game.title}</h1>
          {session && (
            <form action={toggleFavorite.bind(null, game.id)}>
              <button className={`px-3 py-1.5 rounded-lg text-sm border ${isFavorite ? "bg-accent border-accent" : "border-white/20 hover:border-accent"}`}>
                {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
              </button>
            </form>
          )}
        </div>

        <div className="flex gap-3 text-sm text-gray-400 mt-2 flex-wrap items-center">
          {game.category && (
            <Link href={`/category/${game.category.slug}`} className="hover:text-accent2">
              {game.category.name}
            </Link>
          )}
          {game.version && <span>v{game.version}</span>}
          {game.sizeLabel && <span>{game.sizeLabel}</span>}
          <span>{game.views.toLocaleString()} views</span>
          <span>{game.downloadCount.toLocaleString()} downloads</span>
          {game.ratingCount > 0 && <span>★ {game.avgRating.toFixed(1)} ({game.ratingCount})</span>}
        </div>

        {game.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-3">
            {game.tags.map((t) => (
              <Link key={t.tagId} href={`/tag/${t.tag.slug}`} className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:border-accent">
                {t.tag.name}
              </Link>
            ))}
          </div>
        )}

        <div
          className="prose prose-invert max-w-none mt-4 text-gray-300"
          dangerouslySetInnerHTML={{ __html: game.description }}
        />

        
        {sysReq && (sysReq.os || sysReq.cpu || sysReq.gpu || sysReq.ram || sysReq.storage || (sysReq.extra && sysReq.extra.length > 0)) && (
          <div className="mt-6 card p-4">
            <h2 className="font-semibold mb-3">System requirements</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {sysReq.os && <><dt className="text-gray-500">OS</dt><dd>{sysReq.os}</dd></>}
              {sysReq.cpu && <><dt className="text-gray-500">CPU</dt><dd>{sysReq.cpu}</dd></>}
              {sysReq.gpu && <><dt className="text-gray-500">GPU</dt><dd>{sysReq.gpu}</dd></>}
              {sysReq.ram && <><dt className="text-gray-500">RAM</dt><dd>{sysReq.ram}</dd></>}
              {sysReq.storage && <><dt className="text-gray-500">Storage</dt><dd>{sysReq.storage}</dd></>}
              {sysReq.extra?.map((e, i) => (
                <>
                  <dt key={`l${i}`} className="text-gray-500">{e.label}</dt>
                  <dd key={`v${i}`}>{e.value}</dd>
                </>
              ))}
            </dl>
          </div>
        )}

        <div className="mt-8">
          <h2 className="font-semibold mb-3">Download links</h2>
          <div className="flex flex-col gap-2">
            {game.links.map((link) => (
              <div key={link.id}>
                <a href={`/go/${link.id}`} className="card px-4 py-3 hover:border-accent transition-colors flex justify-between items-center">
                  <span>{link.label}</span>
                  <span className="text-xs text-gray-500">{link.provider}</span>
                </a>
                <div className="mt-1">
                  <ReportButton gameId={game.id} linkId={link.id} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {settings.allowReviews && (
        <div className="mt-10">
          <h2 className="font-semibold mb-3">Reviews</h2>
          {session ? (
            <div className="mb-4">
              <ReviewForm gameId={game.id} />
              {myReview && <p className="text-xs text-gray-500 mt-1">You already reviewed this — submitting again updates it.</p>}
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-4">
              <Link href="/login" className="text-accent2 hover:underline">Log in</Link> to leave a review.
            </p>
          )}
          <div className="flex flex-col gap-3">
            {game.reviews.map((r) => (
              <div key={r.id} className="card p-3">
                <p className="text-sm font-semibold">{r.user.name} — {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                <p className="text-sm text-gray-300 mt-1">{r.comment}</p>
              </div>
            ))}
            {game.reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet — be the first.</p>}
          </div>
        </div>
        )}
      </div>

      {relatedGames.length > 0 && (
        <div className="md:col-span-3 mt-4">
          <h2 className="text-xl font-bold mb-3">More in {game.category?.name}</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {relatedGames.map((g) => (
              <div key={g.id} className="w-40 shrink-0">
                <GameCard slug={g.slug} title={g.title} coverImage={g.coverImage} category={game.category?.name || ""} sizeLabel={g.sizeLabel} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
