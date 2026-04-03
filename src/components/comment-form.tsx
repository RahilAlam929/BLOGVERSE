"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function CommentForm({
  postId,
  userId,
  parentId,
}: {
  postId: number;
  userId: string | null;
  parentId: number | null;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleComment(e: React.FormEvent) {
    e.preventDefault();

    if (!userId) {
      alert("Please login first");
      return;
    }

    if (!content.trim()) return;

    setLoading(true);

    const { error } = await supabase.from("comments").insert({
      post_id: postId,
      user_id: userId,
      parent_id: parentId,
      content: content.trim(),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setContent("");
    router.refresh();
  }

  return (
    <form onSubmit={handleComment} className="space-y-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={parentId ? 3 : 5}
        placeholder={parentId ? "Write a reply..." : "Your comment here"}
        className="w-full rounded-[16px] border border-black/10 bg-white px-4 py-4 text-[#1f1f26] outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-[#1f1f26] px-6 py-3 font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Posting..." : parentId ? "Reply" : "Post comment"}
      </button>
    </form>
  );
}