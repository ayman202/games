import { createStaticPage } from "@/app/actions/pages";
import RichTextEditor from "@/components/RichTextEditor";

export default function NewStaticPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add a page</h1>
      <form action={createStaticPage} className="flex flex-col gap-4 max-w-2xl">
        <input name="title" placeholder="Page title (e.g. Terms of Service)" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
        <RichTextEditor name="content" />
        <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold">Create page</button>
      </form>
    </div>
  );
}
