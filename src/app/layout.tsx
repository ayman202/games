import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/lib/settings";
import { prisma } from "@/lib/prisma";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.seoDefaultTitle || `${settings.siteName} — PC Game Library`,
    description: settings.seoDefaultDescription || settings.siteDescription || "Browse and download games, organized and easy to find.",
    keywords: settings.seoKeywords || undefined,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
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

  return (
    <html lang="en" data-theme={settings.defaultTheme}>
      <body style={{ ["--accent" as any]: settings.primaryColor, ["--accent2" as any]: settings.secondaryColor }}>
        {settings.adSlotHeader && (
          <div className="text-center py-1" dangerouslySetInnerHTML={{ __html: settings.adSlotHeader }} />
        )}
        <Navbar
          siteName={settings.siteName}
          logoUrl={settings.logoUrl}
          showAbout={settings.showAboutInHeader}
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
            <div className="flex gap-4">
              <a href="/about" className="hover:text-gray-300">About</a>
              <a href="/contact" className="hover:text-gray-300">Contact</a>
              <a href="/privacy" className="hover:text-gray-300">Privacy</a>
              {staticPages.map((p) => (
                <a key={p.slug} href={`/pages/${p.slug}`} className="hover:text-gray-300">{p.title}</a>
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
