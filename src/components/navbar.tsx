import Link from "next/link";
import { PenSquare } from "lucide-react";

type NavbarProps = {
  user: {
    id: string;
    name: string;
    username: string;
    email: string;
  } | null;
};

export function Navbar({ user }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-white">
          Blog<span className="text-violet-400">Verse</span>
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/create" className="button-secondary hidden sm:inline-flex">
            <PenSquare className="mr-2 h-4 w-4" /> Write blog
          </Link>

          {user ? (
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm">
              <div>
                <p className="font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-400">@{user.username}</p>
              </div>
              <a href="/api/auth/logout" className="text-sm text-violet-300 hover:text-violet-200">
                Logout
              </a>
            </div>
          ) : (
            <>
              <Link href="/login" className="button-secondary">
                Login
              </Link>
              <Link href="/register" className="button-primary">
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
