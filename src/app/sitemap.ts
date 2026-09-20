import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL || "http://localhost:3000";
  const [games, customPages] = await Promise.all([
    prisma.game.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.staticPage.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  const pageEntries: MetadataRoute.Sitemap = customPages.map((p) => ({
    url: `${base}/pages/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const gameEntries: MetadataRoute.Sitemap = games.map((g) => ({
    url: `${base}/games/${g.slug}`,
    lastModified: g.updatedAt,
  }));

  return [...staticEntries, ...pageEntries, ...gameEntries];
}
