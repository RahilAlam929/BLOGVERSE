import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function PostCard({ post }: { post: any }) {
  const imageUrl =
    post.cover_image ||
    post.coverImage ||
    post.image ||
    "https://via.placeholder.com/900x600";

  return (
    <article className="group overflow-hidden rounded-[20px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111118]">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-[#0f0f15]">
          <img
            src={imageUrl}
            alt={post.title || "Post image"}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.topic ? (
            <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              {post.topic}
            </span>
          ) : null}

          {post.language ? (
            <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
              {post.language}
            </span>
          ) : null}
        </div>

        <h3 className="line-clamp-2 text-[22px] font-bold leading-tight text-[#1f1f26] dark:text-white">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-4 line-clamp-4 text-[17px] leading-8 text-slate-600 dark:text-slate-300">
          {post.excerpt || "No excerpt available"}
        </p>

        <div className="mt-5 flex items-center gap-3">
          {post.profiles?.avatar_url ? (
            <img
              src={post.profiles.avatar_url}
              alt={post.profiles?.name || "Author"}
              className="h-9 w-9 rounded-full object-cover"
            />
          ) : (
            <div className="h-9 w-9 rounded-full bg-slate-300" />
          )}

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
              {post.profiles?.name || "Anonymous"}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formatDate(post.created_at)}
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="inline-flex items-center gap-1">
            <Heart className="h-4 w-4" /> {post.likes_count ?? 0}
          </span>
          <span className="inline-flex items-center gap-1">
            <MessageCircle className="h-4 w-4" /> {post.comments_count ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}