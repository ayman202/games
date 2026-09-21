import { prisma } from "@/lib/prisma";
import { createRedirect, deleteRedirect } from "@/app/actions/settings";

export default async function RedirectsPage() {
  const redirects = await prisma.redirect.findMany({ orderBy: { fromPath: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Redirects</h1>
      <p className="text-sm text-gray-400 mb-4">
        Use this when you rename or remove a game's URL, so old links don't 404.
      </p>

      <div className="card p-4 mb-6">
        <form action={createRedirect} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <input name="fromPath" placeholder="/old-path" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="toPath" placeholder="/games/new-slug" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <select name="statusCode" defaultValue="301" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent">
            <option value="301">301 (permanent)</option>
            <option value="302">302 (temporary)</option>
          </select>
          <button className="bg-accent rounded-lg py-2 font-semibold">Add redirect</button>
        </form>
      </div>

      <div className="card divide-y divide-white/10">
        {redirects.length === 0 && <p className="p-4 text-gray-400">No redirects yet.</p>}
        {redirects.map((r) => (
          <div key={r.id} className="flex items-center justify-between p-4 text-sm">
            <p>{r.fromPath} → {r.toPath} <span className="text-gray-500">({r.statusCode})</span></p>
            <form action={deleteRedirect.bind(null, r.id)}>
              <button className="text-red-400 hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
