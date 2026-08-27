"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

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
  const [canDelete, setCanDelete] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function checkUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const userId = session?.user?.id ?? null;

      setCanDelete(
        !!userId &&
        !!authorGuestId &&
        userId === authorGuestId
      );
    }

    checkUser();

    return () => {
      mounted = false;
    };
  }, [authorGuestId, supabase]);

  if (!canDelete) return null;

  async function handleDelete() {
    const ok = window.confirm(
      "Are you sure you want to delete this post?"
    );

    if (!ok) return;

    setLoading(true);

    const { error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId)
      .eq("guest_id", authorGuestId!);

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

    setLoading(false);

    router.push("/profile");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting..." : "Delete Post"}
    </button>
  );
}
