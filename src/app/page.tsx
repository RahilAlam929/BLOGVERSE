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

function truncate(text?: string | null, length = 160) {
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

  const latestArticle = posts[0];
  const latestPosts = posts.slice(1, 7);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0b0b0f] text-white">
      {/* =====================================================
          PREMIUM BACKGROUND
          ===================================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-48 top-[-120px] h-[600px] w-[600px] rounded-full bg-violet-600/[0.09] blur-[150px]" />

        <div className="absolute -right-48 top-[20%] h-[600px] w-[600px] rounded-full bg-blue-600/[0.07] blur-[150px]" />

        <div className="absolute bottom-[-250px] left-[35%] h-[600px] w-[600px] rounded-full bg-fuchsia-600/[0.045] blur-[150px]" />
      </div>

      {/* =====================================================
          HERO
          ===================================================== */}

      <section className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20 lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-4xl">
            {/* LABEL */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/45 shadow-lg shadow-black/10 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.9)]" />
              The modern writing community
            </div>

            {/* HEADING */}

            <h1 className="max-w-5xl text-5xl font-black leading-[0.94] tracking-[-0.065em] sm:text-6xl lg:text-8xl">
              Ideas deserve
              <br />
              <span className="bg-gradient-to-r from-white via-white to-white/30 bg-clip-text text-transparent">
                a place to live.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
              Read thoughtful stories, discover useful ideas and
              publish your own perspective with a community built for
              curious minds.
            </p>

            {/* ACTIONS */}

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/blogs"
                className="group inline-flex items-center justify-center rounded-2xl bg-white px-7 py-4 text-sm font-black text-black shadow-xl shadow-white/[0.06] transition duration-300 hover:-translate-y-1 hover:bg-white/90"
              >
                Explore stories
                <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              <Link
                href="/create"
                className="inline-flex items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.035] px-7 py-4 text-sm font-bold text-white/75 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
              >
                Start writing
              </Link>
            </div>

            {/* STATS */}

            <div className="mt-14 grid max-w-2xl grid-cols-3 border-y border-white/[0.07] py-7">
              <div>
                <p className="text-2xl font-black tracking-tight sm:text-3xl">
                  {publishedBlogs}
                </p>

                <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                  Stories
                </p>
              </div>

              <div className="border-l border-white/[0.07] pl-5 sm:pl-8">
                <p className="text-2xl font-black tracking-tight sm:text-3xl">
                  {writers}
                </p>

                <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                  Writers
                </p>
              </div>

              <div className="border-l border-white/[0.07] pl-5 sm:pl-8">
                <p className="text-2xl font-black tracking-tight sm:text-3xl">
                  {totalLikes}
                </p>

                <p className="mt-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
                  Likes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          LATEST ARTICLE — SEPARATE PREMIUM BOX
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-18 lg:px-10 lg:py-20">
        <div className="mb-7 flex items-end justify-between gap-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" />

              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">
                Latest article
              </p>
            </div>

            <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl">
              Freshly published
            </h2>
          </div>

          <Link
            href="/blogs"
            className="hidden text-sm font-black text-white/40 transition hover:text-white sm:block"
          >
            View all →
          </Link>
        </div>

        {latestArticle ? (
          <Link
            href={`/blog/${latestArticle.slug}`}
            className="group relative block overflow-hidden rounded-[30px] border border-white/[0.09] bg-gradient-to-br from-white/[0.075] via-white/[0.035] to-violet-500/[0.045] shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-violet-950/20"
          >
            <div className="grid lg:grid-cols-[1.05fr_.95fr]">
              {/* IMAGE */}

              <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.035] lg:aspect-auto lg:min-h-[390px]">
                {latestArticle.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={latestArticle.cover_image}
                    alt={latestArticle.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[280px] items-center justify-center bg-gradient-to-br from-violet-500/[0.12] via-white/[0.03] to-blue-500/[0.08]">
                    <span className="text-8xl font-black tracking-[-0.08em] text-white/[0.07]">
                      BV
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/50 px-3.5 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-white/80 backdrop-blur-xl">
                  New
                </div>
              </div>

              {/* CONTENT */}

              <div className="flex flex-col justify-center p-7 sm:p-9 lg:p-12">
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.16em]">
                  <span className="rounded-full border border-violet-400/20 bg-violet-400/[0.08] px-3 py-1.5 text-violet-300">
                    {getCategory(latestArticle)}
                  </span>

                  {latestArticle.language ? (
                    <span className="text-white/25">
                      {latestArticle.language}
                    </span>
                  ) : null}

                  <span className="text-white/15">•</span>

                  <span className="text-white/30">
                    {formatDate(latestArticle.created_at)}
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
                  {latestArticle.title}
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                  {truncate(latestArticle.excerpt, 220)}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-6">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/25">
                      Written by
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-white/65">
                      {getAuthor(latestArticle)}
                    </p>
                  </div>

                  <span className="ml-5 shrink-0 rounded-full border border-white/[0.1] bg-white/[0.045] px-4 py-2.5 text-xs font-black text-white/70 transition duration-300 group-hover:border-white/20 group-hover:bg-white/[0.09] group-hover:text-white">
                    Read article →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.04] text-2xl font-black">
              BV
            </div>

            <h3 className="mt-6 text-2xl font-black">
              Your first story starts here.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">
              Publish an article and it will become the latest story
              on BlogVerse.
            </p>

            <Link
              href="/create"
              className="mt-6 inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5"
            >
              Create article →
            </Link>
          </div>
        )}
      </section>

      {/* =====================================================
          MORE STORIES
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400">
              More to discover
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
              Fresh from BlogVerse
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-white/35">
              Technical discoveries, personal experiences and useful
              ideas from writers across the community.
            </p>
          </div>

          <Link
            href="/blogs"
            className="text-sm font-black text-white/45 transition hover:text-white"
          >
            Explore everything →
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.025] shadow-xl shadow-black/10 backdrop-blur-xl transition duration-400 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-white/[0.045] hover:shadow-2xl hover:shadow-black/30"
              >
                {/* CARD IMAGE */}

                <div className="relative aspect-[16/10] overflow-hidden bg-white/[0.035]">
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/[0.06] via-violet-500/[0.035] to-blue-500/[0.04]">
                      <span className="text-5xl font-black tracking-[-0.08em] text-white/[0.07]">
                        BV
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* CARD CONTENT */}

                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.15em]">
                    <span className="rounded-full border border-white/[0.08] bg-white/[0.035] px-2.5 py-1.5 text-violet-300/80">
                      {getCategory(post)}
                    </span>

                    {post.language ? (
                      <span className="text-white/25">
                        {post.language}
                      </span>
                    ) : null}

                    <span className="text-white/15">•</span>

                    <span className="text-white/25">
                      {formatDate(post.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-xl font-black leading-tight tracking-[-0.025em] text-white">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/35">
                    {truncate(post.excerpt)}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5">
                    <span className="max-w-[60%] truncate text-xs font-bold text-white/35">
                      {getAuthor(post)}
                    </span>

                    <span className="text-xs font-black text-white/50 transition group-hover:translate-x-1 group-hover:text-white">
                      Read →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-10 text-center">
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

      {/* =====================================================
          WHY BLOGVERSE
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-20">
        <div className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">
            Built for ideas
          </p>

          <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
            Why BlogVerse?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="group rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/[0.13] hover:bg-white/[0.045]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/10 bg-violet-500/[0.09] text-xl text-violet-300">
              ✦
            </div>

            <h3 className="mt-6 text-lg font-black">
              Discover
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Find interesting ideas and useful perspectives without
              endless noise.
            </p>
          </div>

          <div className="group rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/[0.13] hover:bg-white/[0.045]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/10 bg-blue-500/[0.09] text-xl text-blue-300">
              ✎
            </div>

            <h3 className="mt-6 text-lg font-black">
              Create
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Turn your knowledge, experiences and ideas into
              beautiful stories.
            </p>
          </div>

          <div className="group rounded-[26px] border border-white/[0.07] bg-white/[0.025] p-7 transition duration-300 hover:-translate-y-1 hover:border-white/[0.13] hover:bg-white/[0.045]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.09] text-xl text-emerald-300">
              ↗
            </div>

            <h3 className="mt-6 text-lg font-black">
              Connect
            </h3>

            <p className="mt-2 text-sm leading-6 text-white/35">
              Follow writers, engage with stories and become part of
              the community.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
          ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 pb-16 sm:px-8 lg:px-10 lg:pb-24">
        <div className="relative overflow-hidden rounded-[32px] border border-white/[0.1] bg-gradient-to-br from-white/[0.075] via-white/[0.035] to-violet-500/[0.075] px-6 py-12 shadow-2xl shadow-black/30 sm:px-10 lg:px-14 lg:py-16">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-violet-500/[0.12] blur-[110px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-blue-500/[0.08] blur-[110px]"
          />

          <div className="relative flex flex-col justify-between gap-9 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30">
                Start your next chapter
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Have something worth saying?
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/40 sm:text-base">
                Write it. Publish it. Let the right people discover
                it.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
              <Link
                href="/create"
                className="rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-black transition duration-300 hover:-translate-y-1 hover:bg-white/90"
              >
                Start writing →
              </Link>

              <Link
                href="/blogs"
                className="rounded-2xl border border-white/[0.1] bg-black/10 px-7 py-4 text-center text-sm font-bold text-white/65 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] hover:text-white"
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
