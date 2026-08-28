"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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



export default function BlogDiscovery({
  posts,
}: {
  posts: Post[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        category === "All" ||
        post.category?.toLowerCase() === category.toLowerCase() ||
        post.topic?.toLowerCase() === category.toLowerCase();

      if (!matchesCategory) return false;

      if (!query) return true;

      return [
        post.title,
        post.excerpt,
        post.category,
        post.topic,
        post.language,
        post.guest_name,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(query),
        );
    });
  }, [posts, search, category]);

  const featured = filteredPosts[0];
  const latest = filteredPosts.slice(1);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#09090b] text-white">
      <section className="relative overflow-hidden border-b border-white/[0.08]">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-violet-600/[0.12] blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-blue-500/[0.09] blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14 sm:px-8 lg:px-10 lg:pb-16 lg:pt-20">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-violet-300">
              BlogVerse
            </span>

            <h1 className="mt-5 text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              Explore ideas.
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-lg">
              Discover useful ideas, technical knowledge and perspectives
              from writers, developers and creators.
            </p>
          </div>

          <div className="mt-10 max-w-3xl">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.045] px-4 py-3.5 shadow-2xl shadow-black/20 transition focus-within:border-violet-400/40 focus-within:bg-white/[0.07]">
              <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="shrink-0 text-zinc-500"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-4-4" />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search articles, topics, authors..."
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-zinc-500 sm:text-base"
              />

              {search ? (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="rounded-lg px-2 py-1 text-xs font-bold text-zinc-500 transition hover:bg-white/10 hover:text-white"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="sticky top-16 z-20 border-b border-white/[0.08] bg-[#09090b]/90 backdrop-blur-xl sm:top-[72px]">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 scrollbar-none sm:px-8 lg:px-10">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-bold transition ${
                  active
                    ? "bg-white text-black shadow-lg shadow-white/10"
                    : "border border-white/10 bg-white/[0.035] text-zinc-400 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">
              Discovery
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
              {search || category !== "All"
                ? "Matching articles"
                : "Latest articles"}
            </h2>
          </div>

          <p className="text-sm text-zinc-500">
            {filteredPosts.length}{" "}
            {filteredPosts.length === 1 ? "article" : "articles"}
          </p>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-[28px] border border-white/10 bg-white/[0.035] px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-xl font-black">
              BV
            </div>

            <h3 className="mt-6 text-2xl font-black">
              No articles found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500">
              Try another search term or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All");
              }}
              className="mt-6 rounded-xl bg-white px-5 py-3 text-sm font-black text-black transition hover:bg-zinc-200"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <>
            {featured ? (
              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.055] hover:shadow-violet-950/20 md:grid-cols-2"
              >
                <div className="relative min-h-[300px] overflow-hidden bg-zinc-950 md:min-h-[420px]">
                  {featured.cover_image ? (
                    <img
                      src={featured.cover_image}
                      alt={featured.title}
                      className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-zinc-950 via-zinc-900 to-violet-950">
                      <span className="text-7xl font-black text-white/[0.07]">
                        BV
                      </span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <span className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                    Featured
                  </span>
                </div>

                <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1.5 text-[11px] font-black text-violet-300">
                      {featured.topic ||
                        featured.category ||
                        "Technology"}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {formatDate(featured.created_at)}
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-black leading-tight tracking-[-0.035em] transition group-hover:text-violet-300 sm:text-4xl">
                    {featured.title}
                  </h3>

                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-zinc-400 sm:text-base">
                    {featured.excerpt ||
                      "Read this article on BlogVerse."}
                  </p>

                  <div className="mt-8 flex items-center justify-between border-t border-white/[0.08] pt-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                        Written by
                      </p>

                      <p className="mt-1 text-sm font-bold text-zinc-300">
                        {featured.guest_name || "BlogVerse Author"}
                      </p>
                    </div>

                    <span className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-black text-white transition group-hover:bg-white group-hover:text-black">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}

            {latest.length > 0 ? (
              <section className="mt-14">
                <div className="mb-7">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">
                    More from BlogVerse
                  </p>

                  <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                    {search || category !== "All"
                      ? "More results"
                      : "Latest blogs"}
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {latest.map((post) => (
                    <Link
                      key={post.id}
                      href={`/blog/${post.slug}`}
                      className="group overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-black/30"
                    >
                      <div className="relative h-52 overflow-hidden bg-zinc-950">
                        {post.cover_image ? (
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-800">
                            <span className="text-5xl font-black text-white/[0.07]">
                              BV
                            </span>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        <div className="absolute left-4 top-4">
                          <span className="rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-[10px] font-black text-white backdrop-blur-md">
                            {post.topic ||
                              post.category ||
                              "Blog"}
                          </span>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs font-semibold text-zinc-600">
                            {formatDate(post.created_at)}
                          </p>

                          <p className="text-[11px] font-bold text-zinc-600">
                            {post.likes?.length ?? 0} likes
                          </p>
                        </div>

                        <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight tracking-[-0.02em] transition group-hover:text-violet-300">
                          {post.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-500">
                          {post.excerpt ||
                            "Explore this article on BlogVerse."}
                        </p>

                        <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
                          <span className="text-xs font-bold text-zinc-500">
                            {post.guest_name || "BlogVerse Author"}
                          </span>

                          <span className="text-xs font-black text-zinc-300 transition group-hover:text-white">
                            Read →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}

        <section className="mt-16 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.035]">
          <div className="relative px-7 py-10 sm:px-10 lg:px-14 lg:py-12">
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/[0.10] blur-3xl" />

            <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-violet-400">
                  Become a writer
                </p>

                <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                  Have something worth sharing?
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500">
                  Publish your knowledge and reach readers on BlogVerse.
                </p>
              </div>

              <Link
                href="/create"
                className="shrink-0 rounded-2xl bg-white px-7 py-4 text-center text-sm font-black text-black transition hover:bg-zinc-200"
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
