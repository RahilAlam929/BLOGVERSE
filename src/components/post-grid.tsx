import { PostCard } from "@/components/post-card";

export function PostGrid({ posts }: { posts: any[] }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
          Latest
        </p>
        <h2 className="mt-2 text-3xl font-black text-[#1f1f26] dark:text-white sm:text-4xl">
          Recent articles
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[20px] border border-black/10 bg-white p-8 text-slate-600 dark:border-white/10 dark:bg-[#111118] dark:text-slate-300">
          No posts found.
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}