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
import { getSiteUrl } from "@/lib/siteUrl";
import GameCard from "@/components/GameCard";
import { getSettings } from "@/lib/settings";
import { Tag, GitBranch, HardDrive, Eye, Download, Star } from "lucide-react";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const game = await prisma.game.findUnique({ where: { slug: params.slug } });
  if (!game) return {};
  const description = game.metaDescription || game.description.replace(/<[^>]+>/g, "").slice(0, 155);
  return {
    title: game.metaTitle || `${game.title} — GameHub`,
    description,
    alternates: { canonical: `/games/${game.slug}` },
    openGraph: { title: game.title, description, images: game.coverImage ? [game.coverImage] : [], type: "website" },
    twitter: { card: "summary_large_image", title: game.title, description, images: game.coverImage ? [game.coverImage] : undefined },
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

  let sysReq: { os?: string; cpu?: string; gpu?: string; ram?: string; storage?: string; directx?: string; extra?: { label: string; value: string }[] } | null = null;
  try {
    sysReq = game.systemRequirements ? JSON.parse(game.systemRequirements) : null;
  } catch {
    sysReq = null;
  }

  const relatedGames = game.categoryId
    ? await prisma.game.findMany({
        where: { categoryId: game.categoryId, status: "PUBLISHED", id: { not: game.id } },
        orderBy: { createdAt: "desc" },
        take: 10,
      })
    : [];

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

  const SITE_URL = getSiteUrl();
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      ...(game.category
        ? [{ "@type": "ListItem", position: 2, name: game.category.name, item: `${SITE_URL}/category/${game.category.slug}` }]
        : []),
      { "@type": "ListItem", position: game.category ? 3 : 2, name: game.title, item: `${SITE_URL}/games/${game.slug}` },
    ],
  };

  const metaItems = [
    game.category && { icon: Tag, label: game.category.name, href: `/category/${game.category.slug}` },
    game.version && { icon: GitBranch, label: `v${game.version}` },
    game.sizeLabel && { icon: HardDrive, label: game.sizeLabel },
    { icon: Eye, label: `${game.views.toLocaleString()} views` },
    { icon: Download, label: `${game.downloadCount.toLocaleString()} downloads` },
    game.ratingCount > 0 && { icon: Star, label: `${game.avgRating.toFixed(1)} (${game.ratingCount})` },
  ].filter(Boolean) as { icon: typeof Tag; label: string; href?: string }[];

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div>
        <div className="relative aspect-[3/4] card overflow-hidden bg-black/20">
          {game.coverImage ? (
            <>
              <Image src={game.coverImage} alt="" fill sizes="33vw" className="object-cover scale-125 blur-2xl opacity-50" aria-hidden />
              <Image src={game.coverImage} alt={game.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain relative" />
            </>
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
          <h1 dir="auto" className="text-3xl font-bold break-words">{game.title}</h1>
          {session && (
            <form action={toggleFavorite.bind(null, game.id)}>
              <button className={`shrink-0 px-3 py-1.5 rounded-lg text-sm border ${isFavorite ? "bg-accent border-accent" : "border-white/20 hover:border-accent"}`}>
                {isFavorite ? "★ Favorited" : "☆ Add to favorites"}
              </button>
            </form>
          )}
        </div>

        {/* Meta info — icons in their own card */}
        {metaItems.length > 0 && (
          <div className="card p-3 mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-300">
            {metaItems.map((m, i) => {
              const Icon = m.icon;
              const content = (
                <span className="flex items-center gap-1.5">
                  <Icon size={15} className="text-accent2 shrink-0" />
                  <span dir="auto">{m.label}</span>
                </span>
              );
              return m.href ? (
                <Link key={i} href={m.href} className="hover:text-accent2">
                  {content}
                </Link>
              ) : (
                <span key={i}>{content}</span>
              );
            })}
          </div>
        )}

        {/* Description — boxed like Overview, positioned above it */}
        <div dir="auto" className="prose prose-invert max-w-none card p-4 mt-4 text-gray-300" dangerouslySetInnerHTML={{ __html: game.description }} />

        {game.overview && (
          <div dir="auto" className="mt-4 card p-4">
            <h2 className="font-semibold mb-3">Overview</h2>
            <p className="text-sm text-gray-300 whitespace-pre-line break-words">{game.overview}</p>
          </div>
        )}

        {sysReq && (sysReq.os || sysReq.cpu || sysReq.gpu || sysReq.ram || sysReq.storage || sysReq.directx || (sysReq.extra && sysReq.extra.length > 0)) && (
          <div className="mt-4 card p-4">
            <h2 className="font-semibold mb-3">System requirements</h2>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {sysReq.os && <><dt className="text-gray-500">OS</dt><dd dir="auto">{sysReq.os}</dd></>}
              {sysReq.cpu && <><dt className="text-gray-500">CPU</dt><dd dir="auto">{sysReq.cpu}</dd></>}
              {sysReq.gpu && <><dt className="text-gray-500">GPU</dt><dd dir="auto">{sysReq.gpu}</dd></>}
              {sysReq.ram && <><dt className="text-gray-500">RAM</dt><dd dir="auto">{sysReq.ram}</dd></>}
              {sysReq.storage && <><dt className="text-gray-500">Storage</dt><dd dir="auto">{sysReq.storage}</dd></>}
              {sysReq.directx && <><dt className="text-gray-500">DirectX</dt><dd dir="auto">{sysReq.directx}</dd></>}
              {sysReq.extra?.map((e, i) => (
                <>
                  <dt key={`l${i}`} className="text-gray-500">{e.label}</dt>
                  <dd key={`v${i}`} dir="auto">{e.value}</dd>
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
                <a href={`/go/${link.id}`} target="_blank" rel="noopener noreferrer" className="card px-4 py-3 hover:border-accent transition-colors flex justify-between items-center">
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

        {game.note && settings.showGameNotes && (
          <div
            dir="auto"
            className="mt-4 rounded-lg p-3 text-sm"
            style={{
              border: `1px solid ${settings.noteColor}4D`,
              backgroundColor: `${settings.noteColor}1A`,
              color: settings.noteColor,
            }}
          >
            <p className="font-semibold mb-1">Note</p>
            <p className="whitespace-pre-line break-words">{game.note}</p>
          </div>
        )}

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
                <p dir="auto" className="text-sm font-semibold">{r.user.name} — {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</p>
                <p dir="auto" className="text-sm text-gray-300 mt-1 break-words">{r.comment}</p>
              </div>
            ))}
            {game.reviews.length === 0 && <p className="text-sm text-gray-500">No reviews yet — be the first.</p>}
          </div>
        </div>
        )}

        {/* Tags — moved to the very end of the page, below Reviews */}
        {game.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mt-8 pt-6 border-t border-white/10">
            {game.tags.map((t) => (
              <Link key={t.tagId} href={`/tag/${t.tag.slug}`} dir="auto" className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:border-accent">
                {t.tag.name}
              </Link>
            ))}
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
