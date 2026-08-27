"use client";

import { MessageCircle, Reply } from "lucide-react";
import { useState } from "react";
import { CommentForm } from "@/components/comment-form";

type CommentItem = {
  id: number;
  post_id: number;
  parent_id?: number | null;
  content: string;
  guest_name?: string | null;
  created_at?: string | null;
};

function formatCommentDate(date?: string | null) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "";
  }
}

export function CommentThread({
  comments,
  postId,
}: {
  comments: CommentItem[];
  postId: number;
}) {
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const rootComments = comments.filter(
    (comment) => !comment.parent_id,
  );

  function getReplies(parentId: number) {
    return comments.filter(
      (comment) => comment.parent_id === parentId,
    );
  }

  if (comments.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center dark:border-white/10 dark:bg-white/[0.025]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm dark:bg-white/[0.06]">
          <MessageCircle className="h-5 w-5 text-slate-400" />
        </div>

        <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
          No comments yet
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Start the discussion below.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rootComments.map((comment) => {
        const replies = getReplies(comment.id);

        return (
          <article key={comment.id}>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.035]">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-600 dark:bg-white/[0.08] dark:text-slate-300">
                  {(comment.guest_name || "A")
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {comment.guest_name || "Anonymous"}
                    </p>

                    {comment.created_at ? (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">
                          ·
                        </span>

                        <time className="text-xs text-slate-400">
                          {formatCommentDate(comment.created_at)}
                        </time>
                      </>
                    ) : null}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {comment.content}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setReplyTo(
                        replyTo === comment.id
                          ? null
                          : comment.id,
                      )
                    }
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400"
                  >
                    <Reply className="h-3.5 w-3.5" />
                    {replyTo === comment.id
                      ? "Cancel"
                      : "Reply"}
                  </button>
                </div>
              </div>

              {replyTo === comment.id ? (
                <div className="mt-5 border-t border-slate-100 pt-5 dark:border-white/[0.06]">
                  <CommentForm
                    postId={postId}
                    parentId={comment.id}
                  />
                </div>
              ) : null}
            </div>

            {replies.length > 0 ? (
              <div className="ml-5 mt-3 space-y-3 border-l-2 border-slate-100 pl-4 dark:border-white/[0.07]">
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.025]"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-black text-slate-500 shadow-sm dark:bg-white/[0.06] dark:text-slate-300">
                        {(reply.guest_name || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs font-bold text-slate-900 dark:text-white">
                            {reply.guest_name || "Anonymous"}
                          </p>

                          {reply.created_at ? (
                            <span className="text-[11px] text-slate-400">
                              {formatCommentDate(
                                reply.created_at,
                              )}
                            </span>
                          ) : null}
                        </div>

                        <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600 dark:text-slate-300">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
