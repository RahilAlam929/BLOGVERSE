"use client";

import { Heart } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export function LikeButton({
  postId,
  userId,
  initialLiked,
  initialCount,
}: {
  postId: number;
  userId: string | null;
  initialLiked: boolean;
  initialCount: number;
}) {
  const supabase = createClient();

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function toggleLike() {
    if (!userId) {
      alert("Login required");
      return;
    }

    if (loading) return;
    setLoading(true);

    if (liked) {
      // remove like
      await supabase
        .from("likes")
        .delete()
        .eq("post_id", postId)
        .eq("user_id", userId);

      setLiked(false);
      setCount((c) => c - 1);
    } else {
      // add like
      await supabase.from("likes").insert({
        post_id: postId,
        user_id: userId,
      });

      setLiked(true);
      setCount((c) => c + 1);
    }

    setLoading(false);
  }

  return (
    <button
      onClick={toggleLike}
      className={`group flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition
        ${
          liked
            ? "border-red-300 bg-red-50 text-red-600 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300"
            : "border-black/10 bg-white text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
        }
      `}
    >
      <Heart
        className={`h-5 w-5 transition ${
          liked
            ? "fill-red-500 scale-110"
            : "group-hover:scale-110"
        }`}
      />

      <span>{count}</span>
    </button>
  );
}