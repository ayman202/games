import { createStaticPage } from "@/app/actions/pages";
import RichTextEditor from "@/components/RichTextEditor";

const inputCls = "w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent";

export default function NewStaticPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add a page</h1>
      <form action={createStaticPage} className="flex flex-col gap-4 max-w-2xl">
        <input name="title" placeholder="Page title (e.g. Terms of Service)" required className={inputCls} dir="auto" />
        <div>
          <label className="block text-sm text-gray-400 mb-1">
            Slug <span className="text-gray-600">(the /pages/... URL — leave blank to auto-generate from the title)</span>
          </label>
          <input name="slug" placeholder="terms-of-service" className={inputCls} dir="ltr" />
        </div>
        <RichTextEditor name="content" />
        <button className="bg-accent btn-on-accent rounded-lg py-2 font-semibold">Create page</button>
      </form>
    </div>
  );
}
