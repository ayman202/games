import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — GameHub",
  description: "What GameHub is and how the library is organized.",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">About GameHub</h1>
      <p className="text-gray-300 leading-relaxed">
        GameHub is a game library and download hub. Browse titles by category, check details
        like version and size before downloading, and keep track of your favorites once you
        create an account. Edit this page's text in{" "}
        <code className="text-accent2">src/app/about/page.tsx</code> to describe your own project,
        team, and mission.
      </p>
    </div>
  );
}
