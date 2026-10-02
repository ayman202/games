import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const [games, customPages, categories, settings] = await Promise.all([
    prisma.game.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
    prisma.staticPage.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true } }),
    getSettings(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date() },
    { url: `${base}/contact`, lastModified: new Date() },
  ];

  const categoryEntries: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/category/${c.slug}`,
    lastModified: new Date(),
  }));

  const pageEntries: MetadataRoute.Sitemap = customPages.map((p) => ({
    url: `${base}/pages/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const gameEntries: MetadataRoute.Sitemap = games.map((g) => ({
    url: `${base}/games/${g.slug}`,
    lastModified: g.updatedAt,
  }));

  const extraEntries: MetadataRoute.Sitemap = (settings.sitemapExtraUrls || "")
    .split("\n")
    .map((u) => u.trim())
    .filter(Boolean)
    .map((path) => ({ url: path.startsWith("http") ? path : `${base}${path}`, lastModified: new Date() }));

  return [...staticEntries, ...categoryEntries, ...pageEntries, ...gameEntries, ...extraEntries];
}
