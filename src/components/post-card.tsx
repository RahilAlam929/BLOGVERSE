import Link from "next/link";
import { Heart, MessageCircle } from "lucide-react";

export type PostCardData = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  topic?: string | null;
  language?: string | null;
  likes_count?: number;
  comments_count?: number;
  guest_id?: string | null;
  profiles?: {
    name?: string | null;
  } | null;
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <article className="group overflow-hidden rounded-[20px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="aspect-[16/9] overflow-hidden bg-slate-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image || "https://via.placeholder.com/900x600"}
            alt={post.title || "Post image"}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>

      <div className="p-4 sm:p-5">
        <div className="mb-3 flex flex-wrap gap-2">
          {post.topic ? (
            <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
              {post.topic}
            </span>
          ) : null}
          {post.language ? (
            <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-[11px] text-slate-600">
              {post.language}
            </span>
          ) : null}
        </div>

        <h3 className="line-clamp-2 text-xl font-bold leading-tight text-[#1f1f26]">
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>

        <p className="mt-3 line-clamp-4 text-sm leading-7 text-slate-600">
          {post.excerpt || "No excerpt available"}
        </p>

        <div className="mt-5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-slate-300" />
          <div className="min-w-0">
            {post.guest_id ? (
              <Link
                href={`/author/${post.guest_id}`}
                className="truncate text-sm font-medium text-slate-700"
              >
                {post.profiles?.name || "Anonymous"}
              </Link>
            ) : (
              <p className="truncate text-sm font-medium text-slate-700">
                {post.profiles?.name || "Anonymous"}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 sm:text-sm">
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