"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { DeletePostButton } from "@/components/delete-post-button";

type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
};

type Post = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  created_at: string | null;
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

function truncate(text?: string | null, length = 100) {
  if (!text) return "Discover this story on BlogVerse.";

  const clean = text.replace(/\s+/g, " ").trim();

  return clean.length > length
    ? `${clean.slice(0, length)}...`
    : clean;
}

export default function ProfilePage() {
  const supabase = createClient();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProfile() {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      const authUser = session?.user ?? null;

      if (!mounted) return;

      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(authUser);

      const { data: profileData, error: profileError } =
        await supabase
          .from("profiles")
          .select("id, name, username, avatar_url")
          .eq("id", authUser.id)
          .maybeSingle();

      if (!mounted) return;

      if (profileError) {
        setError(profileError.message);
      }

      setProfile((profileData ?? null) as Profile | null);

      const { data: postData, error: postsError } =
        await supabase
          .from("posts")
          .select(
            "id, title, slug, excerpt, cover_image, created_at"
          )
          .eq("guest_id", authUser.id)
          .order("created_at", { ascending: false });

      if (!mounted) return;

      if (postsError) {
        setError(postsError.message);
      }

      setPosts((postData ?? []) as Post[]);

      const { count: followerCount } = await supabase
        .from("follows")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("following_id", authUser.id);

      const { count: followingCount } = await supabase
        .from("follows")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("guest_id", authUser.id);

      if (!mounted) return;

      setFollowers(followerCount ?? 0);
      setFollowing(followingCount ?? 0);
      setLoading(false);
    }

    loadProfile();

    return () => {
      mounted = false;
    };
  }, [supabase]);

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  const username = profile?.username
    ? `@${profile.username}`
    : "";

  const avatar =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null;

  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase();
  }, [displayName]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07070a] px-4 pb-20 pt-24 text-white sm:px-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-[300px] rounded-[32px] bg-white/[0.04]" />

          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="h-24 rounded-2xl bg-white/[0.04]" />
            <div className="h-24 rounded-2xl bg-white/[0.04]" />
            <div className="h-24 rounded-2xl bg-white/[0.04]" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-5 text-white">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/[0.035] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black text-black">
            BV
          </div>

          <h1 className="mt-6 text-3xl font-black">
            Sign in to view your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            Create your profile, publish articles and connect with
            readers.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black"
          >
            Sign in →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070a] px-4 pb-20 pt-24 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SINGLE PROFILE CARD */}

        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] shadow-2xl">

          <div className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full bg-violet-600/10 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.07] blur-[110px]" />

          <div className="relative p-6 sm:p-10">

            <div className="flex flex-col gap-7 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div className="mx-auto shrink-0 sm:mx-0">
                <div className="h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] p-1 sm:h-36 sm:w-36">
                  <div className="h-full w-full overflow-hidden rounded-full bg-[#111116]">
                    {avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={avatar}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-3xl font-black">
                        {initials || "U"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* USER INFO */}

              <div className="min-w-0 flex-1 text-center sm:text-left">

                <h1 className="truncate text-3xl font-black tracking-tight sm:text-4xl">
                  {displayName}
                </h1>

                {username && (
                  <p className="mt-1 text-sm font-medium text-white/40">
                    {username}
                  </p>
                )}

                <p className="mt-3 truncate text-sm text-white/35">
                  {user.email}
                </p>

                {/* STATS */}

                <div className="mt-6 flex justify-center gap-8 sm:justify-start">

                  <div>
                    <div className="text-xl font-black">
                      {posts.length}
                    </div>
                    <div className="text-xs text-white/35">
                      Posts
                    </div>
                  </div>

                  <div>
                    <div className="text-xl font-black">
                      {followers}
                    </div>
                    <div className="text-xs text-white/35">
                      Followers
                    </div>
                  </div>

                  <div>
                    <div className="text-xl font-black">
                      {following}
                    </div>
                    <div className="text-xs text-white/35">
                      Following
                    </div>
                  </div>

                </div>

              </div>

              {/* EDIT PROFILE */}

              <Link
                href="/profile/edit"
                className="inline-flex shrink-0 items-center justify-center rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Edit Profile
              </Link>

            </div>

          </div>
        </section>

        {/* POSTS */}

        <section className="mt-10">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Your Posts
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Manage everything you have published.
              </p>
            </div>

            <Link
              href="/create"
              className="rounded-xl bg-white px-4 py-2.5 text-sm font-black text-black"
            >
              + Create
            </Link>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.06] text-2xl">
                ✍️
              </div>

              <h3 className="mt-5 text-xl font-black">
                No posts yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                Start writing your first article and share it with
                the BlogVerse community.
              </p>

              <Link
                href="/create"
                className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-black"
              >
                Create your first article →
              </Link>

            </div>
          ) : (
            <div className="space-y-4">

              {posts.map((post) => (
                <article
                  key={post.id}
                  className="group overflow-hidden rounded-[26px] border border-white/[0.08] bg-white/[0.025] transition hover:border-white/[0.14]"
                >

                  <div className="flex flex-col sm:flex-row">

                    {/* IMAGE */}

                    <Link
                      href={`/blog/${post.slug}`}
                      className="h-52 shrink-0 overflow-hidden bg-[#111116] sm:h-auto sm:w-64"
                    >
                      {post.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full min-h-52 items-center justify-center bg-gradient-to-br from-violet-500/10 via-white/[0.03] to-blue-500/10">
                          <span className="text-5xl font-black text-white/10">
                            BV
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* CONTENT */}

                    <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">

                      <Link href={`/blog/${post.slug}`}>
                        <h3 className="text-xl font-black leading-tight transition group-hover:text-violet-300">
                          {post.title}
                        </h3>
                      </Link>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/40">
                        {truncate(post.excerpt)}
                      </p>

                      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">

                        <span className="text-xs font-medium text-white/30">
                          {formatDate(post.created_at)}
                        </span>

                        <div className="flex items-center gap-2">

                          <Link
                            href={`/blog/${post.slug}`}
                            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/5"
                          >
                            View
                          </Link>

                          <Link
                            href={`/edit/${post.id}`}
                            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-white/70 transition hover:bg-white/5"
                          >
                            Edit
                          </Link>

                          <DeletePostButton
                            postId={post.id}
                            authorGuestId={user.id}
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}
