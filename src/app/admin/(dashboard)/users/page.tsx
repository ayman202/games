import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, createdAt: true, _count: { select: { favorites: true } } },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Registered users</h1>
      <div className="card divide-y divide-white/10">
        {users.length === 0 && <p className="p-4 text-gray-400">No registrations yet.</p>}
        {users.map((u) => (
          <div key={u.id} className="flex justify-between p-4 text-sm">
            <div>
              <p className="font-semibold">{u.name}</p>
              <p className="text-gray-400">{u.email}</p>
            </div>
            <div className="text-right text-gray-400">
              <p>{u.createdAt.toLocaleDateString()}</p>
              <p>{u._count.favorites} favorite(s)</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
