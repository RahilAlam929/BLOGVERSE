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
      name: post.guest_name || "BlogVerse Writer",
      avatar_url: null,
    },
    likes_count: post.likes?.length ?? 0,
    comments_count: post.comments?.length ?? 0,
  }));

  const featured = normalized[0];
  const latest = normalized.slice(1);

  const topics = [
    "Technology",
    "AI",
    "Programming",
    "Design",
    "Startups",
    "Productivity",
  ];

  return (
    <main className="min-h-screen bg-[#f7f8fa] text-slate-950">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#07111f]">
        <div className="absolute inset-0">
          <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.06),transparent_30%)]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:py-24 lg:px-8 lg:py-28">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
                A space for ideas
              </span>
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-8xl">
              Stories that
              <span className="block text-slate-400">
                move ideas forward.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Discover thoughtful writing from creators, developers,
              designers and people building what comes next.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="#latest"
                className="rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore stories
              </a>

              <a
                href="/create"
                className="rounded-2xl border border-white/15 bg-white/[0.06] px-6 py-3.5 text-center text-sm font-bold text-white backdrop-blur transition hover:bg-white/10"
              >
                Start writing →
              </a>
            </div>
          </div>

          {/* HERO STATS */}
          <div className="mt-16 grid max-w-2xl grid-cols-3 border-t border-white/10 pt-8">
            <div>
              <p className="text-2xl font-black text-white">
                {posts.length}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Stories
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-white">
                {new Set(posts.map((post) => post.guest_id).filter(Boolean)).size}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Writers
              </p>
            </div>

            <div>
              <p className="text-2xl font-black text-white">
                {posts.reduce(
                  (total, post) => total + (post.likes?.length ?? 0),
                  0
                )}
              </p>
              <p className="mt-1 text-xs font-semibold text-slate-500">
                Reactions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-5 lg:px-8">
          <span className="mr-2 whitespace-nowrap px-3 py-2 text-xs font-black uppercase tracking-wider text-slate-400">
            Explore
          </span>

          {topics.map((topic) => (
            <button
              key={topic}
              type="button"
              className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold text-slate-600 transition hover:border-slate-950 hover:bg-slate-950 hover:text-white"
            >
              {topic}
            </button>
          ))}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">

        {/* FEATURED HEADER */}
        {featured && (
          <section>
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Featured
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                  Editor&apos;s pick
                </h2>
              </div>

              <a
                href={`/blog/${featured.slug}`}
                className="hidden text-sm font-bold text-slate-500 transition hover:text-slate-950 sm:block"
              >
                Read featured →
              </a>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:shadow-xl">
              <FeaturedPost post={featured} />
            </div>
          </section>
        )}

        {/* LATEST */}
        <section id="latest" className="mt-20 scroll-mt-28">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Fresh from the community
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Latest stories
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                The newest ideas, experiences and perspectives published on
                BlogVerse.
              </p>
            </div>

            <a
              href="/blogs"
              className="hidden rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-950 sm:block"
            >
              View all
            </a>
          </div>

          {latest.length > 0 ? (
            <div className="overflow-hidden">
              <PostGrid posts={latest} />
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white">
                B
              </div>

              <h3 className="mt-5 text-2xl font-black">
                Your first story belongs here.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
                Start writing and share your ideas with the BlogVerse
                community.
              </p>

              <a
                href="/create"
                className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
              >
                Write your first story →
              </a>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="mt-20 overflow-hidden rounded-[30px] bg-slate-950">
          <div className="relative px-6 py-14 sm:px-10 lg:px-14">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />

            <div className="relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                  Your voice matters
                </p>

                <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                  Have an idea worth sharing?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Turn your thoughts into a story and publish it for the
                  BlogVerse community.
                </p>
              </div>

              <a
                href="/create"
                className="shrink-0 rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Start writing →
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
