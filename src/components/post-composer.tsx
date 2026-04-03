type PostCardProps = {
  post: {
    id: string;
    category: string;
    title: string;
    excerpt: string;
    image: string;
    author: string;
    date: string;
    readTime: string;
  };
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="group overflow-hidden rounded-[24px] border border-white/10 bg-[#111118] transition hover:-translate-y-1 hover:border-white/20">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-5 sm:p-6">
        <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-300">
          {post.category}
        </span>

        <h3 className="mt-4 text-xl font-bold leading-snug text-white">
          {post.title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-slate-400">
          {post.excerpt}
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span>{post.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>{post.date}</span>
          <span className="h-1 w-1 rounded-full bg-slate-600" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </article>
  );
}

