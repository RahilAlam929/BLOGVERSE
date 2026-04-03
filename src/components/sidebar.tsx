import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function Sidebar() {
  const supabase = await createClient();

  const { data: trendingPosts } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      likes(id)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  const sortedTrending =
    trendingPosts
      ?.map((post: any) => ({
        ...post,
        likes_count: post.likes?.length ?? 0,
      }))
      .sort((a: any, b: any) => b.likes_count - a.likes_count) ?? [];

  return (
    <aside className="space-y-6">
      <div className="rounded-[24px] border border-white/10 bg-[#111118] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Newsletter
        </p>
        <h3 className="mt-3 text-2xl font-bold text-white">
          Get the latest posts in your inbox
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-400">
          Weekly insights, product stories, tutorials, and creator updates.
        </p>

        <div className="mt-5 space-y-3">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
          />
          <button className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90">
            Subscribe
          </button>
        </div>
      </div>

      <div className="rounded-[24px] border border-white/10 bg-[#111118] p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">
          Trending
        </p>

        <div className="mt-5 space-y-4">
          {sortedTrending.length > 0 ? (
            sortedTrending.map((item: any, index: number) => (
              <div key={item.id} className="flex gap-4">
                <span className="text-sm font-bold text-slate-500">
                  0{index + 1}
                </span>

                <div>
                  <Link
                    href={`/blog/${item.slug}`}
                    className="text-sm leading-6 text-slate-300 transition hover:text-white"
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

      <div className="rounded-[24px] border border-white/10 bg-gradient-to-br from-violet-500/15 to-cyan-400/10 p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-violet-300">
          Start Publishing
        </p>
        <h3 className="mt-3 text-2xl font-bold text-white">
          Write your first article today
        </h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">
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