"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

type User = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string | null;
    name?: string | null;
    avatar_url?: string | null;
    picture?: string | null;
  };
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const loadUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const authUser = session?.user ?? null;
      setUser(authUser);

      if (!authUser) {
        setProfile(null);
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("name, username, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();

      if (mounted) {
        setProfile(profileData);
      }
    };

    loadUser();

    return () => {
      mounted = false;
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const displayName =
    profile?.name ||
    profile?.username ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const avatar =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/80 bg-white/95 text-slate-900 shadow-sm backdrop-blur-xl">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between sm:h-[72px]">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-xs font-black tracking-tight text-white transition duration-300 group-hover:scale-105 group-hover:rotate-3">
              BV
            </div>

            <div className="hidden sm:block">
              <div className="text-[16px] font-black tracking-[-0.02em]">
                BlogVerse
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                Ideas in motion
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Home
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Blogs
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Explore
            </Link>

            {user && (
              <Link
                href="/notifications"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Notifications
              </Link>
            )}
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            {user ? (
              <>
                <Link
                  href="/create"
                  className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Write
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setProfileOpen((value) => !value)}
                    aria-label="Open profile menu"
                    className="flex h-11 w-11 overflow-hidden rounded-full border border-slate-200 bg-slate-50 transition duration-300 hover:border-slate-300 hover:bg-white"
                  >
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatar}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-xs font-black">
                        {initials || "U"}
                      </span>
                    )}
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/60">
                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-slate-100"
                      >
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-100">
                          {avatar ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={avatar}
                              alt={displayName}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="flex h-full w-full items-center justify-center text-xs font-black">
                              {initials || "U"}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-black">
                            {displayName}
                          </p>
                          <p className="truncate text-xs text-slate-400">
                            {profile?.username
                              ? `@${profile.username}`
                              : user.email}
                          </p>
                        </div>
                      </Link>

                      <div className="my-1 h-px bg-slate-100" />

                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      >
                        View profile
                      </Link>

                      <Link
                        href="/notifications"
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      >
                        Notifications
                      </Link>

                      <Link
                        href="/create"
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                      >
                        Write a blog
                      </Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:text-white"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white transition duration-300 hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-white md:hidden"
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={`block h-0.5 w-5 bg-current transition ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-current transition ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-100 py-5 md:hidden">
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Home
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Blogs
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Explore
              </Link>

              {user && (
                <Link
                  href="/notifications"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  Notifications
                </Link>
              )}
            </nav>

            <div className="mt-5 border-t border-slate-100 pt-5">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3"
                  >
                    <div className="h-11 w-11 overflow-hidden rounded-full bg-slate-100">
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatar}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-xs font-black">
                          {initials || "U"}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black">
                        {displayName}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {profile?.username
                          ? `@${profile.username}`
                          : user.email}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/create"
                    onClick={closeMenu}
                    className="block rounded-2xl bg-slate-950 px-5 py-3.5 text-center text-sm font-black text-white"
                  >
                    Write a blog →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-slate-200 px-5 py-3.5 text-center text-sm font-bold text-slate-700"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-slate-950 px-5 py-3.5 text-center text-sm font-black text-white"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
