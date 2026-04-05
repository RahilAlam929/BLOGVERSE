"use client";

import { useEffect, useState } from "react";
import { getGuestName, setGuestName } from "@/lib/guest";

export function GuestNameModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const existing = getGuestName();
    setName(existing);

    if (!existing) {
      setOpen(true);
    }
  }, []);

  function saveName() {
    if (!name.trim()) {
      alert("Please enter your display name");
      return;
    }

    setGuestName(name);
    setOpen(false);
    window.location.reload();
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl">
        <p className="text-xs uppercase tracking-[0.18em] text-violet-500">
          BuildVerse
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#1f1f26]">
          Set your display name
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          This name will appear on your posts, comments, and follows.
        </p>

        <input
          type="text"
          placeholder="Enter your name"
          className="mt-5 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={saveName}
            className="rounded-full bg-[#6d5efc] px-5 py-3 font-semibold text-white"
          >
            Save name
          </button>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-black/10 bg-white px-5 py-3 font-semibold text-slate-700"
          >
            Later
          </button>
        </div>
      </div>
    </div>
  );
}