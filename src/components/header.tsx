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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Header() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/85 backdrop-blur-2xl">
      <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* BRAND */}
        <Link
          href="/"
          onClick={closeMenu}
          className="group flex items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-lg font-black text-white shadow-xl shadow-slate-950/15 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            <span className="relative">B</span>
          </div>

          <div className="leading-none">
            <div className="text-[19px] font-black tracking-[-0.04em] text-slate-950">
              BlogVerse
            </div>

            <div className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.23em] text-slate-400 sm:block">
              Stories that matter
            </div>
          </div>
        </Link>

        {/* CENTER NAV */}
        <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-1 md:flex">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>

          <Link
            href="/blogs"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
          >
            <Compass className="h-4 w-4" />
            Explore
          </Link>

          <Link
            href="/create"
            className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
          >
            <PenLine className="h-4 w-4" />
            Write
          </Link>
        </nav>

        {/* RIGHT */}
        <div className="hidden items-center gap-2 md:flex">

          {/* SEARCH */}
          <button
            type="button"
            className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
          >
            <Search className="h-[17px] w-[17px]" />

            <span className="hidden text-xs font-semibold lg:block">
              Search
            </span>

            <span className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 lg:block">
              ⌘K
            </span>
          </button>

          {user ? (
            <>
              {/* NOTIFICATIONS */}
              <Link
                href="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                aria-label="Notifications"
              >
                <Bell className="h-[18px] w-[18px]" />

                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
              </Link>

              {/* WRITE */}
              <Link
                href="/create"
                className="flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
              >
                <PenLine className="h-4 w-4" />
                Write
              </Link>

              {/* AVATAR */}
              <div
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-950 text-sm font-black text-white ring-4 ring-slate-100"
                title={user.email || "Account"}
              >
                {(user.email?.[0] || "U").toUpperCase()}
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Sign in
              </Link>

              <Link
                href="/register"
                className="group flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-slate-800"
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
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm md:hidden"
          aria-label="Toggle navigation"
          aria-expanded={open}
        >
          {open ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xl md:hidden">
          <div className="mx-auto max-w-7xl px-5 py-5">

            {/* MOBILE SEARCH */}
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
              <Search className="h-4 w-4" />
              Search stories...
            </div>

            <nav className="space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold text-slate-950"
              >
                <Home className="h-4 w-4" />
                Home
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <Compass className="h-4 w-4" />
                Explore
              </Link>

              <Link
                href="/create"
                onClick={closeMenu}
                className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <PenLine className="h-4 w-4" />
                Write
              </Link>

              {user && (
                <Link
                  href="/notifications"
                  onClick={closeMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
              )}
            </nav>

            <div className="mt-5 border-t border-slate-100 pt-5">
              {user ? (
                <Link
                  href="/create"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 text-center text-sm font-bold text-white"
                >
                  <PenLine className="h-4 w-4" />
                  Write a story
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-800"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white"
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
