import Link from "next/link";

type Article = {
  id: string | number;
  title: string;
  description?: string | null;
  image?: string | null;
  author?: string | null;
  category?: string | null;
};

type ModernHomeProps = {
  articles?: Article[];
};

export default function ModernHome({
  articles = [],
}: ModernHomeProps) {
  const featured = articles[0];

  const recent = articles.slice(1, 7);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* HERO */}
      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-4xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              The modern publishing space
            </div>

            <h1 className="text-5xl font-black leading-[0.95] tracking-[-0.04em] text-white sm:text-6xl lg:text-8xl">
              Ideas worth
              <span className="block text-slate-400">
                reading.
              </span>
            </h1>

            <p className="mt-8 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
              Discover thoughtful stories, practical ideas and perspectives
              from writers building the future.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/blogs"
                className="rounded-2xl bg-white px-6 py-3.5 text-center text-sm font-black text-slate-950 transition hover:-translate-y-0.5 hover:bg-slate-100"
              >
                Explore stories
              </Link>

              <Link
                href="/create"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-center text-sm font-black text-white backdrop-blur transition hover:bg-white/10"
              >
                Start writing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
        <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                Featured
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">
                Editor's pick
              </h2>
            </div>
          </div>

          <Link
            href={`/blog/${featured.id}`}
            className="group grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-2xl lg:grid-cols-2"
          >
            <div className="relative min-h-[300px] overflow-hidden bg-slate-200 lg:min-h-[440px]">
              {featured.image ? (
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 text-7xl font-black text-white/20">
                  B
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {featured.category || "Featured story"}
              </span>

              <h3 className="mt-6 text-3xl font-black leading-tight tracking-tight sm:text-4xl">
                {featured.title}
              </h3>

              {featured.description && (
                <p className="mt-5 line-clamp-3 text-base leading-7 text-slate-500">
                  {featured.description}
                </p>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
                <span className="text-sm font-bold text-slate-600">
                  {featured.author || "BlogVerse author"}
                </span>

                <span className="text-sm font-black">
                  Read article →
                </span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* RECENT */}
      <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
              Latest
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-tight">
              Recent stories
            </h2>
          </div>

          <Link
            href="/blogs"
            className="hidden text-sm font-bold text-slate-500 hover:text-slate-950 sm:block"
          >
            View all →
          </Link>
        </div>

        {recent.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.id}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                  {article.image ? (
                    <img
                      src={article.image}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-slate-900 text-5xl font-black text-white/20">
                      B
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                    {article.category || "Article"}
                  </span>

                  <h3 className="mt-3 line-clamp-2 text-xl font-black leading-tight">
                    {article.title}
                  </h3>

                  {article.description && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">
                      {article.description}
                    </p>
                  )}

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <span className="text-xs font-bold text-slate-500">
                      {article.author || "Author"}
                    </span>

                    <span className="text-sm font-black">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">
            <h3 className="text-2xl font-black">
              Your next story starts here.
            </h3>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Sign in and publish your first article on BlogVerse.
            </p>

            <Link
              href="/create"
              className="mt-7 inline-flex rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white"
            >
              Write an article
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
