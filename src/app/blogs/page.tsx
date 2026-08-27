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
  "AI",
  "Programming",
  "Web Development",
  "Technology",
  "JavaScript",
  "React",
  "Next.js",
  "Design",
  "Startups",
  "Productivity",
];

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

function getTag(post: Post) {
  return post.topic || post.category || "Article";
}

function getAuthor(post: Post) {
  return post.guest_name || "BlogVerse Author";
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
    <main className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      {/* BACKGROUND GLOW */}

      <div
        aria-hidden="true"
        className="pointer-events-none fixed left-[-180px] top-[120px] -z-0 h-[420px] w-[420px] rounded-full bg-violet-600/[0.06] blur-[130px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-[-180px] top-[420px] -z-0 h-[420px] w-[420px] rounded-full bg-blue-600/[0.05] blur-[130px]"
      />

      {/* HERO */}

      <section className="relative border-b border-white/[0.07]">
        <div className="mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-7 sm:pb-16 sm:pt-20 lg:px-10 lg:pb-20 lg:pt-24">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.09] bg-white/[0.035] px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-white/45">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              BlogVerse community
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
              Ideas worth
              <span className="block bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                reading.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-lg sm:leading-8">
              Explore practical knowledge, technical guides, AI discoveries,
              programming tutorials and stories from builders around the
              community.
            </p>
          </div>

          {/* SEARCH */}

          <div className="mt-9 max-w-3xl">
            <div className="group flex items-center gap-3 rounded-2xl border border-white/[0.09] bg-white/[0.035] px-4 py-3.5 shadow-2xl shadow-black/20 backdrop-blur-xl transition focus-within:border-white/20 focus-within:bg-white/[0.055] sm:px-5 sm:py-4">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-white/30"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="search"
                placeholder="Search blogs, topics and authors..."
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-white/25"
              />

              <span className="hidden rounded-lg border border-white/[0.08] bg-white/[0.04] px-2 py-1 text-[10px] font-bold text-white/25 sm:block">
                SEARCH
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* FILTERS */}

      <section className="sticky top-[72px] z-30 border-b border-white/[0.07] bg-[#050505]/85 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-5 sm:px-7 lg:px-10">
          <div className="flex gap-2 overflow-x-auto py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {categories.map((category, index) => (
              <button
                key={category}
                type="button"
                className={`shrink-0 rounded-full border px-4 py-2.5 text-xs font-bold transition sm:px-5 ${
                  index === 0
                    ? "border-white bg-white text-black shadow-lg shadow-white/10"
                    : "border-white/[0.09] bg-white/[0.025] text-white/45 hover:border-white/20 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-7 sm:py-16 lg:px-10 lg:py-20">
        {/* FEATURED */}

        {featured && (
          <section>
            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400">
                  Featured story
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                  Start here
                </h2>
              </div>

              <span className="hidden text-xs font-semibold text-white/25 sm:block">
                Editor&apos;s pick
              </span>
            </div>

            <Link
              href={`/blog/${featured.slug}`}
              className="group relative grid overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#0b0b0d] shadow-2xl shadow-black/30 transition duration-500 hover:-translate-y-1 hover:border-white/[0.16] hover:shadow-black/60 md:grid-cols-2"
            >
              <div className="relative min-h-[290px] overflow-hidden bg-[#0a0a0c] sm:min-h-[390px]">
                {featured.cover_image ? (
                  <img
                    src={featured.cover_image}
                    alt={featured.title}
                    className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(124,58,237,.3),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(37,99,235,.2),transparent_35%),#09090b]">
                    <span className="text-8xl font-black tracking-[-0.08em] text-white/[0.07]">
                      BV
                    </span>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1.5 text-[10px] font-black text-white/80 backdrop-blur-xl">
                    {getTag(featured)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/30">
                  <span>{formatDate(featured.created_at)}</span>
                  <span className="h-1 w-1 rounded-full bg-white/20" />
                  <span>{featured.language || "English"}</span>
                </div>

                <h3 className="mt-5 text-3xl font-black leading-[1.08] tracking-[-0.04em] text-white transition group-hover:text-violet-200 sm:text-4xl">
                  {featured.title}
                </h3>

                <p className="mt-5 line-clamp-3 text-sm leading-7 text-white/40 sm:text-base">
                  {featured.excerpt ||
                    "Discover this story from the BlogVerse community."}
                </p>

                <div className="mt-8 flex items-center justify-between border-t border-white/[0.07] pt-5">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/25">
                      Written by
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-white/75">
                      {getAuthor(featured)}
                    </p>
                  </div>

                  <span className="ml-4 shrink-0 rounded-xl border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-xs font-black text-white transition group-hover:bg-white group-hover:text-black">
                    Read →
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* LATEST */}

        <section className="mt-16 sm:mt-20">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400">
                Fresh from the community
              </p>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Latest blogs
              </h2>
            </div>

            <span className="hidden text-xs font-semibold text-white/25 sm:block">
              {posts.length} published
            </span>
          </div>

          {latest.length > 0 ? (
            <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-[#0a0a0c] transition duration-400 hover:-translate-y-1 hover:border-white/[0.15] hover:bg-[#0d0d0f] hover:shadow-2xl hover:shadow-black/40"
                >
                  <div className="relative h-48 overflow-hidden bg-[#08080a] sm:h-52">
                    {post.cover_image ? (
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className="h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,rgba(124,58,237,.18),transparent_38%),#09090b]">
                        <span className="text-6xl font-black tracking-[-0.08em] text-white/[0.06]">
                          BV
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />

                    <div className="absolute left-4 top-4">
                      <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1.5 text-[10px] font-black text-white/75 backdrop-blur-xl">
                        {getTag(post)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 sm:p-6">
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-white/25">
                      <span>{formatDate(post.created_at)}</span>
                      <span>•</span>
                      <span>{post.language || "EN"}</span>
                    </div>

                    <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-[-0.025em] text-white transition group-hover:text-violet-200">
                      {post.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/35">
                      {post.excerpt ||
                        "Explore this article and discover a new perspective."}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                      <span className="max-w-[65%] truncate text-xs font-bold text-white/40">
                        {getAuthor(post)}
                      </span>

                      <span className="text-xs font-black text-white/60 transition group-hover:text-white">
                        Read →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[30px] border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-20 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-lg font-black">
                BV
              </div>

              <h3 className="mt-6 text-2xl font-black">
                No blogs yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                Be the first person to publish something worth reading.
              </p>

              <Link
                href="/create"
                className="mt-6 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-white/90"
              >
                Write a blog →
              </Link>
            </div>
          )}
        </section>

        {/* WRITER CTA */}

        <section className="relative mt-20 overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#0a0a0c] sm:mt-24">
          <div
            aria-hidden="true"
            className="absolute -right-28 -top-28 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-blue-600/[0.08] blur-[100px]"
          />

          <div className="relative flex flex-col gap-8 px-7 py-10 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14 lg:py-14">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-300">
                Become a writer
              </p>

              <h2 className="mt-3 max-w-2xl text-2xl font-black tracking-tight sm:text-3xl">
                Have an idea worth sharing?
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-white/35">
                Turn your knowledge, experience or story into an article and
                share it with the BlogVerse community.
              </p>
            </div>

            <Link
              href="/create"
              className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-7 py-4 text-sm font-black text-black transition duration-300 hover:-translate-y-0.5 hover:bg-white/90"
            >
              Write a blog →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
