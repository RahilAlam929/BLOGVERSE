import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { FeaturedPost } from "@/components/featured-post";
import { PostGrid } from "@/components/post-grid";
import { Header } from "@/components/header";

type RawPost = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  topic?: string | null;
  language?: string | null;
  category?: string | null;
  guest_name?: string | null;
  guest_id?: string | null;
  created_at?: string | null;
  likes?: { id: number }[] | null;
  comments?: { id: number }[] | null;
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`
      *,
      likes(id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load posts:", error);
  }

  const posts = (data ?? []) as RawPost[];

  const normalized = posts.map((post) => ({
    ...post,
    profiles: {
      name: post.guest_name || "BlogVerse Author",
      avatar_url: null,
    },
    likes_count: post.likes?.length ?? 0,
    comments_count: post.comments?.length ?? 0,
  }));

  const featured = normalized[0];
  const latest = normalized.slice(1);

  const categories = [
    "Technology",
    "Programming",
    "AI",
    "Web Development",
    "Design",
    "Startups",
    "Productivity",
  ];

  const totalLikes = posts.reduce(
    (total, post) => total + (post.likes?.length ?? 0),
    0
  );

  const totalComments = posts.reduce(
    (total, post) => total + (post.comments?.length ?? 0),
    0
  );

  const totalAuthors = new Set(
    posts.map((post) => post.guest_id).filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#06101d]">
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute right-[-180px] top-20 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:py-20 lg:px-8 lg:py-24">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            {/* HERO COPY */}
            <div>
              <div className="mb-7 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
                <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_18px_rgba(96,165,250,.9)]" />

                <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-300">
                  The modern blogging platform
                </span>
              </div>

              <h1 className="max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-8xl">
                Write.
                <span className="block text-slate-500">
                  Publish.
                </span>
                <span className="block">
                  Get discovered.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
                BlogVerse is a modern place to write and discover blogs about
                technology, programming, AI, design, startups and everything
                worth learning.
              </p>

              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/blogs"
                  className="rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-slate-100"
                >
                  Explore blogs →
                </Link>

                <Link
                  href="/create"
                  className="rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 text-center text-sm font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-white/10"
                >
                  Start writing
                </Link>
              </div>

              {/* STATS */}
              <div className="mt-14 grid max-w-2xl grid-cols-3 border-t border-white/10 pt-7">
                <div>
                  <p className="text-2xl font-black text-white sm:text-3xl">
                    {posts.length}+
                  </p>

                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Published blogs
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-white sm:text-3xl">
                    {totalAuthors}+
                  </p>

                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Writers
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-black text-white sm:text-3xl">
                    {totalLikes}+
                  </p>

                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Likes
                  </p>
                </div>
              </div>
            </div>

            {/* HERO FEATURE CARD */}
            {featured && (
              <div className="relative lg:pl-6">
                <div className="absolute -inset-4 rounded-[38px] bg-blue-500/10 blur-3xl" />

                <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] p-3 shadow-2xl backdrop-blur-xl">
                  <div className="overflow-hidden rounded-[24px] bg-white">
                    {featured.cover_image ? (
                      <div
                        className="h-56 bg-cover bg-center sm:h-64"
                        style={{
                          backgroundImage: `url(${featured.cover_image})`,
                        }}
                      />
                    ) : (
                      <div className="flex h-56 items-end bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 p-7 sm:h-64">
                        <span className="text-7xl font-black tracking-[-0.08em] text-white/10">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="p-7">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-blue-600">
                          Featured
                        </span>

                        {featured.category && (
                          <span className="text-xs font-bold text-slate-400">
                            {featured.category}
                          </span>
                        )}
                      </div>

                      <h2 className="mt-4 line-clamp-2 text-2xl font-black leading-tight tracking-[-0.03em] text-slate-950 sm:text-3xl">
                        {featured.title}
                      </h2>

                      {featured.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                          {featured.excerpt}
                        </p>
                      )}

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {featured.guest_name || "BlogVerse Author"}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {featured.likes_count} likes ·{" "}
                            {featured.comments_count} comments
                          </p>
                        </div>

                        <Link
                          href={`/blog/${featured.slug}`}
                          className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition hover:bg-blue-600"
                        >
                          Read →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <section className="sticky top-[78px] z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 lg:px-8">
          <span className="mr-2 flex shrink-0 items-center text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Explore
          </span>

          {categories.map((category) => (
            <Link
              key={category}
              href="/blogs"
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition duration-200 hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        {/* FEATURED BLOG */}
        {featured && (
          <section>
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                  Editor&apos;s pick
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                  Featured blog
                </h2>
              </div>

              <Link
                href={`/blog/${featured.slug}`}
                className="hidden text-sm font-bold text-slate-500 transition hover:text-slate-950 sm:block"
              >
                Read article →
              </Link>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-2xl">
              <FeaturedPost post={featured} />
            </div>
          </section>
        )}

        {/* LATEST BLOGS */}
        <section
          id="latest"
          className="mt-24 scroll-mt-32"
        >
          <div className="mb-9 flex items-end justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
                Recently published
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Latest blogs
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Fresh articles from the BlogVerse community.
              </p>
            </div>

            <Link
              href="/blogs"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:block"
            >
              View all →
            </Link>
          </div>

          {latest.length > 0 ? (
            <PostGrid posts={latest} />
          ) : (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white shadow-xl">
                BV
              </div>

              <h3 className="mt-6 text-2xl font-black tracking-[-0.03em]">
                Be the first to publish.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Share your knowledge, experience or ideas with the BlogVerse
                community.
              </p>

              <Link
                href="/create"
                className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:bg-blue-600"
              >
                Write a blog →
              </Link>
            </div>
          )}
        </section>

        {/* WHY BLOGVERSE */}
        <section className="mt-24">
          <div className="mb-9">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-600">
              Why BlogVerse
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
              Built for people who love ideas.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                01
              </div>

              <h3 className="mt-6 text-xl font-black">
                Write freely
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                A clean writing experience designed to keep your attention on
                the ideas that matter.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                02
              </div>

              <h3 className="mt-6 text-xl font-black">
                Get discovered
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Publish your work and help readers discover it through topics,
                categories and the community.
              </p>
            </div>

            <div className="group rounded-3xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-sm font-black text-white">
                03
              </div>

              <h3 className="mt-6 text-xl font-black">
                Keep learning
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Discover useful perspectives from developers, creators,
                founders and builders across the community.
              </p>
            </div>
          </div>
        </section>

        {/* COMMUNITY STATS */}
        <section className="mt-24 rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-3xl font-black tracking-[-0.04em]">
                {posts.length}+
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Articles published
              </p>
            </div>

            <div>
              <p className="text-3xl font-black tracking-[-0.04em]">
                {totalComments}+
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Community comments
              </p>
            </div>

            <div>
              <p className="text-3xl font-black tracking-[-0.04em]">
                {totalLikes}+
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-500">
                Likes shared
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mt-24 overflow-hidden rounded-[32px] bg-slate-950">
          <div className="relative px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-blue-400">
                  Start publishing
                </p>

                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
                  Your next blog could be someone&apos;s next idea.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Create an account, write something useful and publish it on
                  BlogVerse.
                </p>
              </div>

              <Link
                href="/create"
                className="shrink-0 rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-slate-100"
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


           
