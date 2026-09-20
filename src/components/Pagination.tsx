import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  extraParams = {},
}: {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}) {
  if (totalPages <= 1) return null;

  function pageUrl(p: number) {
    const params = new URLSearchParams(extraParams);
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  const pages: (number | "...")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1) pages.push(p);
    else if (pages[pages.length - 1] !== "...") pages.push("...");
  }

  return (
    <div className="flex justify-center gap-1.5 mt-8 text-sm">
      <Link
        href={pageUrl(Math.max(1, currentPage - 1))}
        className={`px-3 py-1.5 rounded-lg border border-white/10 ${currentPage === 1 ? "pointer-events-none opacity-40" : "hover:border-accent"}`}
      >
        ‹
      </Link>
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`dots${i}`} className="px-2 py-1.5 text-gray-500">…</span>
        ) : (
          <Link
            key={p}
            href={pageUrl(p)}
            className={`px-3 py-1.5 rounded-lg border ${p === currentPage ? "bg-accent border-accent" : "border-white/10 hover:border-accent"}`}
          >
            {p}
          </Link>
        )
      )}
      <Link
        href={pageUrl(Math.min(totalPages, currentPage + 1))}
        className={`px-3 py-1.5 rounded-lg border border-white/10 ${currentPage === totalPages ? "pointer-events-none opacity-40" : "hover:border-accent"}`}
      >
        ›
      </Link>
    </div>
  );
}
