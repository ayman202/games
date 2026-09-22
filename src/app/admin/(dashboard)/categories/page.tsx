import { prisma } from "@/lib/prisma";
import { createCategory, deleteCategory } from "@/app/actions/categories";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" },
    include: { _count: { select: { games: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>

      <div className="card p-4 mb-6">
        <h2 className="font-semibold mb-3">Add a category</h2>
        <form action={createCategory} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input name="name" placeholder="Name" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="icon" placeholder="Icon (emoji or URL)" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="image" placeholder="Cover image URL" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="order" type="number" placeholder="Order" defaultValue={0} className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <button className="col-span-2 md:col-span-4 bg-accent btn-on-accent rounded-lg py-2 font-semibold">Add category</button>
        </form>
      </div>

      <div className="card divide-y divide-white/10">
        {categories.length === 0 && <p className="p-4 text-gray-400">No categories yet.</p>}
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {c.icon && <span>{c.icon}</span>}
              <div>
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-gray-400">/{c.slug} · {c._count.games} game(s) · order {c.order}</p>
              </div>
            </div>
            <form action={deleteCategory.bind(null, c.id)}>
              <button className="text-red-400 hover:underline text-sm">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
