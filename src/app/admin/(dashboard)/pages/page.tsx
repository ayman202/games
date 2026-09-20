import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteStaticPage } from "@/app/actions/pages";

export default async function PagesListPage() {
  const pages = await prisma.staticPage.findMany({ orderBy: { title: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Static pages</h1>
        <Link href="/admin/pages/new" className="bg-accent px-4 py-2 rounded-lg font-semibold">+ Add page</Link>
      </div>
      <p className="text-sm text-gray-400 mb-4">
        About, Contact, and Privacy are built-in pages (Contact has a working form) and aren't listed here.
        Anything you add below shows up in the site footer automatically.
      </p>
      <div className="card divide-y divide-white/10">
        {pages.length === 0 && <p className="p-4 text-gray-400">No custom pages yet.</p>}
        {pages.map((p) => (
          <div key={p.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-semibold">{p.title}</p>
              <p className="text-xs text-gray-400">/pages/{p.slug}</p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/pages/${p.id}`} className="text-accent2 hover:underline">Edit</Link>
              <form action={deleteStaticPage.bind(null, p.id)}>
                <button className="text-red-400 hover:underline">Delete</button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
