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

function getImage(post: Post) {
  return (
    post.cover_image ||
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
  );
}

export default function BlogDiscovery({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(6);

  const filteredPosts = useMemo(() => {
    const search = query.trim().toLowerCase();

    return posts.filter((post) => {
      const matchesCategory =
        category === "All" ||
        post.category?.toLowerCase() === category.toLowerCase() ||
        post.topic?.toLowerCase() === category.toLowerCase();

      const matchesSearch =
        !search ||
        post.title.toLowerCase().includes(search) ||
        (post.excerpt || "").toLowerCase().includes(search) ||
        (post.topic || "").toLowerCase().includes(search) ||
        (post.category || "").toLowerCase().includes(search) ||
        (post.guest_name || "").toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  }, [posts, query, category]);

  function resetFilters() {
    setQuery("");
    setCategory("All");
    setVisibleCount(6);
  }

  const featured = filteredPosts[0];
  const latest = filteredPosts.slice(1, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  return (
    <section className="w-full">
      {/* HEADER */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
          BlogVerse
        </p>

        <h2 className="text-3xl font-black tracking-tight text-[#1f1f26] sm:text-4xl">
          Discover more
        </h2>

        <p className="mt-2 max-w-2xl text-slate-600">
          Explore ideas, tutorials, stories and insights from the BlogVerse
          community.
        </p>
      </div>

      {/* SEARCH */}
      <div className="rounded-[24px] border border-black/10 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 transition focus-within:border-violet-400 focus-within:bg-white">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="shrink-0 text-slate-500"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>

            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search articles, topics, authors..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {/* CATEGORY FILTERS */}
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {categories.map((item) => {
            const active = category === item;

            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? "bg-[#1f1f26] text-white"
                    : "border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      {/* RESULTS */}
      {filteredPosts.length === 0 ? (
        <div className="mt-8 rounded-[28px] border border-black/10 bg-white px-6 py-16 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
            🔎
          </div>

          <h3 className="mt-5 text-xl font-black">
            No articles found
          </h3>

          <p className="mt-2 text-slate-500">
            Try another search or choose a different category.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setCategory("All");
            }}
            className="mt-6 rounded-full bg-[#1f1f26] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Reset filters
          </button>
        </div>
      ) : (
        <>
          {/* FEATURED */}
          {featured ? (
            <div className="mt-8">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-black">
                  Featured article
                </h3>

                <span className="text-sm text-slate-500">
                  {filteredPosts.length}{" "}
                  {filteredPosts.length === 1 ? "article" : "articles"}
                </span>
              </div>

              <Link
                href={`/blog/${featured.slug}`}
                className="group grid overflow-hidden rounded-[28px] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[1.1fr_1fr]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 lg:aspect-auto lg:min-h-[340px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getImage(featured)}
                    alt={featured.title}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />

                  <div className="absolute left-5 top-5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold backdrop-blur">
                    Featured
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                  <div className="flex flex-wrap gap-2">
                    {featured.category ? (
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                        {featured.category}
                      </span>
                    ) : null}

                    {featured.topic ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {featured.topic}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-5 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl">
                    {featured.title}
                  </h3>

                  {featured.excerpt ? (
                    <p className="mt-4 line-clamp-4 leading-7 text-slate-600">
                      {featured.excerpt}
                    </p>
                  ) : null}

                  <div className="mt-7 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="font-semibold text-slate-700">
                      {featured.guest_name || "Anonymous"}
                    </span>

                    <span>•</span>

                    <span>{formatDate(featured.created_at)}</span>
                  </div>

                  <div className="mt-6 flex items-center gap-5 text-sm text-slate-500">
                    <span>
                      ❤️ {featured.likes?.length ?? 0}
                    </span>

                    <span>
                      💬 {featured.comments?.length ?? 0}
                    </span>

                    <span className="ml-auto font-bold text-violet-600">
                      Read article →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ) : null}

          {/* LATEST */}
          {latest.length > 0 ? (
            <div className="mt-12">
              <div className="mb-5">
                <h3 className="text-2xl font-black">
                  Latest articles
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Fresh stories from the community
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {latest.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getImage(post)}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5">
                      <div className="flex flex-wrap gap-2">
                        {post.category ? (
                          <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-bold text-violet-700">
                            {post.category}
                          </span>
                        ) : null}

                        {post.language ? (
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                            {post.language}
                          </span>
                        ) : null}
                      </div>

                      <h4 className="mt-4 line-clamp-2 text-xl font-black leading-tight">
                        {post.title}
                      </h4>

                      {post.excerpt ? (
                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                          {post.excerpt}
                        </p>
                      ) : null}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                        <span className="font-semibold">
                          {post.guest_name || "Anonymous"}
                        </span>

                        <span>{formatDate(post.created_at)}</span>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                        <span>❤️ {post.likes?.length ?? 0}</span>
                        <span>💬 {post.comments?.length ?? 0}</span>

                        <span className="ml-auto font-bold text-violet-600">
                          Read →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore ? (
                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((count) => count + 6)}
                    className="rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-[#1f1f26] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    Load more articles
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      )}
    </section>
  );
}


