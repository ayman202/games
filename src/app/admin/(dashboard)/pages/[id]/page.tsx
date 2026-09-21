import { prisma } from "@/lib/prisma";
import { updateStaticPage } from "@/app/actions/pages";
import RichTextEditor from "@/components/RichTextEditor";
import { notFound } from "next/navigation";

export default async function EditStaticPage({ params }: { params: { id: string } }) {
  const page = await prisma.staticPage.findUnique({ where: { id: params.id } });
  if (!page) notFound();

  const boundAction = updateStaticPage.bind(null, page.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit {page.title}</h1>
      <form action={boundAction} className="flex flex-col gap-4 max-w-2xl">
        <input name="title" defaultValue={page.title} required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <RichTextEditor name="content" defaultValue={page.content} />
        <button className="bg-accent rounded-lg py-2 font-semibold">Save changes</button>
      </form>
    </div>
  );
}
