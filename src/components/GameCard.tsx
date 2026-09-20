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
    <Link href={`/games/${slug}`} className="card overflow-hidden hover:border-accent transition-colors block">
      <div className="relative aspect-[3/4] bg-black/30">
        {coverImage ? (
          <Image src={coverImage} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">No cover</div>
        )}
      </div>
      <div className="p-3">
        <p className="font-semibold truncate">{title}</p>
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{category}</span>
          {sizeLabel && <span>{sizeLabel}</span>}
        </div>
      </div>
    </Link>
  );
}
