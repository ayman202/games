import GameForm from "@/components/GameForm";
import { createGame } from "@/app/actions/games";
import { prisma } from "@/lib/prisma";

export default async function NewGamePage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add a game</h1>
      <GameForm action={createGame} categories={categories} submitLabel="Create game" />
    </div>
  );
}
