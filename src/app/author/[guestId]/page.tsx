import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "@/components/follow-button";

type GuestPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image?: string | null;
  created_at?: string | null;
  topic?: string | null;
  language?: string | null;
  guest_id?: string | null;
  guest_name?: string | null;
};

type Profile = {
  name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
};

export default async function GuestAuthorPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await params;
  const supabase = await createClient();

  const { data: postsData } = await supabase
    .from("posts")
    .select(
      "id,title,slug,excerpt,cover_image,created_at,topic,language,guest_id,guest_name"
    )
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  const posts = (postsData ?? []) as GuestPost[];

  if (!posts.length) return notFound();

  const { data: profileData } = await supabase
    .from("profiles")
    .select("name, username, avatar_url")
    .eq("id", guestId)
    .maybeSingle();

  const profile = profileData as Profile | null;

  const authorName =
    profile?.name ||
    profile?.username ||
    posts[0]?.guest_name ||
    "Anonymous";

  const username = profile?.username
    ? `@${profile.username}`
    : "@writer";

  const avatar = profile?.avatar_url;

  const initials = authorName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const { data: followersData } = await supabase
    .from("follows")
    .select("id, guest_id")
    .eq("following_id", guestId);

  const followersCount = followersData?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-[#0a0a0a] p-7 sm:p-10 lg:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-blue-600/10 blur-[100px]"
          />

          <div className="relative flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="h-28 w-28 shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] shadow-2xl">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatar}
                    alt={authorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-black">
                    {initials || "U"}
                  </div>
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                    {authorName}
                  </h1>

                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-semibold text-white/40">
                    {username}
                  </span>
                </div>

                <p className="mt-3 max-w-xl text-sm leading-6 text-white/40">
                  Writer and creator sharing ideas, experiences and useful
                  knowledge with the BlogVerse community.
                </p>

                <div className="mt-6 flex flex-wrap gap-7">
                  <div>
                    <p className="text-xl font-black">{posts.length}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                      Posts
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-black">{followersCount}</p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                      Followers
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <FollowButton
              authorGuestId={guestId}
              initialFollowing={false}
              initialFollowersCount={followersCount}
            />
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                Published work
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                Posts by {authorName}
              </h2>
            </div>

            <Link
              href="/blogs"
              className="hidden text-sm font-bold text-white/40 transition hover:text-white sm:block"
            >
              Explore →
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.025] transition duration-300 hover:-translate-y-1 hover:border-white/[0.16] hover:bg-white/[0.045]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-7xl font-black tracking-[-0.08em] text-white/[0.04]">
                        BV
                      </span>
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    {post.topic ? (
                      <span className="rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-white/70 backdrop-blur">
                        {post.topic}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/25">
                    <span>{formatDate(post.created_at)}</span>

                    {post.language ? (
                      <>
                        <span>•</span>
                        <span>{post.language}</span>
                      </>
                    ) : null}
                  </div>

                  <h3 className="mt-4 line-clamp-2 text-xl font-black leading-tight tracking-[-0.025em]">
                    {post.title}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/35">
                    {post.excerpt || "Read this idea on BlogVerse."}
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-4">
                    <span className="text-xs font-semibold text-white/35">
                      Read article
                    </span>

                    <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
