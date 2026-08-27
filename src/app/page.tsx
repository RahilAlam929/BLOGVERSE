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
};

function formatDate(date?: string | null) {
  if (!date) return "Recently";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "Recently";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}

function truncate(text?: string | null, length = 150) {
  if (!text) {
    return "Discover a fresh perspective from the BlogVerse community.";
  }

  const clean = text.replace(/\s+/g, " ").trim();

  return clean.length > length
    ? `${clean.slice(0, length)}...`
    : clean;
}

function getCategory(post: Post) {
  return post.topic || post.category || "Article";
}

function getAuthor(post: Post) {
  return post.guest_name || "Anonymous writer";
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: rawPosts, error } = await supabase
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
      likes(id)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "BlogVerse homepage error:",
      JSON.stringify(error, null, 2)
    );
  }

  const posts = (rawPosts ?? []) as Post[];

  const publishedBlogs = posts.length;

  const writers = new Set(
    posts
      .map((post) => post.guest_id || post.guest_name)
      .filter(Boolean)
  ).size;

  const totalLikes = posts.reduce(
    (total, post) => total + (post.likes?.length ?? 0),
    0
  );

  const featured = posts[0];
  const latestPosts = posts.slice(1, 7);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-950">
      {/* HERO */}

      <section className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-violet-200/50 blur-3xl"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-40 -left-40 h-[420px] w-[420px] rounded-full bg-blue-100/70 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            {/* HERO TEXT */}

            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Ideas worth discovering
              </div>

              <h1 className="text-5xl font-black leading-[0.98] tracking-[-0.055em] text-slate-950 sm:text-6xl lg:text-7xl">
                Read ideas.
                <br />
                <span className="text-slate-400">
                  Share yours.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg sm:leading-8">
                BlogVerse is a place for writers, developers, creators
                and builders to publish useful ideas and discover
                perspectives from people around the world.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/blogs"
                  className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3.5 text-sm font-black text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Explore blogs
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  href="/create"
                  className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-slate-50"
                >
                  Start writing
                </Link>
              </div>

              {/* STATS */}

              <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-slate-200 py-5">
                <div>
                  <p className="text-2xl font-black tracking-tight">
                    {publishedBlogs}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Articles
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-5">
                  <p className="text-2xl font-black tracking-tight">
                    {writers}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Writers
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-5">
                  <p className="text-2xl font-black tracking-tight">
                    {totalLikes}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-400">
                    Likes
                  </p>
                </div>
              </div>
            </div>

            {/* HERO FEATURE */}

            <div className="relative">
              {featured ? (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-xl shadow-slate-200/60 transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    {featured.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.cover_image}
                        alt={featured.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 via-white to-violet-100">
                        <span className="text-7xl font-black text-slate-200">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-700 shadow-sm">
                      Featured
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="mb-3 flex items-center gap-2 text-xs font-bold text-violet-600">
                      <span>{getCategory(featured)}</span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {formatDate(featured.created_at)}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black leading-tight tracking-tight text-slate-950 sm:text-3xl">
                      {featured.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                      {truncate(featured.excerpt, 180)}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="text-sm font-bold text-slate-600">
                        {getAuthor(featured)}
                      </span>

                      <span className="text-sm font-black text-slate-950 transition group-hover:translate-x-1">
                        Read article →
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white text-2xl font-black shadow-sm">
                    BV
                  </div>

                  <h2 className="mt-6 text-2xl font-black">
                    Your first story starts here.
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                    Publish an article and it will appear on the
                    BlogVerse homepage.
                  </p>

                  <Link
                    href="/create"
                    className="mt-6 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
                  >
                    Create article →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* DISCOVERY */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-600">
              Discovery
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Fresh from the community
            </h2>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Explore recent stories, technical ideas and perspectives
              from BlogVerse writers.
            </p>
          </div>

          <Link
            href="/blogs"
            className="text-sm font-black text-slate-700 transition hover:text-slate-950"
          >
            View all blogs →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/70"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
                      <span className="text-4xl font-black text-slate-300">
                        BV
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold text-slate-400">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                      {getCategory(post)}
                    </span>

                    {post.language ? (
                      <span>{post.language}</span>
                    ) : null}

                    <span>•</span>

                    <span>
                      {formatDate(post.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-tight">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                    {truncate(post.excerpt)}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="truncate pr-3 text-xs font-bold text-slate-500">
                      {getAuthor(post)}
                    </span>

                    <span className="shrink-0 text-xs font-black text-slate-950 transition group-hover:translate-x-1">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-10 text-center">
            <h3 className="text-xl font-black">
              No more articles yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Be one of the first writers on BlogVerse.
            </p>

            <Link
              href="/create"
              className="mt-5 inline-flex rounded-2xl bg-slate-950 px-5 py-3 text-sm font-black text-white"
            >
              Write your first article →
            </Link>
          </div>
        )}
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="relative overflow-hidden rounded-[32px] bg-slate-950 px-6 py-12 text-white sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-violet-500/20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl"
          />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/40">
                Your voice matters
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Have an idea worth sharing?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/55 sm:text-base">
                Turn your thoughts into an article and let the
                BlogVerse community discover your perspective.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Start writing →
              </Link>

              <Link
                href="/blogs"
                className="rounded-2xl border border-white/15 px-6 py-3.5 text-center text-sm font-bold text-white/80 transition hover:bg-white/10 hover:text-white"
              >
                Explore blogs
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
