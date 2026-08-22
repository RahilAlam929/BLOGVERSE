"use client";

import { useState } from "react";
import { getGuestName, setGuestName } from "@/lib/guest";

export default function GuestIdentityForm() {
  const [name, setName] = useState(getGuestName());

  function saveName() {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name");
      return;
    }

    setGuestName(trimmedName);
    setName(trimmedName);
    alert("Name saved");
  }

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-4">
      <p className="mb-2 text-sm font-semibold text-slate-700">
        Your display name
      </p>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter your name"
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none focus:border-black/20"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={50}
        />

        <button
          type="button"
          onClick={saveName}
          className="rounded-xl bg-[#6d5efc] px-4 py-3 font-semibold text-white transition hover:opacity-90"
        >
          Save
        </button>
      </div>
    </div>
  );
}
