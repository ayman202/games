import { prisma } from "@/lib/prisma";
import { createAdminUser, deleteAdminUser } from "@/app/actions/adminUsers";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const session = await getSession();
  if (session?.role !== "SUPER_ADMIN") redirect("/admin");

  const admins = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin team</h1>

      <div className="card p-4 mb-6">
        <h2 className="font-semibold mb-3">Add an admin</h2>
        <form action={createAdminUser} className="grid grid-cols-2 gap-3">
          <input name="name" placeholder="Name" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="email" type="email" placeholder="Email" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <input name="password" type="password" placeholder="Password (min 6 chars)" required className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent" />
          <select name="role" defaultValue="EDITOR" className="bg-black/30 border border-white/10 rounded-lg px-3 py-2 outline-none focus:border-accent">
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="EDITOR">Editor</option>
            <option value="MODERATOR">Moderator</option>
          </select>
          <button className="col-span-2 bg-accent rounded-lg py-2 font-semibold">Add admin</button>
        </form>
      </div>

      <div className="card divide-y divide-white/10">
        {admins.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-semibold">{a.name} <span className="text-xs text-gray-500">({a.role})</span></p>
              <p className="text-gray-400">{a.email}</p>
            </div>
            {a.id !== session.adminId && (
              <form action={deleteAdminUser.bind(null, a.id)}>
                <button className="text-red-400 hover:underline">Remove</button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
