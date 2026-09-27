import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CopyProtection from "@/components/CopyProtection";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getSiteUrl } from "@/lib/siteUrl";
import { getContrastColor } from "@/lib/contrast";
import { prisma } from "@/lib/prisma";
import { FacebookIcon, XIcon, InstagramIcon, YoutubeIcon, DiscordIcon } from "@/components/icons/SocialIcons";

const SITE_URL = getSiteUrl();

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

const SOCIAL_ICONS: Record<string, (props: { className?: string }) => JSX.Element> = {
  socialFacebook: FacebookIcon,
  socialTwitter: XIcon,
  socialInstagram: InstagramIcon,
  socialYoutube: YoutubeIcon,
  socialDiscord: DiscordIcon,
};

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
      --accent-contrast: ${getContrastColor(settings.primaryColor)};
    }
    [data-theme="light"] {
      --accent: ${settings.lightPrimaryColor};
      --accent2: ${settings.lightSecondaryColor};
      --bg: ${settings.lightBackgroundColor};
      --surface: ${settings.lightSurfaceColor};
      --hero-bg: ${settings.heroBackgroundColorLight};
      --hero-blob1: ${settings.heroBlob1ColorLight};
      --hero-blob2: ${settings.heroBlob2ColorLight};
      --accent-contrast: ${getContrastColor(settings.lightPrimaryColor)};
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
          <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8 text-sm">
            <div className="text-gray-400">
              <p className="font-semibold text-gray-300 mb-1">{settings.siteName}</p>
              <p>{settings.footerText || `© ${new Date().getFullYear()} ${settings.siteName}`}</p>
            </div>

            <div className="flex flex-col gap-2 text-gray-400">
              <Link href="/contact" className="hover:text-gray-300 w-fit">اتصل بنا</Link>
              {staticPages.map((p) => (
                <Link key={p.slug} href={`/pages/${p.slug}`} dir="auto" className="hover:text-gray-300 w-fit">
                  {p.title}
                </Link>
              ))}
            </div>

            {socials.length > 0 && (
              <div className="flex sm:justify-end items-start gap-3">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.key];
                  return (
                    <a
                      key={s.key}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_LABELS[s.key]}
                      title={SOCIAL_LABELS[s.key]}
                      className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 text-gray-400 hover:text-accent2 hover:border-accent2 transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </footer>
      </body>
    </html>
  );
}
