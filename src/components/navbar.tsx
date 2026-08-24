"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
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

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[78px] max-w-7xl items-center justify-between px-5 lg:px-8">

          {/* BRAND */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-slate-950 text-lg font-black text-white shadow-xl shadow-slate-950/20 transition duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <span className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="relative">B</span>
            </div>

            <div>
              <div className="text-[19px] font-black tracking-[-0.03em] text-slate-950">
                BlogVerse
              </div>

              <div className="hidden text-[9px] font-bold uppercase tracking-[0.24em] text-slate-400 sm:block">
                Write · Read · Inspire
              </div>
            </div>
          </Link>

          {/* CENTER NAV */}
          <nav className="hidden items-center gap-1 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-1 md:flex">

            <Link
              href="/"
              className="rounded-xl bg-white px-4 py-2 text-sm font-bold text-slate-950 shadow-sm"
            >
              Home
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
            >
              Explore
            </Link>

            <Link
              href="/create"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-500 transition hover:bg-white hover:text-slate-950 hover:shadow-sm"
            >
              Write
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="hidden items-center gap-2 md:flex">

            {/* SEARCH */}
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-slate-400 transition hover:border-slate-300 hover:text-slate-700"
              aria-label="Search"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <span className="hidden text-xs font-semibold lg:block">
                Search
              </span>

              <span className="hidden rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-400 lg:block">
                ⌘K
              </span>
            </button>

            {user ? (
              <>
                {/* NOTIFICATION */}
                <Link
                  href="/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950"
                  aria-label="Notifications"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                </Link>

                {/* WRITE */}
                <Link
                  href="/create"
                  className="ml-1 rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Write
                </Link>

                {/* AVATAR */}
                <div className="ml-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-slate-700 to-slate-950 text-sm font-black text-white ring-4 ring-slate-100">
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

          {/* MOBILE */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-900 shadow-sm md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-slate-200/70 bg-white/95 backdrop-blur-xl md:hidden">
            <div className="mx-auto max-w-7xl px-5 py-5">

              <div className="mb-4 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
                <svg
                  width="17"
                  height="17"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-4-4" />
                </svg>

                Search stories...
              </div>

              <nav className="space-y-1">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="block rounded-xl bg-slate-50 px-4 py-3.5 text-sm font-bold"
                >
                  Home
                </Link>

                <Link
                  href="/blogs"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Explore
                </Link>

                <Link
                  href="/create"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Write
                </Link>

                {user && (
                  <Link
                    href="/notifications"
                    onClick={closeMenu}
                    className="block rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Notifications
                  </Link>
                )}
              </nav>

              <div className="mt-5 border-t border-slate-100 pt-5">
                {user ? (
                  <Link
                    href="/create"
                    onClick={closeMenu}
                    className="block rounded-xl bg-slate-950 px-5 py-3.5 text-center text-sm font-bold text-white"
                  >
                    Write a story →
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold"
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
    </>
  );
}
