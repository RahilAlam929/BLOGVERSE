"use client";

import { MessageCircle } from "lucide-react";
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

    if (loading || !text.trim()) return;

    const guestId = getGuestId();
    const guestName = getGuestName().trim() || "Anonymous";

    setLoading(true);

    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        parent_id: parentId,
        content: text.trim(),
        guest_id: guestId || null,
        guest_name: guestName,
      });

      if (error) {
        alert(error.message);
        return;
      }

      setText("");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition focus-within:border-violet-400 focus-within:ring-4 focus-within:ring-violet-500/10 dark:border-white/10 dark:bg-white/[0.035]">
        <textarea
          rows={parentId ? 3 : 5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={
            parentId
              ? "Write a reply..."
              : "Join the discussion. Share your thoughts..."
          }
          disabled={loading}
          className="w-full resize-none border-0 bg-transparent px-5 py-4 text-[15px] leading-7 text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500"
        />

        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-white/[0.06]">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">
              Be respectful and constructive.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="rounded-full bg-slate-950 px-5 py-2.5 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            {loading
              ? "Posting..."
              : parentId
                ? "Reply"
                : "Post comment"}
          </button>
        </div>
      </div>
    </form>
  );
}
