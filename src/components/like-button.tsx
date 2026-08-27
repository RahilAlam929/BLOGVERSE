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
        setCount((value) => Math.max(value - 1, 0));
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
      aria-label={liked ? "Unlike article" : "Like article"}
      className="group inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        backgroundColor: liked
          ? "color-mix(in srgb, #ef4444 10%, var(--reading-surface))"
          : "var(--reading-surface)",
        borderColor: liked
          ? "color-mix(in srgb, #ef4444 35%, var(--reading-border))"
          : "var(--reading-border)",
        color: liked ? "#ef4444" : "var(--reading-text)",
      }}
    >
      <Heart
        className={`h-[18px] w-[18px] transition ${
          liked ? "fill-current" : "group-hover:scale-110"
        }`}
      />

      <span>{loading ? "..." : liked ? "Liked" : "Like"}</span>

      <span
        className="border-l pl-2 text-xs"
        style={{ borderColor: "var(--reading-border)" }}
      >
        {count}
      </span>
    </button>
  );
}
