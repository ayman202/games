import Link from "next/link";
import Image from "next/image";
import { getUserSession } from "@/lib/userAuth";
import { logoutUser } from "@/app/actions/users";
import { prisma } from "@/lib/prisma";
import ThemeToggle from "@/components/ThemeToggle";

type Props = {
  siteName: string;
  logoUrl?: string | null;
  showContact: boolean;
  showCategories: boolean;
  allowThemeToggle: boolean;
  defaultTheme: string;
};

export default async function Navbar({ siteName, logoUrl, showContact, showCategories, allowThemeToggle, defaultTheme }: Props) {
  const session = await getUserSession();
  const categories = showCategories ? await prisma.category.findMany({ orderBy: { order: "asc" } }) : [];

  return (
    <header className="border-b border-white/10 sticky top-0 bg-bg/90 backdrop-blur z-10">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2 shrink-0">
          {logoUrl && (
            <span className="relative h-10 w-auto min-w-[2.5rem] max-w-[9rem] inline-block">
              <Image src={logoUrl} alt={siteName} fill sizes="144px" className="object-contain object-left" />
            </span>
          )}
          {siteName}
        </Link>
        <nav className="flex items-center gap-5 text-sm text-gray-300 shrink-0">
          {showContact && <Link href="/contact" className="hover:text-white hidden sm:inline">اتصل بنا</Link>}
          {allowThemeToggle && <ThemeToggle defaultTheme={defaultTheme} />}
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
              <Link href="/register" className="bg-accent btn-on-accent px-3 py-1.5 rounded-lg hover:opacity-90">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Categories get their own scrollable strip — never limited by count, never breaks the header */}
      {showCategories && categories.length > 0 && (
        <div className="border-t border-white/5">
          <div className="max-w-6xl mx-auto px-4 flex gap-4 overflow-x-auto py-2 text-sm text-gray-300 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: "none" }}>
            {categories.map((c) => (
              <Link key={c.id} href={`/category/${c.slug}`} dir="auto" className="hover:text-accent2 whitespace-nowrap shrink-0">
                {c.icon && <span className="mr-1">{c.icon}</span>}
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
