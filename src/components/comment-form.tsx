"use client";

import { MessageSquare, Send } from "lucide-react";
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
    const content = text.trim();

    if (!content) {
      alert("Please enter a comment");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("comments").insert({
        post_id: postId,
        parent_id: parentId,
        content,
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
      <div
        className="overflow-hidden rounded-2xl border"
        style={{
          backgroundColor: "var(--reading-bg)",
          borderColor: "var(--reading-border)",
        }}
      >
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <MessageSquare
            className="h-4 w-4"
            style={{ color: "var(--reading-accent)" }}
          />

          <span className="reading-text text-sm font-bold">
            {parentId ? "Write a reply" : "Join the discussion"}
          </span>
        </div>

        <textarea
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={2000}
          placeholder={
            parentId
              ? "Write your reply..."
              : "Share your thoughts, questions, or perspective..."
          }
          className="reading-text block w-full resize-y border-0 bg-transparent px-4 py-4 text-sm leading-7 outline-none placeholder:text-[var(--reading-muted)]"
        />

        <div className="flex items-center justify-between gap-3 border-t px-4 py-3">
          <span className="reading-muted text-xs">
            {text.length}/2000
          </span>

          <button
            type="submit"
            disabled={loading || !text.trim()}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              backgroundColor: "var(--reading-accent)",
            }}
          >
            <Send className="h-4 w-4" />

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
