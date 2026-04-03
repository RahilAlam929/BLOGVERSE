import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type TrendingPost = {
  id: number;
  title: string;
  slug: string;
  likes?: { id: number }[] | null;
};

export async function Sidebar() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      likes(id)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const trendingPosts: TrendingPost[] = (data ?? []) as TrendingPost[];

  const sortedTrending = trendingPosts
    .map((post) => ({
      ...post,
      likes_count: post.likes?.length ?? 0,
    }))
    .sort((a, b) => b.likes_count - a.likes_count);

  return (
    <aside className="space-y-6">
      <div className="rounded-[24px] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111118]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Newsletter
        </p>
        <h3 className="mt-3 text-2xl font-bold text-[#1f1f26] dark:text-white">
          Get the latest posts in your inbox
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Weekly insights, product stories, tutorials, and creator updates.
        </p>

        <div className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm text-[#1f1f26] outline-none placeholder:text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <button className="w-full rounded-2xl bg-[#6d5efc] px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90">
            Subscribe
          </button>
        </div>
      </div>

      <div className="rounded-[24px] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111118]">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">
          Trending
        </p>

        <div className="mt-5 space-y-4">
          {sortedTrending.length > 0 ? (
            sortedTrending.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <span className="text-sm font-bold text-slate-500">
                  0{index + 1}
                </span>

                <div>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="text-sm leading-6 text-slate-300 transition hover:text-white dark:text-slate-300"
                  >
                    {item.title}
                  </Link>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.likes_count} likes
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No trending posts yet.</p>
          )}
        </div>
      </div>

      <div className="rounded-[24px] border border-black/10 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 p-6 dark:border-white/10">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
          Start Publishing
        </p>
        <h3 className="mt-3 text-2xl font-bold text-[#1f1f26] dark:text-white">
          Write your first article today
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Add title, cover image, rich content blocks, and publish like a real tech blog.
        </p>

        <Link
          href="/create"
          className="mt-5 inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Create post
        </Link>
      </div>
    </aside>
  );
}