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
        } else {
          setLiked(false);
          setCount((prev) => Math.max(prev - 1, 0));
        }
      } else {
        const { error } = await supabase.from("likes").insert({
          post_id: postId,
          guest_id: guestId,
        });

        if (error) {
          alert(error.message);
        } else {
          setLiked(true);
          setCount((prev) => prev + 1);
        }
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
      className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
        liked
          ? "border-red-300 bg-red-50 text-red-600"
          : "border-black/10 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      <Heart className={`h-5 w-5 ${liked ? "fill-red-500" : ""}`} />
      <span>{loading ? "..." : count}</span>
    </button>
  );
}