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
    return "Discover a new perspective from the BlogVerse community.";
  }

  const cleanText = text.replace(/\s+/g, " ").trim();

  return cleanText.length > length
    ? `${cleanText.slice(0, length)}...`
    : cleanText;
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
    console.error("BlogVerse homepage error:", error);
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
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white selection:bg-white selection:text-black">
      {/* HERO */}

      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-72 -top-72 h-[650px] w-[650px] rounded-full bg-violet-600/[0.07] blur-[150px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-80 -left-72 h-[600px] w-[600px] rounded-full bg-blue-600/[0.05] blur-[150px]"
        />

        <div className="relative mx-auto max-w-7xl px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-28 lg:px-10 lg:pb-28 lg:pt-36">
          <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_.9fr] lg:gap-12">
            {/* HERO CONTENT */}

            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white/45 backdrop-blur-xl">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/40" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white/70" />
                </span>

                The modern blogging platform
              </div>

              <h1 className="mt-8 max-w-4xl text-[clamp(4rem,9vw,8.7rem)] font-black leading-[0.8] tracking-[-0.075em]">
                Ideas
                <br />
                <span className="text-white/25">deserve</span>
                <br />
                <span>attention.</span>
              </h1>

              <p className="mt-9 max-w-2xl text-base leading-7 text-white/45 sm:text-lg sm:leading-8">
                Write what you know. Share what you learn. Discover ideas
                from people building, creating and thinking about what comes
                next.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/blogs"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90 hover:shadow-[0_15px_50px_rgba(255,255,255,0.08)]"
                >
                  Explore stories

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/create"
                  className="group inline-flex items-center gap-3 rounded-2xl border border-white/[0.1] bg-white/[0.025] px-6 py-3.5 text-sm font-bold text-white/75 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                >
                  Start writing

                  <span className="text-white/30 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/70">
                    ↗
                  </span>
                </Link>
              </div>

              {/* STATS */}

              <div className="mt-14 flex flex-wrap gap-x-10 gap-y-6 border-t border-white/[0.07] pt-7">
                <div>
                  <p className="text-2xl font-black tracking-tight sm:text-3xl">
                    {publishedBlogs}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                    Published
                  </p>
                </div>

                <div className="h-10 w-px bg-white/[0.07]" />

                <div>
                  <p className="text-2xl font-black tracking-tight sm:text-3xl">
                    {writers}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                    Writers
                  </p>
                </div>

                <div className="h-10 w-px bg-white/[0.07]" />

                <div>
                  <p className="text-2xl font-black tracking-tight sm:text-3xl">
                    {totalLikes}
                  </p>

                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white/25">
                    Likes
                  </p>
                </div>
              </div>
            </div>

            {/* HERO VISUAL */}

            <div className="relative hidden min-h-[540px] lg:block">
              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[390px] w-[390px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]"
              />

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.05]"
              />

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[210px] w-[210px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.025] shadow-[0_0_120px_rgba(255,255,255,0.04)]"
              />

              <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[30px] border border-white/[0.09] bg-[#0a0a0a]/90 shadow-2xl backdrop-blur-xl">
                <span className="text-4xl font-black tracking-[-0.08em]">
                  BV
                </span>

                <span className="mt-1 text-[8px] font-bold uppercase tracking-[0.3em] text-white/25">
                  BlogVerse
                </span>
              </div>

              <div className="absolute left-[9%] top-[19%] rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 shadow-2xl backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Explore
                </p>

                <p className="mt-1 text-sm font-bold">New perspectives</p>
              </div>

              <div className="absolute right-[4%] top-[27%] rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 shadow-2xl backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Discover
                </p>

                <p className="mt-1 text-sm font-bold">Fresh ideas</p>
              </div>

              <div className="absolute bottom-[20%] left-[12%] rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 shadow-2xl backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Create
                </p>

                <p className="mt-1 font-mono text-sm font-bold">
                  &lt;/&gt;
                </p>
              </div>

              <div className="absolute bottom-[13%] right-[12%] rounded-2xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 shadow-2xl backdrop-blur-xl">
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/30">
                  Connect
                </p>

                <p className="mt-1 text-sm font-bold">∞</p>
              </div>

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[460px] w-[170px] -translate-x-1/2 -translate-y-1/2 rotate-[48deg] rounded-[50%] border border-white/[0.045]"
              />

              <div
                aria-hidden="true"
                className="absolute left-1/2 top-1/2 h-[460px] w-[170px] -translate-x-1/2 -translate-y-1/2 -rotate-[48deg] rounded-[50%] border border-white/[0.045]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}

      {featured ? (
        <section className="relative px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/25">
                  Featured story
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                  Worth your attention.
                </h2>
              </div>

              <Link
                href="/blogs"
                className="hidden text-xs font-bold text-white/35 transition hover:text-white sm:block"
              >
                View all stories →
              </Link>
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group relative grid overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0a0a0a] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-[0_30px_100px_rgba(0,0,0,0.45)] lg:grid-cols-[1.1fr_.9fr]"
            >
              <div className="relative min-h-[350px] overflow-hidden lg:min-h-[480px]">
                {featured.cover_image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover_image}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-700 group-hover:scale-105 group-hover:opacity-90"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/15 to-transparent" />

                    <div className="absolute inset-0 bg-black/10 transition duration-500 group-hover:bg-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/[0.035] to-transparent">
                    <span className="text-[150px] font-black tracking-[-0.1em] text-white/[0.035]">
                      BV
                    </span>
                  </div>
                )}

                <div className="absolute bottom-6 left-6">
                  <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-white/60 backdrop-blur-xl">
                    {getCategory(featured)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-11">
                <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                  <span>{formatDate(featured.created_at)}</span>

                  <span>•</span>

                  <span>{featured.language || "English"}</span>
                </div>

                <h3 className="mt-6 text-3xl font-black leading-[1.02] tracking-[-0.05em] sm:text-5xl">
                  {featured.title}
                </h3>

                <p className="mt-6 max-w-xl text-sm leading-7 text-white/38 sm:text-base">
                  {truncate(featured.excerpt, 210)}
                </p>

                <div className="mt-9 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <div>
                    <p className="text-xs font-bold text-white/60">
                      {getAuthor(featured)}
                    </p>

                    <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/20">
                      Writer
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-lg transition-all duration-300 group-hover:border-white/20 group-hover:bg-white group-hover:text-black">
                    →
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-[32px] border border-white/[0.08] bg-[#090909] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-xl font-black">
                BV
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight">
                Your story could be the first.
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/35">
                Start writing and publish something worth discovering.
              </p>

              <Link
                href="/create"
                className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:-translate-y-1"
              >
                Publish your first story →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* LATEST */}

      {latestPosts.length > 0 && (
        <section className="px-5 pb-20 pt-4 sm:px-8 lg:px-10 lg:pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9 flex items-end justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-white/25">
                  Latest
                </p>

                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-5xl">
                  Fresh from the community.
                </h2>
              </div>

              <Link
                href="/blogs"
                className="hidden text-xs font-bold text-white/35 transition hover:text-white sm:block"
              >
                Browse everything →
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[28px] border border-white/[0.07] bg-[#090909] transition-all duration-500 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#0c0c0c] hover:shadow-[0_25px_70px_rgba(0,0,0,0.35)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                    {post.cover_image ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover opacity-70 transition duration-700 group-hover:scale-105 group-hover:opacity-85"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-white/[0.03] to-transparent">
                        <span className="text-7xl font-black tracking-[-0.08em] text-white/[0.035]">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[8px] font-bold uppercase tracking-[0.18em] text-white/55 backdrop-blur-xl">
                        {getCategory(post)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.16em] text-white/22">
                      <span>{formatDate(post.created_at)}</span>

                      <span>•</span>

                      <span>{post.likes?.length ?? 0} likes</span>
                    </div>

                    <h3 className="mt-4 line-clamp-2 text-xl font-black leading-[1.08] tracking-[-0.035em]">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/32">
                      {truncate(post.excerpt)}
                    </p>

                    <div className="mt-7 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <div>
                        <p className="text-[11px] font-bold text-white/45">
                          {getAuthor(post)}
                        </p>
                      </div>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.07] text-sm text-white/25 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white group-hover:text-black">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/blogs"
                className="group inline-flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-6 py-3.5 text-xs font-bold text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
              >
                Explore all stories

                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA */}

      <section className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[36px] border border-white/[0.08] bg-[#090909] px-6 py-20 text-center sm:px-10 sm:py-24">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute left-1/2 top-[-180px] h-[360px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.035] blur-[120px]"
            />

            <div className="relative">
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/25">
                Make something worth reading
              </p>

              <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-black leading-[0.95] tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Your next idea
                <br />
                starts here.
              </h2>

              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/32 sm:text-base">
                Share your knowledge, experience and perspective with the
                BlogVerse community.
              </p>

              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Link
                  href="/create"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-black transition-all duration-300 hover:-translate-y-1 hover:bg-white/90"
                >
                  Start writing

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/blogs"
                  className="inline-flex rounded-2xl border border-white/[0.08] bg-white/[0.025] px-7 py-3.5 text-sm font-bold text-white/55 transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:text-white"
                >
                  Read stories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM SPACE */}

      <div className="h-6 bg-[#050505]" />
    </main>
  );
}
