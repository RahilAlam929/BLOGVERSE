import { formatDate } from "@/lib/utils";
import Link from "next/link";

export function FeaturedPost({ post }: { post: any }) {
  const imageUrl =
    post.cover_image ||
    post.coverImage ||
    post.image ||
    "https://via.placeholder.com/1200x900";

  return (
    <section className="overflow-hidden rounded-[32px] border border-black/10 bg-[#111118]">
      <div className="grid min-h-[560px] lg:grid-cols-[1.02fr_0.98fr]">
        <div className="flex flex-col justify-center p-8 sm:p-10 md:p-12 lg:p-14">
          <span className="inline-flex w-fit rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-300">
            {post.category || "All"}
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[0.98] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-[72px]">
            {post.title}
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {post.excerpt}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <Link
              href={`/author/${post.profiles?.username || post.author?.username || ""}`}
              className="hover:text-white"
            >
              {post.profiles?.name || post.author?.name || "Anonymous"}
            </Link>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
          </div>

          <div className="mt-10">
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Read article
            </Link>
          </div>
        </div>

        <div className="relative min-h-[320px] sm:min-h-[420px] lg:min-h-full">
          <img
            src={imageUrl}
            alt={post.title}
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}