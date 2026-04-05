"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { getGuestId } from "@/lib/guest";
import { useState } from "react";

export function DeletePostButton({
  postId,
  authorGuestId,
}: {
  postId: number;
  authorGuestId?: string | null;
}) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const currentGuestId = getGuestId();
  const canDelete =
    !!currentGuestId && !!authorGuestId && currentGuestId === authorGuestId;

  if (!canDelete) return null;

  async function handleDelete() {
    const ok = window.confirm("Delete this post?");
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
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting..." : "Delete Post"}
    </button>
  );
}