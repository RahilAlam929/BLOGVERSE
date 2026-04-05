import Link from "next/link";

type FeaturedPostProps = {
  post: {
    title: string;
    slug: string;
    excerpt?: string | null;
    cover_image?: string | null;
    guest_name?: string | null;
    guest_id?: string | null;
  };
};

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <section className="overflow-hidden rounded-[24px] bg-black text-white">
      <div className="grid md:grid-cols-2">
        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-xs uppercase tracking-widest text-purple-400">
            Featured
          </p>

          <h1 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            {post.title}
          </h1>

          <p className="mt-4 text-slate-300">{post.excerpt}</p>

          <div className="mt-6 text-sm text-slate-400">
            {post.guest_id ? (
              <Link href={`/author/${post.guest_id}`}>
                {post.guest_name || "Anonymous"}
              </Link>
            ) : (
              <span>{post.guest_name || "Anonymous"}</span>
            )}
          </div>

          <div className="mt-6">
            <Link
              href={`/blog/${post.slug}`}
              className="rounded-full bg-white px-5 py-2 font-semibold text-black"
            >
              Read More
            </Link>
          </div>
        </div>

        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.cover_image || "https://via.placeholder.com/800x600"}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}