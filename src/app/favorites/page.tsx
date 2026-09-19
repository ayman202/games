import { getUserSession } from "@/lib/userAuth";
import { prisma } from "@/lib/prisma";
import GameCard from "@/components/GameCard";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const session = await getUserSession();
  if (!session) redirect("/login");

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.userId },
    include: { game: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Your favorites</h1>
      {favorites.length === 0 ? (
        <p className="text-gray-400">You haven't favorited any games yet.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {favorites.map((f) => (
            <GameCard
              key={f.id}
              slug={f.game.slug}
              title={f.game.title}
              coverImage={f.game.coverImage}
              category={f.game.category}
              sizeLabel={f.game.sizeLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
