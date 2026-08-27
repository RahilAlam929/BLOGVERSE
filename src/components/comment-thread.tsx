"use client";

import { CornerDownRight, Reply } from "lucide-react";
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

function formatCommentDate(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
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

  if (rootComments.length === 0) {
    return (
      <div
        className="reading-surface reading-border rounded-2xl border px-6 py-10 text-center"
      >
        <p className="reading-text text-sm font-bold">
          No comments yet
        </p>

        <p className="reading-muted mt-2 text-sm">
          Be the first to share your perspective.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {rootComments.map((comment) => {
        const replies = getReplies(comment.id);
        const isReplying = replyTo === comment.id;

        return (
          <article
            key={comment.id}
            className="reading-surface reading-border rounded-2xl border p-5 sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black text-white"
                  style={{
                    backgroundColor: "var(--reading-accent)",
                  }}
                >
                  {(comment.guest_name || "A")
                    .trim()
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="min-w-0">
                  <p className="reading-text truncate text-sm font-bold">
                    {comment.guest_name || "Anonymous"}
                  </p>

                  {comment.created_at ? (
                    <p className="reading-muted mt-0.5 text-xs">
                      {formatCommentDate(comment.created_at)}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>

            <p className="reading-text mt-4 whitespace-pre-wrap text-sm leading-7">
              {comment.content}
            </p>

            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() =>
                  setReplyTo(isReplying ? null : comment.id)
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold transition hover:opacity-70"
                style={{
                  color: "var(--reading-accent)",
                }}
              >
                <Reply className="h-3.5 w-3.5" />
                {isReplying ? "Cancel" : "Reply"}
              </button>

              {replies.length > 0 ? (
                <span className="reading-muted text-xs">
                  {replies.length}{" "}
                  {replies.length === 1 ? "reply" : "replies"}
                </span>
              ) : null}
            </div>

            {isReplying ? (
              <div className="mt-5">
                <CommentForm
                  postId={postId}
                  parentId={comment.id}
                />
              </div>
            ) : null}

            {replies.length > 0 ? (
              <div
                className="mt-6 space-y-4 border-l-2 pl-4 sm:pl-6"
                style={{
                  borderColor: "var(--reading-border)",
                }}
              >
                {replies.map((reply) => (
                  <div
                    key={reply.id}
                    className="reading-surface rounded-xl border p-4"
                    style={{
                      borderColor: "var(--reading-border)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <CornerDownRight
                        className="h-4 w-4"
                        style={{
                          color: "var(--reading-accent)",
                        }}
                      />

                      <p className="reading-text text-sm font-bold">
                        {reply.guest_name || "Anonymous"}
                      </p>

                      {reply.created_at ? (
                        <span className="reading-muted text-xs">
                          • {formatCommentDate(reply.created_at)}
                        </span>
                      ) : null}
                    </div>

                    <p className="reading-text mt-3 whitespace-pre-wrap text-sm leading-7">
                      {reply.content}
                    </p>
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
