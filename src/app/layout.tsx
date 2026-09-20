import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/lib/settings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: `${settings.siteName} — PC Game Library`,
    description: "Browse and download games, organized and easy to find.",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="en">
      <body style={{ ["--accent" as any]: settings.primaryColor }}>
        {settings.adSlotHeader && (
          <div className="text-center py-1" dangerouslySetInnerHTML={{ __html: settings.adSlotHeader }} />
        )}
        <Navbar siteName={settings.siteName} logoUrl={settings.logoUrl} />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        {settings.adSlotFooter && (
          <div className="text-center py-2" dangerouslySetInnerHTML={{ __html: settings.adSlotFooter }} />
        )}
        <footer className="border-t border-white/10 mt-10">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} {settings.siteName}</p>
            <div className="flex gap-4">
              <a href="/about" className="hover:text-gray-300">About</a>
              <a href="/contact" className="hover:text-gray-300">Contact</a>
              <a href="/privacy" className="hover:text-gray-300">Privacy</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
