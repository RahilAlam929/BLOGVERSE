"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getGuestId, getGuestName } from "@/lib/guest";

export function CommentForm({
  postId,
  parentId,
}: {
  postId: number;
  parentId: number | null;
}) {
  const supabase = createClient();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const guestId = getGuestId();
    const guestName = getGuestName().trim() || "Anonymous";

    if (!text.trim()) {
      alert("Please enter a comment");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      parent_id: parentId,
      content: text.trim(),
      guest_id: guestId || null,
      guest_name: guestName,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setText("");
    window.location.reload();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your comment..."
        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#6d5efc] px-5 py-2.5 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Posting..." : "Post comment"}
      </button>
    </form>
  );
}