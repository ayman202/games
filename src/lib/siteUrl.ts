/**
 * Resolves the canonical public URL of the site.
 * Priority: explicit SITE_URL env var → Vercel's production URL → Vercel's deployment URL → localhost.
 * This means sitemap.xml, robots.txt, and canonical tags are correct on Vercel
 * even if SITE_URL was never set manually.
 */
export function getSiteUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}
