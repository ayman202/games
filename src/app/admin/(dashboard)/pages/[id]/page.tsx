import { prisma } from "@/lib/prisma";
import { updateStaticPage } from "@/app/actions/pages";
import RichTextEditor from "@/components/RichTextEditor";
import { notFound } from "next/navigation";

const inputCls = "w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent";

export default async function EditStaticPage({ params }: { params: { id: string } }) {
  const page = await prisma.staticPage.findUnique({ where: { id: params.id } });
  if (!page) notFound();

  const boundAction = updateStaticPage.bind(null, page.id);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit {page.title}</h1>
      <form action={boundAction} className="flex flex-col gap-4 max-w-2xl">
        <input name="title" defaultValue={page.title} required className={inputCls} dir="auto" />
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Slug <span className="text-gray-600">(the /pages/... URL)</span>
          </label>
          <input name="slug" defaultValue={page.slug} className={inputCls} dir="ltr" />
        </div>
        <RichTextEditor name="content" defaultValue={page.content} />
        <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold">Save changes</button>
      </form>
    </div>
  );
}
