import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "GameHub — PC Game Library",
  description: "Browse and download games, organized and easy to find.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-white/10 mt-10">
          <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between gap-4 text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} GameHub</p>
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
