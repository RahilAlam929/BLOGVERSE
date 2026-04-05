"use client";

import { useState } from "react";
import { getGuestName, setGuestName } from "@/lib/guest";

export function GuestIdentityForm() {
  const [name, setName] = useState(getGuestName());

  function saveName() {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setGuestName(name);
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
          className="w-full rounded-xl border border-black/10 px-4 py-3 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="button"
          onClick={saveName}
          className="rounded-xl bg-[#6d5efc] px-4 py-3 font-semibold text-white"
        >
          Save
        </button>
      </div>
    </div>
  );
}