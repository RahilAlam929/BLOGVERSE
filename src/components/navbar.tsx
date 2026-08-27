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

    const loadUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(authUser as User);

      const { data } = await supabase
        .from("profiles")
        .select("name, username, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();

      setProfile(data);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authUser = session?.user;

      if (!authUser) {
        setUser(null);
        setProfile(null);
        return;
      }

      setUser(authUser as User);

      const { data } = await supabase
        .from("profiles")
        .select("name, username, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();

      setProfile(data);
    });

    return () => subscription.unsubscribe();
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
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 text-white backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
        <div className="flex h-[72px] items-center justify-between">
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xs font-black tracking-tight text-black transition duration-300 group-hover:scale-105 group-hover:rotate-3">
              BV
            </div>

            <div className="hidden sm:block">
              <div className="text-[16px] font-black tracking-[-0.02em]">
                BlogVerse
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-white/30">
                Ideas in motion
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            >
              Blogs
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white"
            >
              Explore
            </Link>

            {user && (
              <Link
                href="/notifications"
                className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/[0.06] hover:text-white"
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
                  className="group inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
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
                    className="flex h-11 w-11 overflow-hidden rounded-full border border-white/10 bg-white/[0.06] transition duration-300 hover:border-white/25 hover:bg-white/[0.1]"
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
                    <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#101010] p-2 shadow-2xl shadow-black/50">
                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-white/[0.06]"
                      >
                        <div className="h-10 w-10 overflow-hidden rounded-full bg-white/[0.08]">
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
                          <p className="truncate text-xs text-white/35">
                            {profile?.username
                              ? `@${profile.username}`
                              : user.email}
                          </p>
                        </div>
                      </Link>

                      <div className="my-1 h-px bg-white/[0.06]" />

                      <Link
                        href="/profile"
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        View profile
                      </Link>

                      <Link
                        href="/notifications"
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
                      >
                        Notifications
                      </Link>

                      <Link
                        href="/create"
                        onClick={closeMenu}
                        className="block rounded-xl px-3 py-2.5 text-sm font-semibold text-white/60 transition hover:bg-white/[0.06] hover:text-white"
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
                  className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:text-white"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-white px-5 py-3 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
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
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white md:hidden"
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
          <div className="border-t border-white/[0.06] py-5 md:hidden">
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
              >
                Blogs
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
              >
                Explore
              </Link>

              {user && (
                <Link
                  href="/notifications"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-sm font-bold text-white/65 transition hover:bg-white/[0.06] hover:text-white"
                >
                  Notifications
                </Link>
              )}
            </nav>

            <div className="mt-5 border-t border-white/[0.06] pt-5">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-2xl bg-white/[0.04] p-3"
                  >
                    <div className="h-11 w-11 overflow-hidden rounded-full bg-white/[0.08]">
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
                      <p className="truncate text-xs text-white/35">
                        {profile?.username
                          ? `@${profile.username}`
                          : user.email}
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/create"
                    onClick={closeMenu}
                    className="block rounded-2xl bg-white px-5 py-3.5 text-center text-sm font-black text-black"
                  >
                    Write a blog →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-white/10 px-5 py-3.5 text-center text-sm font-bold text-white/70"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-white px-5 py-3.5 text-center text-sm font-black text-black"
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
