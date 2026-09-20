import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const games = await prisma.game.findMany({ select: { slug: true, updatedAt: true } });

  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
  ];

  const gamePages: MetadataRoute.Sitemap = games.map((g) => ({
    url: `${base}/games/${g.slug}`,
    lastModified: g.updatedAt,
  }));

  return [...staticPages, ...gamePages];
}
