"use client";

import { useEffect, useState } from "react";

export default function DownloadCountdown({ url, seconds }: { url: string; seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining]);

  const progress = seconds > 0 ? ((seconds - remaining) / seconds) * 100 : 100;

  return (
    <div className="flex flex-col items-center gap-4">
      {remaining > 0 ? (
        <>
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
              <path d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
              <path
                d="M18 2a16 16 0 1 1 0 32 16 16 0 0 1 0-32"
                fill="none"
                stroke="var(--accent, #7c5cff)"
                strokeWidth="3"
                strokeDasharray={`${progress}, 100`}
                style={{ transition: "stroke-dasharray 1s linear" }}
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold">{remaining}</span>
          </div>
          <p className="text-gray-400 text-sm">Preparing your download link...</p>
        </>
      ) : (
        <a
          href={url}
          className="bg-accent text-white font-semibold px-8 py-3 rounded-xl hover:opacity-90 transition-opacity text-lg"
        >
          ⬇ Download now
        </a>
      )}
    </div>
  );
}
