import { prisma } from "@/lib/prisma";
import { updateCategory } from "@/app/actions/categories";
import { notFound } from "next/navigation";

export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const category = await prisma.category.findUnique({ where: { id: params.id } });
  if (!category) notFound();

  const boundAction = updateCategory.bind(null, category.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit {category.name}</h1>
      <form action={boundAction} className="grid grid-cols-2 gap-3 max-w-lg">
        <input name="name" defaultValue={category.name} placeholder="Name" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent col-span-2" />
        <input name="icon" defaultValue={category.icon || ""} placeholder="Icon (emoji or URL)" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <input name="image" defaultValue={category.image || ""} placeholder="Cover image URL" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <input name="order" type="number" defaultValue={category.order} placeholder="Order" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <button className="col-span-2 bg-accent btn-on-accent rounded-lg py-2 font-semibold">Save changes</button>
      </form>
    </div>
  );
}
