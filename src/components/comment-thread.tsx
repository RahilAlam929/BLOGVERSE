"use client";

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

export function CommentThread({
  comments,
  postId,
}: {
  comments: CommentItem[];
  postId: number;
}) {
  const [replyTo, setReplyTo] = useState<number | null>(null);

  const rootComments = comments.filter((comment) => !comment.parent_id);

  function getReplies(parentId: number) {
    return comments.filter((comment) => comment.parent_id === parentId);
  }

  return (
    <div className="space-y-6">
      {rootComments.map((comment) => {
        const replies = getReplies(comment.id);

        return (
          <div
            key={comment.id}
            className="rounded-2xl border border-black/10 bg-white p-5"
          >
            <p className="text-sm font-semibold text-slate-800">
              {comment.guest_name || "Anonymous"}
            </p>

            <p className="mt-2 text-slate-700">{comment.content}</p>

            <button
              type="button"
              onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              className="mt-3 text-sm font-medium text-violet-600"
            >
              Reply
            </button>

            {replyTo === comment.id ? (
              <div className="mt-4">
                <CommentForm postId={postId} parentId={comment.id} />
              </div>
            ) : null}

            {replies.length > 0 ? (
              <div className="mt-5 space-y-4 border-l border-black/10 pl-4">
                {replies.map((reply) => (
                  <div key={reply.id} className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-800">
                      {reply.guest_name || "Anonymous"}
                    </p>
                    <p className="mt-2 text-slate-700">{reply.content}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}