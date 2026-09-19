import GameForm from "@/components/GameForm";
import { updateGame } from "@/app/actions/games";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditGamePage({ params }: { params: { id: string } }) {
  const game = await prisma.game.findUnique({
    where: { id: params.id },
    include: { links: true },
  });

  if (!game) notFound();

  const boundAction = updateGame.bind(null, game.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit {game.title}</h1>
      <GameForm
        action={boundAction}
        submitLabel="Save changes"
        initial={{
          title: game.title,
          description: game.description,
          coverImage: game.coverImage || "",
          version: game.version || "",
          sizeLabel: game.sizeLabel || "",
          category: game.category,
          links: game.links.map((l) => ({ label: l.label, url: l.url })),
        }}
      />
    </div>
  );
}
