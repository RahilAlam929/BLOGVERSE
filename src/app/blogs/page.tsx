import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category?: string | null;
  topic?: string | null;
  language?: string | null;
  guest_name?: string | null;
  guest_id?: string | null;
  created_at?: string | null;
  likes?: { id: number }[] | null;
  comments?: { id: number }[] | null;
};

const categories = [
  "All",
  "Technology",
  "Programming",
  "AI",
  "Web Development",
  "Design",
  "Startups",
  "Productivity",
];

function formatDate(date?: string | null) {
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      slug,
      title,
      excerpt,
      cover_image,
      category,
      topic,
      language,
      guest_name,
      guest_id,
      created_at,
      likes(id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  const posts = (error ? [] : data ?? []) as Post[];

  const featured = posts[0];
  const latest = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
              BlogVerse
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-[-0.05em] sm:text-6xl">
              Explore blogs.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              Discover useful ideas, technical knowledge and perspectives
              from the BlogVerse community.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 max-w-2xl">
            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-slate-400"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="search"
                placeholder="Search blogs, topics and authors..."
                className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-slate-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY NAV */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 lg:px-8">
          {categories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition ${
                index === 0
                  ? "bg-slate-950 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-slate-950 hover:text-slate-950"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
        {/* FEATURED */}
        {featured && (
          <section>
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Featured
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight">
                  Featured blog
                </h2>
              </div>
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:grid-cols-2"
            >
              <div className="relative min-h-[300px] overflow-hidden bg-slate-950">
                {featured.cover_image ? (
                  <img
                    src={featured.cover_image}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950">
                    <span className="text-7xl font-black text-white/10">
                      BV
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[11px] font-black text-blue-600">
                    {featured.topic || "Technology"}
                  </span>

                  <span className="text-xs text-slate-400">
                    {formatDate(featured.created_at)}
                  </span>
                </div>

                <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.03em] transition group-hover:text-blue-600">
                  {featured.title}
                </h3>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                  {featured.excerpt || "Read this blog on BlogVerse."}
                </p>

                <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="text-xs font-bold text-slate-400">
                      Written by
                    </p>

                    <p className="mt-1 text-sm font-black text-slate-800">
                      {featured.guest_name || "BlogVerse Author"}
                    </p>
                  </div>

                  <span className="text-sm font-black">
                    Read blog →
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* LATEST */}
        <section className="mt-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Fresh from the community
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Latest blogs
              </h2>
            </div>

            <span className="hidden text-sm font-semibold text-slate-400 sm:block">
              {posts.length} published blogs
            </span>
          </div>

          {latest.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[26px] border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-52 overflow-hidden bg-slate-950">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                        <span className="text-5xl font-black text-white/10">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black text-slate-800 shadow-sm">
                        {post.topic || post.category || "Blog"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-xs font-semibold text-slate-400">
                      {formatDate(post.created_at)}
                    </p>

                    <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-[-0.02em] transition group-hover:text-blue-600">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {post.excerpt || "Explore this blog on BlogVerse."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-bold text-slate-500">
                        {post.guest_name || "BlogVerse Author"}
                      </span>

                      <span className="text-xs font-black text-slate-900">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-lg font-black text-white">
                BV
              </div>

              <h3 className="mt-6 text-2xl font-black">
                No blogs yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Be the first person to publish a blog on BlogVerse.
              </p>

              <Link
                href="/create"
                className="mt-6 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-black text-white"
              >
                Write a blog →
              </Link>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-[32px] bg-slate-950">
          <div className="relative px-7 py-12 sm:px-10 lg:px-14">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                  Become a writer
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                  Have something worth sharing?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Publish your knowledge and reach readers on BlogVerse.
                </p>
              </div>

              <Link
                href="/create"
                className="shrink-0 rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-slate-950 transition hover:bg-slate-100"
              >
                Write a blog →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
