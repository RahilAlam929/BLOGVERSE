import Link from "next/link";
import { formatDate } from "@/lib/utils";

export function DiscoverMore({ posts }: { posts: any[] }) {
  if (!posts.length) return null;

  return (
    <section className="mt-10">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          More to explore
        </p>
        <h2 className="mt-2 text-4xl font-black tracking-tight text-[#1f1f26] dark:text-white sm:text-5xl">
          Discover more
        </h2>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {posts.map((post) => {
          const imageUrl =
            post.cover_image ||
            post.coverImage ||
            post.image ||
            "https://via.placeholder.com/900x600";

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-[20px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111118]"
            >
              <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#0f0f15]">
                <img
                  src={imageUrl}
                  alt={post.title}
                  className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="p-5">
                <h3 className="line-clamp-2 text-[26px] font-black leading-tight tracking-tight text-[#1f1f26] dark:text-white">
                  {post.title}
                </h3>

                <p className="mt-4 line-clamp-4 text-[16px] leading-7 text-slate-600 dark:text-slate-300">
                  {post.excerpt || "No excerpt available"}
                </p>

                <div className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-300" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                      {post.profiles?.name || "Anonymous"}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}