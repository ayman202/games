import { MetadataRoute } from "next";
import { getSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/siteUrl";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const base = getSiteUrl();
  const settings = await getSettings();
  const extraDisallow = (settings.robotsExtraDisallow || "")
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/go", "/api", ...extraDisallow] }],
    sitemap: `${base}/sitemap.xml`,
  };
}
