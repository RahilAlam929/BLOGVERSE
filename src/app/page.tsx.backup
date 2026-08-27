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

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function truncate(text?: string | null, length = 150) {
  if (!text) return "Discover a new perspective from the BlogVerse community.";
  return text.length > length ? `${text.slice(0, length)}...` : text;
}

export default async function HomePage() {
  const supabase = await createClient();

  const { data: rawPosts } = await supabase
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

  const posts = (rawPosts ?? []) as Post[];

  const publishedBlogs = posts.length;

  const writers = new Set(
    posts
      .map((post) => post.guest_id)
      .filter(Boolean)
  ).size;

  const totalLikes = posts.reduce(
    (total, post) => total + (post.likes?.length ?? 0),
    0
  );

  const featured = posts[0];
  const latestPosts = posts.slice(1, 7);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* HERO */}
      <section className="relative isolate">
        {/* Background grid */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-180px] top-[-180px] -z-10 h-[620px] w-[620px] rounded-full bg-violet-600/20 blur-[140px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-[-220px] left-[-180px] -z-10 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[130px]"
        />

        <div className="mx-auto max-w-7xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-28 lg:px-10 lg:pb-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_.95fr] lg:gap-10">
            {/* LEFT */}
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-white/65 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                The modern blogging platform
              </div>

              <h1 className="mt-7 text-[clamp(3.7rem,8vw,7.8rem)] font-black leading-[0.82] tracking-[-0.07em]">
                Write.
                <br />
                <span className="text-white/30">Publish.</span>
                <br />
                Get discovered.
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-white/55 sm:text-lg sm:leading-8">
                BlogVerse is a place to write and discover ideas about
                technology, programming, AI, design, startups, productivity
                and everything worth learning.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <Link
                  href="/blogs"
                  className="group inline-flex items-center gap-3 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
                >
                  Explore blogs
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  href="/create"
                  className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/[0.04] px-6 py-3.5 text-sm font-bold text-white transition hover:border-white/30 hover:bg-white/[0.08]"
                >
                  Start writing
                  <span className="text-white/50">↗</span>
                </Link>
              </div>

              {/* REAL STATS */}
              <div className="mt-14 grid max-w-2xl grid-cols-3 gap-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-2xl font-black sm:text-3xl">
                    {publishedBlogs}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                    Published blogs
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-2xl font-black sm:text-3xl">
                    {writers}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                    Writers
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                  <p className="text-2xl font-black sm:text-3xl">
                    {totalLikes}
                  </p>
                  <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35">
                    Likes
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT VISUAL */}
            <div className="relative mx-auto hidden h-[520px] w-full max-w-[560px] lg:block">
              <div className="absolute left-1/2 top-1/2 h-[330px] w-[330px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-gradient-to-br from-white/[0.08] to-transparent shadow-[0_0_120px_rgba(255,255,255,0.06)]" />

              <div className="absolute left-1/2 top-1/2 h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0b0b0b] shadow-[inset_0_0_70px_rgba(255,255,255,0.04),0_0_100px_rgba(139,92,246,0.12)]" />

              <div className="absolute left-1/2 top-1/2 h-[440px] w-[170px] -translate-x-1/2 -translate-y-1/2 rotate-[55deg] rounded-[50%] border border-white/10" />

              <div className="absolute left-1/2 top-1/2 h-[440px] w-[170px] -translate-x-1/2 -translate-y-1/2 -rotate-[55deg] rounded-[50%] border border-white/10" />

              <div className="absolute left-[14%] top-[18%] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl shadow-2xl backdrop-blur">
                ✦
              </div>

              <div className="absolute right-[12%] top-[24%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl shadow-2xl backdrop-blur">
                ↗
              </div>

              <div className="absolute bottom-[17%] left-[19%] flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] font-mono text-sm shadow-2xl backdrop-blur">
                &lt;/&gt;
              </div>

              <div className="absolute bottom-[13%] right-[18%] flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl shadow-2xl backdrop-blur">
                ●
              </div>

              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-5xl font-black tracking-[-0.06em]">
                  BV
                </p>
                <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.3em] text-white/35">
                  Ideas in motion
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured ? (
        <section className="bg-[#080808] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/35">
                  Featured
                </p>
                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Latest idea worth reading.
                </h2>
              </div>

              <Link
                href="/blogs"
                className="hidden text-sm font-bold text-white/50 transition hover:text-white sm:block"
              >
                View all →
              </Link>
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] lg:grid-cols-[1.05fr_.95fr]"
            >
              <div className="relative min-h-[330px] overflow-hidden bg-[#0d0d0d] lg:min-h-[430px]">
                {featured.cover_image ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={featured.cover_image}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[130px] font-black tracking-[-0.08em] text-white/[0.035]">
                      BV
                    </span>
                  </div>
                )}

                <div className="absolute bottom-5 left-5">
                  <span className="rounded-full border border-white/15 bg-black/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/75 backdrop-blur">
                    {featured.topic || featured.category || "Article"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10">
                <div className="flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/35">
                  {featured.language ? (
                    <span>{featured.language}</span>
                  ) : null}
                  <span>•</span>
                  <span>{formatDate(featured.created_at)}</span>
                </div>

                <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">
                  {featured.title}
                </h3>

                <p className="mt-5 text-sm leading-7 text-white/45 sm:text-base">
                  {truncate(featured.excerpt, 190)}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                  <span className="text-sm font-semibold text-white/55">
                    {featured.guest_name || "Anonymous"}
                  </span>

                  <span className="text-xl transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : (
        <section className="bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-7xl rounded-[30px] border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-white/40">
              No published blogs yet.
            </p>
            <Link
              href="/create"
              className="mt-5 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-black"
            >
              Publish the first article
            </Link>
          </div>
        </section>
      )}

      {/* LATEST */}
      {latestPosts.length > 0 ? (
        <section className="bg-[#050505] px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-9">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                Discover
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                More from BlogVerse
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.045]"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-[#0d0d0d]">
                    {post.cover_image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-6xl font-black text-white/[0.04]">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white/65 backdrop-blur">
                        {post.topic || post.category || "Article"}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/30">
                      <span>{formatDate(post.created_at)}</span>
                      <span>•</span>
                      <span>{post.likes?.length ?? 0} likes</span>
                    </div>

                    <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-[-0.025em]">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/40">
                      {truncate(post.excerpt)}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs font-semibold text-white/45">
                        {post.guest_name || "Anonymous"}
                      </span>

                      <span className="text-white/35 transition group-hover:translate-x-1 group-hover:text-white">
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
                className="inline-flex rounded-2xl border border-white/10 bg-white/[0.035] px-6 py-3 text-sm font-bold text-white/70 transition hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
              >
                Explore all blogs →
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {/* FINAL CTA */}
      <section className="bg-[#080808] px-5 py-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] px-6 py-16 text-center sm:px-10">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-white/[0.06] blur-[90px]"
            />

            <div className="relative">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                Your idea belongs here
              </p>

              <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-black tracking-[-0.05em] sm:text-6xl">
                Have something worth sharing?
              </h2>

              <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/40 sm:text-base">
                Turn your knowledge, experience and ideas into an article
                that people can discover.
              </p>

              <Link
                href="/create"
                className="mt-8 inline-flex rounded-2xl bg-white px-7 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Start writing →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
