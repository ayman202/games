import Link from "next/link";
import Image from "next/image";

type Props = {
  slug: string;
  title: string;
  coverImage: string | null;
  category: string;
  sizeLabel: string | null;
};

export default function GameCard({ slug, title, coverImage, category, sizeLabel }: Props) {
  return (
    <Link href={`/games/${slug}`} className="card overflow-hidden hover:border-accent transition-all flex flex-col h-full fade-in group">
      <div className="relative aspect-[3/4] bg-black/30 overflow-hidden shrink-0">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 240px, 200px"
            className="object-fill transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No cover</div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <p dir="auto" className="font-semibold text-sm leading-snug line-clamp-2 min-h-[2.5rem] break-words">
          {title}
        </p>
        <div className="flex justify-between text-xs text-gray-400 mt-auto pt-1">
          <span dir="auto" className="truncate">{category}</span>
          {sizeLabel && <span className="shrink-0 ml-2">{sizeLabel}</span>}
        </div>
      </div>
    </Link>
  );
}
