import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const isSuperAdmin = session.role === "SUPER_ADMIN";
  const canEditContent = session.role === "SUPER_ADMIN" || session.role === "EDITOR";

  return (
    <div className="grid md:grid-cols-[210px_1fr] gap-8">
      <aside className="card p-4 h-fit sticky top-20">
        <p className="font-bold mb-1">Admin panel</p>
        <p className="text-xs text-gray-500 mb-4">{session.email} · {session.role}</p>
        <nav className="flex flex-col gap-1.5 text-sm">
          {canEditContent && <Link href="/admin" className="hover:text-accent2">Games</Link>}
          {canEditContent && <Link href="/admin/categories" className="hover:text-accent2">Categories</Link>}
          {canEditContent && <Link href="/admin/tags" className="hover:text-accent2">Tags</Link>}
          {canEditContent && <Link href="/admin/links" className="hover:text-accent2">Download links</Link>}
          <Link href="/admin/reviews" className="hover:text-accent2">Reviews</Link>
          <Link href="/admin/reports" className="hover:text-accent2">Reports</Link>
          <Link href="/admin/users" className="hover:text-accent2">Users</Link>
          <Link href="/admin/stats" className="hover:text-accent2">Stats</Link>
          {canEditContent && <Link href="/admin/redirects" className="hover:text-accent2">Redirects</Link>}
          {isSuperAdmin && <Link href="/admin/team" className="hover:text-accent2">Admin team</Link>}
          {isSuperAdmin && <Link href="/admin/settings" className="hover:text-accent2">Site settings</Link>}
          {isSuperAdmin && <Link href="/admin/activity" className="hover:text-accent2">Activity log</Link>}
          <Link href="/" className="hover:text-accent2 mt-2 text-gray-400">← View site</Link>
          <form action={logout}>
            <button className="hover:text-red-400 text-gray-400 mt-2">Log out</button>
          </form>
        </nav>
      </aside>
      <div>{children}</div>
    </div>
  );
}
