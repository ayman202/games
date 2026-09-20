import GameForm from "@/components/GameForm";
import { updateGame } from "@/app/actions/games";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditGamePage({ params }: { params: { id: string } }) {
  const [game, categories] = await Promise.all([
    prisma.game.findUnique({
      where: { id: params.id },
      include: { links: true, images: true, tags: { include: { tag: true } } },
    }),
    prisma.category.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!game) notFound();

  const boundAction = updateGame.bind(null, game.id);
  let sysReq;
  try {
    sysReq = game.systemRequirements ? JSON.parse(game.systemRequirements) : undefined;
  } catch {
    sysReq = undefined;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit {game.title}</h1>
      <GameForm
        action={boundAction}
        categories={categories}
        submitLabel="Save changes"
        initial={{
          title: game.title,
          description: game.description,
          coverImage: game.coverImage || "",
          version: game.version || "",
          sizeLabel: game.sizeLabel || "",
          categoryId: game.categoryId || "",
          status: game.status,
          publishAt: game.publishAt ? game.publishAt.toISOString().slice(0, 16) : "",
          metaTitle: game.metaTitle || "",
          metaDescription: game.metaDescription || "",
          videoUrl: game.videoUrl || "",
          systemRequirements: sysReq,
          tags: game.tags.map((t) => t.tag.name).join(", "),
          imageUrls: game.images.map((i) => i.url).join("\n"),
          links: game.links.map((l) => ({ label: l.label, url: l.url, provider: l.provider })),
        }}
      />
    </div>
  );
}
