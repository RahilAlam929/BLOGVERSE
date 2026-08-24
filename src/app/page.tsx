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

  const { data } = await supabase
    .from("posts")
    .select(`
      *,
      likes(id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

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

  const totalAuthors = new Set(
    posts.map((post) => post.guest_id).filter(Boolean)
  ).size;

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#07111f]">
        <div className="absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-3xl" />

          <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:48px_48px]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
          <div className="max-w-4xl">

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-[0_0_15px_rgba(96,165,250,.8)]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
                The modern blogging platform
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl">
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
              <a
                href="/blogs"
                className="rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore blogs →
              </a>

              <a
                href="/create"
                className="rounded-2xl border border-white/15 bg-white/[0.05] px-7 py-4 text-center text-sm font-bold text-white transition hover:bg-white/10"
              >
                Start writing
              </a>
            </div>
          </div>

          {/* STATS */}
          <div className="mt-16 grid max-w-2xl grid-cols-3 border-t border-white/10 pt-8">
            <div>
              <p className="text-2xl font-black text-white">
                {posts.length}+
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Published blogs
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-white">
                {totalAuthors}+
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Writers
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-white">
                {totalLikes}+
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Likes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY BAR */}
      <section className="sticky top-[78px] z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-4 lg:px-8">
          <span className="mr-2 flex shrink-0 items-center text-xs font-black uppercase tracking-[0.18em] text-slate-400">
            Browse
          </span>

          {categories.map((category) => (
            <a
              key={category}
              href="/blogs"
              className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      {/* CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">

        {/* FEATURED */}
        {featured && (
          <section>
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                  Featured blog
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                  Editor&apos;s choice
                </h2>
              </div>

              <a
                href={`/blog/${featured.slug}`}
                className="hidden text-sm font-bold text-slate-500 hover:text-slate-950 sm:block"
              >
                Read blog →
              </a>
            </div>

            <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-sm transition duration-300 hover:shadow-2xl">
              <FeaturedPost post={featured} />
            </div>
          </section>
        )}

        {/* LATEST BLOGS */}
        <section
          id="latest"
          className="mt-20 scroll-mt-32"
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">
                Recently published
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Latest blogs
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Fresh articles from the BlogVerse community.
              </p>
            </div>

            <a
              href="/blogs"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:block"
            >
              View all blogs →
            </a>
          </div>

          {latest.length > 0 ? (
            <PostGrid posts={latest} />
          ) : (
            <div className="rounded-[30px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
                BV
              </div>

              <h3 className="mt-6 text-2xl font-black">
                Be the first to publish.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Share your knowledge, experience or ideas with the BlogVerse
                community.
              </p>

              <a
                href="/create"
                className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Write a blog →
              </a>
            </div>
          )}
        </section>

        {/* WHY BLOGVERSE */}
        <section className="mt-20 grid gap-5 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
              01
            </div>

            <h3 className="mt-6 text-xl font-black">
              Write freely
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              A clean editor designed to help you focus on your ideas instead
              of complicated publishing tools.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
              02
            </div>

            <h3 className="mt-6 text-xl font-black">
              Build your audience
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Publish your blogs and let readers discover your work through
              topics and categories.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-lg font-black text-white">
              03
            </div>

            <h3 className="mt-6 text-xl font-black">
              Keep learning
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Discover useful blogs from developers, creators and builders
              across the community.
            </p>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="mt-20 overflow-hidden rounded-[32px] bg-slate-950">
          <div className="relative px-6 py-14 sm:px-10 lg:px-14 lg:py-16">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-400">
                  Start publishing
                </p>

                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl">
                  Your next blog could be someone&apos;s next idea.
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Create an account, write something useful and publish it on
                  BlogVerse.
                </p>
              </div>

              <a
                href="/create"
                className="shrink-0 rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Write a blog →
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
