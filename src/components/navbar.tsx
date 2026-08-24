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
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex h-[76px] items-center justify-between">

          {/* LOGO */}
          <Link
            href="/"
            onClick={closeMenu}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white shadow-sm transition group-hover:scale-105">
              BV
            </div>

            <div className="hidden sm:block">
              <div className="text-[17px] font-black tracking-tight text-slate-950">
                BlogVerse
              </div>

              <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Modern blogging
              </div>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden items-center gap-1 md:flex">
            <Link
              href="/"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Home
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Blogs
            </Link>

            <Link
              href="/blogs"
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              Explore
            </Link>

            {user && (
              <Link
                href="/notifications"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
              >
                Notifications
              </Link>
            )}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  href="/create"
                  className="group inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Write a blog
                  <span className="transition-transform group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>

                <Link
                  href="/profile"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-sm font-black text-slate-700 transition hover:border-slate-300 hover:bg-white"
                  title="Profile"
                >
                  {(
                    user.user_metadata?.full_name ||
                    user.user_metadata?.name ||
                    user.email ||
                    "U"
                  )
                    .charAt(0)
                    .toUpperCase()}
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:text-slate-950"
                >
                  Sign in
                </Link>

                <Link
                  href="/register"
                  className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* MOBILE BUTTON */}
          <button
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-950 md:hidden"
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

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="border-t border-slate-100 py-5 md:hidden">
            <nav className="space-y-1">
              <Link
                href="/"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Home
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Blogs
              </Link>

              <Link
                href="/blogs"
                onClick={closeMenu}
                className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Explore
              </Link>

              {user && (
                <Link
                  href="/notifications"
                  onClick={closeMenu}
                  className="block rounded-xl px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
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
                  className="block rounded-xl bg-slate-950 px-5 py-3.5 text-center text-sm font-black text-white"
                >
                  Write a blog →
                </Link>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-700"
                  >
                    Sign in
                  </Link>

                  <Link
                    href="/register"
                    onClick={closeMenu}
                    className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white"
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
