import { PostCard, type PostCardData } from "@/components/post-card";

export function PostGrid({ posts }: { posts: PostCardData[] }) {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
          Latest
        </p>
        <h2 className="mt-2 text-2xl font-black text-[#1f1f26] sm:text-3xl lg:text-4xl">
          Recent articles
        </h2>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-[20px] border border-black/10 bg-white p-8 text-slate-600">
          No posts found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}