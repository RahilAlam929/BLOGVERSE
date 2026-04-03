"use client";

import { useMemo, useState } from "react";
import { formatDate } from "@/lib/utils";
import { CommentForm } from "@/components/comment-form";

type CommentItem = {
  id: number;
  post_id: number;
  user_id: string;
  parent_id: number | null;
  content: string;
  created_at: string;
  profiles?: {
    name?: string;
    username?: string;
  };
};

function buildTree(comments: CommentItem[]) {
  const map = new Map<number, CommentItem & { replies: CommentItem[] }>();
  const roots: (CommentItem & { replies: CommentItem[] })[] = [];

  comments.forEach((comment) => {
    map.set(comment.id, { ...comment, replies: [] });
  });

  map.forEach((comment) => {
    if (comment.parent_id && map.has(comment.parent_id)) {
      map.get(comment.parent_id)!.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
}

function CommentNode({
  comment,
  postId,
  userId,
}: {
  comment: any;
  postId: number;
  userId: string | null;
}) {
  const [showReply, setShowReply] = useState(false);

  return (
    <div className="rounded-[18px] border border-black/10 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-slate-300" />
        <div>
          <p className="font-semibold text-[#1f1f26]">
            {comment.profiles?.name || "Anonymous"}
          </p>
          <p className="text-sm text-slate-500">{formatDate(comment.created_at)}</p>
        </div>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-[17px] leading-8 text-slate-700">
        {comment.content}
      </p>

      <button
        onClick={() => setShowReply((prev) => !prev)}
        className="mt-4 text-sm font-medium text-violet-600"
      >
        {showReply ? "Cancel" : "Reply"}
      </button>

      {showReply ? (
        <div className="mt-5">
          <CommentForm postId={postId} userId={userId} parentId={comment.id} />
        </div>
      ) : null}

      {comment.replies?.length ? (
        <div className="mt-6 space-y-4 border-l border-black/10 pl-5">
          {comment.replies.map((reply: any) => (
            <CommentNode
              key={reply.id}
              comment={reply}
              postId={postId}
              userId={userId}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function CommentThread({
  comments,
  postId,
  userId,
}: {
  comments: CommentItem[];
  postId: number;
  userId: string | null;
}) {
  const tree = useMemo(() => buildTree(comments), [comments]);

  if (!tree.length) {
    return <p className="text-slate-500">No comments yet.</p>;
  }

  return (
    <div className="space-y-6">
      {tree.map((comment) => (
        <CommentNode
          key={comment.id}
          comment={comment}
          postId={postId}
          userId={userId}
        />
      ))}
    </div>
  );
}