"use client";

import { useState } from "react";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    name: string;
    username: string;
  };
};

type CommentBoxProps = {
  postId: string;
  initialComments: Comment[];
  canComment: boolean;
};

export function CommentBox({ postId, initialComments, canComment }: CommentBoxProps) {
  const [comments, setComments] = useState(initialComments);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to post comment");

      setComments((prev) => [data.comment, ...prev]);
      setContent("");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to post comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mt-10 space-y-5">
      <div>
        <h3 className="text-xl font-semibold text-white">Comments</h3>
        <p className="text-sm text-slate-400">Readers can engage with every post here.</p>
      </div>

      {canComment ? (
        <form onSubmit={submitComment} className="card p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your comment..."
            className="input min-h-28 resize-none"
          />
          <div className="mt-3 flex justify-end">
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? "Posting..." : "Post comment"}
            </button>
          </div>
        </form>
      ) : (
        <div className="card p-4 text-sm text-slate-300">Login first to comment on this blog.</div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="card p-4 text-sm text-slate-300">No comments yet. Be the first one.</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="card p-4">
              <div className="mb-2 flex items-center justify-between text-sm">
                <div>
                  <p className="font-semibold text-white">{comment.author.name}</p>
                  <p className="text-slate-400">@{comment.author.username}</p>
                </div>
                <span className="text-slate-500">{new Date(comment.createdAt).toLocaleDateString("en-IN")}</span>
              </div>
              <p className="text-sm leading-6 text-slate-300">{comment.content}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
