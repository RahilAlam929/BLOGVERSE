"use client";

import Link from "next/link";
import { getGuestId, getGuestName } from "@/lib/guest";

export default function GuestProfilePage() {
  const guestId = getGuestId();
  const guestName = getGuestName();

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26]">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-black">My Profile</h1>

        <div className="mt-6 space-y-3 text-slate-700">
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {guestName || "Anonymous"}
          </p>
          <p>
            <span className="font-semibold">Guest ID:</span>{" "}
            {guestId || "Not available"}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/create"
            className="rounded-full bg-[#6d5efc] px-5 py-3 font-semibold text-white"
          >
            Create Article
          </Link>

          {guestId ? (
            <Link
              href={`/author/${guestId}`}
              className="rounded-full border border-black/10 bg-white px-5 py-3 font-semibold text-slate-700"
            >
              View Public Profile
            </Link>
          ) : null}
        </div>
      </div>
    </main>
  );
}