"use client";

import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({
  postId,
  postTitle,
  userId,
  authorId,
}: {
  postId: number;
  postTitle: string;
  userId: string | null;
  authorId: string;
}) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (!userId || userId !== authorId) return null;

  async function handleDelete() {
    const ok = window.confirm(`Delete "${postTitle}"?`);
    if (!ok) return;

    setLoading(true);

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300 dark:hover:bg-red-500/20"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting..." : "Delete post"}
    </button>
  );
}