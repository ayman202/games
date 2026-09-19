import Link from "next/link";
import { logout } from "@/app/actions/auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-8">
      <aside className="card p-4 h-fit">
        <p className="font-bold mb-4">Admin panel</p>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/admin" className="hover:text-accent2">Games</Link>
          <Link href="/admin/stats" className="hover:text-accent2">Stats</Link>
          <Link href="/admin/users" className="hover:text-accent2">Users</Link>
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
