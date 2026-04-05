"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getGuestId, getGuestName } from "@/lib/guest";

export function FollowButton({
  authorGuestId,
  initialFollowing,
  initialFollowersCount,
}: {
  authorGuestId: string;
  initialFollowing: boolean;
  initialFollowersCount: number;
}) {
  const supabase = createClient();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    const guestId = getGuestId();
    const guestName = getGuestName().trim() || "Anonymous";

    if (!guestId) return;
    if (guestId === authorGuestId) {
      alert("You cannot follow yourself");
      return;
    }
    if (loading) return;

    setLoading(true);

    if (following) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("guest_id", guestId)
        .eq("following_id", authorGuestId);

      if (!error) {
        setFollowing(false);
        setCount((prev) => Math.max(prev - 1, 0));
      }
    } else {
      const { error } = await supabase.from("follows").insert({
        guest_id: guestId,
        guest_name: guestName,
        following_id: authorGuestId,
      });

      if (!error) {
        setFollowing(true);
        setCount((prev) => prev + 1);
      }
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        following
          ? "border border-black/10 bg-white text-slate-700"
          : "bg-[#6d5efc] text-white"
      }`}
    >
      {loading
        ? "Please wait..."
        : following
        ? `Following · ${count}`
        : `Follow · ${count}`}
    </button>
  );
}