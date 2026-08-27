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
    <main className="min-h-screen overflow-x-hidden bg-[#09090b] text-white">
      {/* BACKGROUND ATMOSPHERE */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-violet-600/[0.07] blur-[140px]" />

        <div className="absolute right-[-180px] top-[30%] h-[500px] w-[500px] rounded-full bg-blue-500/[0.06] blur-[140px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-fuchsia-500/[0.04] blur-[140px]" />
      </div>

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:px-10 lg:pb-24 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            {/* HERO COPY */}

            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 backdrop-blur-xl">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
                The modern writing community
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Ideas deserve
                <br />
                <span className="bg-gradient-to-r from-white via-white to-white/35 bg-clip-text text-transparent">
                  a place to live.
                </span>
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
                Read thoughtful stories, discover useful ideas and
                publish your own perspective with the BlogVerse
                community.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/blogs"
                  className="group inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Explore stories
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/create"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3.5 text-sm font-bold text-white/75 backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                >
                  Start writing
                </Link>
              </div>

              {/* STATS */}

              <div className="mt-12 grid max-w-xl grid-cols-3 border-y border-white/[0.07] py-6">
                <div>
                  <p className="text-2xl font-black tracking-tight">
                    {publishedBlogs}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                    Stories
                  </p>
                </div>

                <div className="border-l border-white/[0.07] pl-5">
                  <p className="text-2xl font-black tracking-tight">
                    {writers}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                    Writers
                  </p>
                </div>

                <div className="border-l border-white/[0.07] pl-5">
                  <p className="text-2xl font-black tracking-tight">
                    {totalLikes}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-white/30">
                    Likes
                  </p>
                </div>
              </div>
            </div>

            {/* FEATURED STORY */}

            <div className="relative">
              {featured ? (
                <Link
                  href={`/blog/${featured.slug}`}
                  className="group block overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/15"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
                    {featured.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={featured.cover_image}
                        alt={featured.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/[0.08] via-white/[0.025] to-violet-500/[0.08]">
                        <span className="text-7xl font-black text-white/[0.08]">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/80 backdrop-blur-xl">
                      Featured
                    </div>
                  </div>

                  <div className="p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-violet-300">
                      <span>{getCategory(featured)}</span>

                      <span className="text-white/20">•</span>

                      <span className="text-white/30">
                        {formatDate(featured.created_at)}
                      </span>
                    </div>

                    <h2 className="mt-3 text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                      {featured.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">
                      {truncate(featured.excerpt, 180)}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                      <span className="max-w-[55%] truncate text-sm font-bold text-white/55">
                        {getAuthor(featured)}
                      </span>

                      <span className="text-sm font-black text-white transition group-hover:translate-x-1">
                        Read story →
                      </span>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-10 text-center backdrop-blur-xl">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.05] text-2xl font-black">
                    BV
                  </div>

                  <h2 className="mt-6 text-2xl font-black">
                    Your first story starts here.
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-white/40">
                    Publish an article and it will appear on the
                    BlogVerse homepage.
                  </p>

                  <Link
                    href="/create"
                    className="mt-6 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
                  >
                    Create article →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* LATEST STORIES */}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-violet-400">
              Latest stories
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Fresh from BlogVerse
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              New perspectives, technical discoveries and stories
              from writers building and learning every day.
            </p>
          </div>

          <Link
            href="/blogs"
            className="text-sm font-black text-white/55 transition hover:text-white"
          >
            View all →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.025] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.14] hover:bg-white/[0.045] hover:shadow-2xl hover:shadow-black/30"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.04]">
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/[0.06] to-violet-500/[0.05]">
                      <span className="text-4xl font-black text-white/[0.08]">
                        BV
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-white/30">
                    <span className="rounded-full border border-white/[0.07] bg-white/[0.035] px-2.5 py-1 text-violet-300/80">
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

                  <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-tight text-white">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/35">
                    {truncate(post.excerpt)}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <span className="max-w-[65%] truncate text-xs font-bold text-white/35">
                      {getAuthor(post)}
                    </span>

                    <span className="text-xs font-black text-white/60 transition group-hover:translate-x-1 group-hover:text-white">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.025] p-10 text-center">
            <h3 className="text-xl font-black">
              No more stories yet
            </h3>

            <p className="mt-2 text-sm text-white/35">
              Be one of the first writers on BlogVerse.
            </p>

            <Link
              href="/create"
              className="mt-5 inline-flex rounded-2xl bg-white px-5 py-3 text-sm font-black text-black"
            >
              Write your first story →
            </Link>
          </div>
        )}
      </section>

      {/* WHY BLOGVERSE */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/10 text-lg">
              ✦
            </div>

            <h3 className="mt-5 text-lg font-black">
              Discover
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Find interesting ideas and useful perspectives without
              endless noise.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-lg">
              ✎
            </div>

            <h3 className="mt-5 text-lg font-black">
              Create
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Turn your knowledge, experiences and ideas into
              beautiful stories.
            </p>
          </div>

          <div className="rounded-[24px] border border-white/[0.07] bg-white/[0.025] p-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-lg">
              ↗
            </div>

            <h3 className="mt-5 text-lg font-black">
              Connect
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Follow writers, engage with stories and become part of
              the community.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-white/[0.07] via-white/[0.035] to-violet-500/[0.07] px-6 py-12 shadow-2xl shadow-black/30 sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-violet-500/[0.12] blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.08] blur-[100px]"
          />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Start your next chapter
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Have something worth saying?
              </h2>

              <p className="mt-3 text-sm leading-6 text-white/40 sm:text-base">
                Write it. Publish it. Let the right people discover
                it.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Start writing →
              </Link>

              <Link
                href="/blogs"
                className="rounded-2xl border border-white/10 bg-black/10 px-6 py-3.5 text-center text-sm font-bold text-white/65 transition hover:bg-white/[0.07] hover:text-white"
              >
                Browse stories
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
