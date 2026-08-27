"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

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
    if (loading) return;

    setLoading(true);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user ?? null;

      if (!user) {
        alert("Please login to follow users.");
        setLoading(false);
        return;
      }

      if (user.id === authorGuestId) {
        alert("You cannot follow yourself.");
        setLoading(false);
        return;
      }

      if (following) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("guest_id", user.id)
          .eq("following_id", authorGuestId);

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        setFollowing(false);
        setCount((prev) => Math.max(prev - 1, 0));
      } else {
        const guestName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "User";

        const { error } = await supabase.from("follows").insert({
          guest_id: user.id,
          guest_name: guestName,
          following_id: authorGuestId,
        });

        if (error) {
          alert(error.message);
          setLoading(false);
          return;
        }

        setFollowing(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Follow error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleFollow}
      disabled={loading}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
        following
          ? "border border-black/10 bg-white text-slate-700 hover:bg-slate-100"
          : "bg-[#6d5efc] text-white hover:bg-[#5c4df0]"
      } disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {loading
        ? "Please wait..."
        : following
        ? `Following · ${count}`
        : `Follow · ${count}`}
    </button>
  );
}
