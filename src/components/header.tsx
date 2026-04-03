import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { TopicsMenu } from "@/components/topics-menu";

export function Header({
  user,
  profileUsername,
}: {
  user: any;
  profileUsername?: string | null;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f3f3f5]/90 backdrop-blur dark:border-white/10 dark:bg-[#09090f]/90">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#1f1f26] font-black text-white dark:bg-white dark:text-black">
            B
          </div>
          <div>
            <p className="text-lg font-black tracking-tight text-[#1f1f26] dark:text-white">
              BuildVerse Blog
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Modern tech stories & updates
            </p>
          </div>
        </Link>

        <div className="hidden w-full max-w-md md:block">
          <SearchBar />
        </div>

        <div className="flex items-center gap-4">
          <TopicsMenu />
          <ThemeToggle />

          {user ? (
            <>
              <Link
                href="/notifications"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                Updates
              </Link>

              {profileUsername ? (
                <Link
                  href={`/author/${profileUsername}`}
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Profile
                </Link>
              ) : (
                <Link
                  href="/profile/edit"
                  className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                >
                  Complete Profile
                </Link>
              )}

              <Link
                href="/create"
                className="rounded-full bg-[#6d5efc] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Write post
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#6d5efc] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}