import Link from "next/link";
import Image from "next/image";
import { getUserSession } from "@/lib/userAuth";
import { logoutUser } from "@/app/actions/users";

export default async function Navbar({ siteName, logoUrl }: { siteName: string; logoUrl?: string | null }) {
  const session = await getUserSession();

  return (
    <header className="border-b border-white/10 sticky top-0 bg-bg/90 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
          {logoUrl && (
            <span className="relative w-7 h-7 inline-block">
              <Image src={logoUrl} alt={siteName} fill className="object-contain" />
            </span>
          )}
          {siteName}
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
              <Link href="/register" className="bg-accent text-white px-3 py-1.5 rounded-lg hover:opacity-90">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
