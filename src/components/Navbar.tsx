import Link from "next/link";
import { getUserSession } from "@/lib/userAuth";
import { logoutUser } from "@/app/actions/users";

export default async function Navbar() {
  const session = await getUserSession();

  return (
    <header className="border-b border-white/10 sticky top-0 bg-bg/90 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight">
          Game<span className="text-accent">Hub</span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-gray-300">
          <Link href="/" className="hover:text-white">Library</Link>
          <Link href="/about" className="hover:text-white hidden sm:inline">About</Link>
          <Link href="/contact" className="hover:text-white hidden sm:inline">Contact</Link>
          {session ? (
            <>
              <Link href="/favorites" className="hover:text-white">Favorites</Link>
              <form action={logoutUser}>
                <button className="hover:text-white">Log out</button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-white">Log in</Link>
              <Link
                href="/register"
                className="bg-accent text-white px-3 py-1.5 rounded-lg hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
