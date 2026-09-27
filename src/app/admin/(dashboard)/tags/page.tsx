import { prisma } from "@/lib/prisma";
import { deleteTag } from "@/app/actions/tags";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { games: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tags</h1>
      <p className="text-sm text-gray-400 mb-4">
        Tags are created automatically when you type them into a game's "Tags" field. Manage or remove unused ones here.
      </p>
      <div className="card divide-y divide-white/10">
        {tags.length === 0 && <p className="p-4 text-gray-400">No tags yet.</p>}
        {tags.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-semibold">{t.name}</p>
              <p className="text-xs text-gray-400">{t._count.games} game(s)</p>
            </div>
            <form action={deleteTag.bind(null, t.id)}>
              <button className="text-red-400 hover:underline text-sm">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
