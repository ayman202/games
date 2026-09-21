import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CopyProtection from "@/components/CopyProtection";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.SITE_URL || "http://localhost:3000";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = settings.seoDefaultTitle || `${settings.siteName} — PC Game Library`;
  const description = settings.seoDefaultDescription || settings.siteDescription || "Browse and download games, organized and easy to find.";

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s — ${settings.siteName}` },
    description,
    keywords: settings.seoKeywords || undefined,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
    alternates: { canonical: "/" },
    openGraph: { title, description, siteName: settings.siteName, type: "website", url: SITE_URL },
    twitter: { card: "summary_large_image", title, description },
    robots: { index: true, follow: true },
  };
}

const SOCIAL_LABELS: Record<string, string> = {
  socialFacebook: "Facebook",
  socialTwitter: "X / Twitter",
  socialInstagram: "Instagram",
  socialYoutube: "YouTube",
  socialDiscord: "Discord",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();
  const socials = (["socialFacebook", "socialTwitter", "socialInstagram", "socialYoutube", "socialDiscord"] as const)
    .map((key) => ({ key, url: settings[key] }))
    .filter((s) => s.url);
  const staticPages = await prisma.staticPage.findMany({ orderBy: { title: "asc" }, select: { title: true, slug: true } });

  const themeCss = `
    :root {
      --accent: ${settings.primaryColor};
      --accent2: ${settings.secondaryColor};
      --bg: ${settings.backgroundColor};
      --surface: ${settings.surfaceColor};
      --hero-bg: ${settings.heroBackgroundColor};
      --hero-blob1: ${settings.heroBlob1Color};
      --hero-blob2: ${settings.heroBlob2Color};
    }
    [data-theme="light"] {
      --accent: ${settings.lightPrimaryColor};
      --accent2: ${settings.lightSecondaryColor};
      --bg: ${settings.lightBackgroundColor};
      --surface: ${settings.lightSurfaceColor};
    }
  `;

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en" data-theme={settings.defaultTheme}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body>
        {settings.enableCopyProtection && <CopyProtection />}
        {settings.adSlotHeader && (
          <div className="text-center py-1" dangerouslySetInnerHTML={{ __html: settings.adSlotHeader }} />
        )}
        <Navbar
          siteName={settings.siteName}
          logoUrl={settings.logoUrl}
          showContact={settings.showContactInHeader}
          showCategories={settings.showCategoriesInHeader}
          allowThemeToggle={settings.allowThemeToggle}
          defaultTheme={settings.defaultTheme}
        />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        {settings.adSlotFooter && (
          <div className="text-center py-2" dangerouslySetInnerHTML={{ __html: settings.adSlotFooter }} />
        )}
        <footer className="border-t border-white/10 mt-10">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-500">
            <p>{settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName}`}</p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/contact" className="hover:text-gray-300">Contact</Link>
              {staticPages.map((p) => (
                <Link key={p.slug} href={`/pages/${p.slug}`} className="hover:text-gray-300">{p.title}</Link>
              ))}
              {socials.map((s) => (
                <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer" className="hover:text-gray-300">
                  {SOCIAL_LABELS[s.key]}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
