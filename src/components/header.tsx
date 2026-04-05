"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, PenSquare, Home, UserCircle, X, Pencil } from "lucide-react";
import { getGuestId, getGuestName, setGuestName } from "@/lib/guest";
import { GuestNameModal } from "@/components/guest-name-modal";

export function Header() {
  const [open, setOpen] = useState(false);
  const [guestName, setGuestNameState] = useState("");

  useEffect(() => {
    setGuestNameState(getGuestName());
  }, []);

  function editName() {
    const current = getGuestName();
    const next = window.prompt("Enter your display name", current || "");
    if (!next) return;

    setGuestName(next);
    setGuestNameState(next.trim());
    window.location.reload();
  }

  const guestId = getGuestId();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/create", label: "Create Article", icon: PenSquare },
    { href: "/guest-profile", label: "My Profile", icon: UserCircle },
  ];

  return (
    <>
      <GuestNameModal />

      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f3f3f5]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-black font-bold text-white">
              B
            </div>
            <div>
              <p className="text-lg font-bold">BuildVerse</p>
              <p className="text-xs text-slate-500">
                {guestName ? `Hi, ${guestName}` : "Set your name"}
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-3 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <button
              type="button"
              onClick={editName}
              className="inline-flex items-center gap-2 rounded-full bg-[#6d5efc] px-4 py-2 text-sm font-medium text-white"
            >
              <Pencil className="h-4 w-4" />
              {guestName ? "Edit Name" : "Set Name"}
            </button>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            className="rounded-xl border border-black/10 bg-white p-2 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {open ? (
          <div className="border-t border-black/10 bg-white p-4 md:hidden">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-black/10 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  editName();
                }}
                className="flex items-center justify-center gap-3 rounded-xl bg-[#6d5efc] px-4 py-3 text-sm font-medium text-white"
              >
                <Pencil className="h-4 w-4" />
                {guestName ? "Edit Name" : "Set Name"}
              </button>

              {guestId ? (
                <Link
                  href={`/author/${guestId}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-black/10 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  Public Profile
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </header>
    </>
  );
}