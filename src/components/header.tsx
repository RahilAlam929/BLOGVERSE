"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  PenLine,
  Compass,
  Home,
  User,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (mounted) {
        setUser(data.session?.user ?? null);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const closeMenu = () => setOpen(false);

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "Profile";

  const avatar =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* LOGO */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-2.5"
        >
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-slate-950 text-sm font-black text-white shadow-md transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <span className="relative">B</span>
          </div>

          <div className="leading-none">
            <div className="text-[16px] font-black tracking-[-0.04em] text-slate-950">
              BlogVerse
            </div>

            <div className="mt-1 hidden text-[8px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:block">
              Stories that matter
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1 md:flex">
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-slate-950 shadow-sm"
          >
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>

          <Link
            href="/blogs"
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
          >
            <Compass className="h-3.5 w-3.5" />
            Explore
          </Link>

          <Link
            href="/create"
            className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
          >
            <PenLine className="h-3.5 w-3.5" />
            Write
          </Link>
        </nav>

        {/* RIGHT SIDE */}
        <div className="hidden items-center gap-2 md:flex">

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          >
            <Search className="h-4 w-4" />

            <span className="hidden text-[11px] font-semibold lg:block">
              Search
            </span>

            <span className="hidden rounded bg-slate-100 px-1 py-0.5 text-[9px] font-bold text-slate-400 lg:block">
              ⌘K
            </span>
          </button>

          {user ? (
            <>
              {/* NOTIFICATIONS */}
              <Link
                href="/notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />

                <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-red-500" />
              </Link>

              {/* WRITE */}
              <Link
                href="/create"
                className="flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <PenLine className="h-3.5 w-3.5" />
                Write
              </Link>

              {/* PROFILE */}
              <Link
                href="/profile"
                className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2.5 transition hover:border-slate-300 hover:bg-slate-50"
                title="View profile"
              >
                <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-[10px] font-black text-white ring-1 ring-slate-200">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || <User className="h-4 w-4" />
                  )}
                </div>

                <div className="hidden max-w-[100px] lg:block">
                  <p className="truncate text-[11px] font-black text-slate-800">
                    {displayName}
                  </p>

                  <p className="text-[9px] font-semibold text-slate-400">
                    View profile
                  </p>
                </div>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-1.5 rounded-lg bg-slate-950 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                Get started
                <span className="transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </>
          )}
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-900 shadow-sm md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200/70 bg-white md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">

            <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs text-slate-400">
              <Search className="h-4 w-4" />
              Search stories...
            </div>

            <nav className="space-y-1">

              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 text-sm font-bold text-slate-950"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Compass className="h-4 w-4" />
                Explore
              </Link>

              <Link
                href="/create"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <PenLine className="h-4 w-4" />
                Write
              </Link>

              {user && (
                <>
                  <Link
                    href="/notifications"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    <Bell className="h-4 w-4" />
                    Notifications
                  </Link>

                  {/* MOBILE PROFILE */}
                  <Link
                    href="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3.5 text-sm font-bold text-slate-900"
                  >
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-black text-white">
                      {avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={avatar}
                          alt={displayName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials || <User className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <p>{displayName}</p>
                      <p className="text-[10px] font-semibold text-slate-400">
                        View profile
                      </p>
                    </div>
                  </Link>
                </>
              )}
            </nav>

            <div className="mt-4 border-t border-slate-100 pt-4">
              {user ? (
                <Link
                  href="/create"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white"
                >
                  <PenLine className="h-4 w-4" />
                  Write a story
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-lg bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
                  >
                    Get started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
