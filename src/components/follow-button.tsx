"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function FollowButton({
  currentUserId,
  authorId,
  initialFollowing,
  initialFollowersCount,
}: {
  currentUserId: string | null;
  authorId: string;
  initialFollowing: boolean;
  initialFollowersCount: number;
}) {
  const supabase = createClient();
  const [following, setFollowing] = useState(initialFollowing);
  const [count, setCount] = useState(initialFollowersCount);
  const [loading, setLoading] = useState(false);

  async function toggleFollow() {
    if (!currentUserId) {
      alert("Please login first");
      return;
    }

    if (currentUserId === authorId) {
      alert("You cannot follow yourself");
      return;
    }

    if (loading) return;
    setLoading(true);

    if (following) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", authorId);

      if (!error) {
        setFollowing(false);
        setCount((prev) => Math.max(prev - 1, 0));
      }
    } else {
      const { error } = await supabase.from("follows").insert({
        follower_id: currentUserId,
        following_id: authorId,
      });

      if (!error) {
        setFollowing(true);
        setCount((prev) => prev + 1);
      }
    }

    setLoading(false);
  }

  if (currentUserId === authorId) return null;

  return (
    <button
      onClick={toggleFollow}
      disabled={loading}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        following
          ? "border border-black/10 bg-white text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
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