"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";

export function EditPostButton({
  postId,
  userId,
  authorId,
}: {
  postId: number;
  userId: string | null;
  authorId: string;
}) {
  if (!userId || userId !== authorId) return null;

  return (
    <Link
      href={`/edit/${postId}`}
      className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
    >
      <Pencil className="h-4 w-4" />
      Edit post
    </Link>
  );
}