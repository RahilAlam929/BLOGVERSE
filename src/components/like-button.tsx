"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getGuestId } from "@/lib/guest";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
}: {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
}) {
  const supabase = createClient();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (loading) return;

    const guestId = getGuestId();

    if (!guestId) {
      alert("Guest session not found");
      return;
    }

    setLoading(true);

    try {
      if (liked) {
        const { error } = await supabase
          .from("likes")
          .delete()
          .eq("post_id", postId)
          .eq("guest_id", guestId);

        if (error) {
          alert(error.message);
          return;
        }

        setLiked(false);
        setCount((value) => Math.max(0, value - 1));
      } else {
        const { error } = await supabase.from("likes").insert({
          post_id: postId,
          guest_id: guestId,
        });

        if (error) {
          alert(error.message);
          return;
        }

        setLiked(true);
        setCount((value) => value + 1);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={loading}
      className={`group inline-flex items-center gap-2.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        liked
          ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
          : "border-slate-200 bg-white text-slate-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-rose-500/30 dark:hover:bg-rose-500/10"
      }`}
    >
      <Heart
        className={`h-[18px] w-[18px] ${
          liked ? "fill-current" : "group-hover:scale-110"
        }`}
      />

      <span>{loading ? "..." : count}</span>
      <span className="hidden sm:inline">
        {liked ? "Liked" : "Like"}
      </span>
    </button>
  );
}
