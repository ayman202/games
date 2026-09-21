import { prisma } from "@/lib/prisma";
import { banUser, unbanUser } from "@/app/actions/adminUsers";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true, name: true, email: true, banned: true, createdAt: true,
      _count: { select: { favorites: true, reviews: true } },
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Registered users</h1>
      <div className="card divide-y divide-white/10">
        {users.length === 0 && <p className="p-4 text-gray-400">No registrations yet.</p>}
        {users.map((u) => (
          <div key={u.id} className="flex justify-between p-4 text-sm">
            <div>
              <p className="font-semibold">
                {u.name} {u.banned && <span className="text-red-400 text-xs">(banned)</span>}
              </p>
              <p className="text-gray-400">{u.email}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-400">{u.createdAt.toLocaleDateString()} · {u._count.favorites} fav · {u._count.reviews} reviews</p>
              <form action={(u.banned ? unbanUser : banUser).bind(null, u.id)}>
                <button className={u.banned ? "text-accent2 hover:underline" : "text-red-400 hover:underline"}>
                  {u.banned ? "Unban" : "Ban"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
