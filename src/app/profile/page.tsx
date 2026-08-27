"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

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

function truncate(text?: string | null, length = 110) {
  if (!text) {
    return "Discover this story on BlogVerse.";
  }

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
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    setLoading(true);
    setError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("PROFILE SESSION ERROR:", sessionError);
        setError(sessionError.message);
        setLoading(false);
        return;
      }

      const authUser = session?.user ?? null;

      console.log("PROFILE USER:", authUser?.id || "NO USER");

      if (!authUser) {
        setUser(null);
        setProfile(null);
        setPosts([]);
        setFollowers(0);
        setFollowing(0);
        setLoading(false);
        return;
      }

      setUser(authUser);

      // Profile is optional. A user can have 0 posts and still have a profile.
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("id, name, username, avatar_url")
        .eq("id", authUser.id)
        .maybeSingle();

      console.log("PROFILE DATA:", profileData);
      console.log("PROFILE ERROR:", profileError);

      if (profileError) {
        console.warn("Profile query failed:", profileError.message);
      }

      const currentProfile = profileData as Profile | null;

      setProfile(currentProfile);

      setName(
        currentProfile?.name ||
          authUser.user_metadata?.full_name ||
          authUser.user_metadata?.name ||
          ""
      );

      setUsername(currentProfile?.username || "");

      // Posts are optional. Empty posts must never hide the profile.
      const { data: postData, error: postsError } = await supabase
        .from("posts")
        .select("id, title, slug, excerpt, cover_image, created_at")
        .eq("guest_id", authUser.id)
        .order("created_at", { ascending: false });

      console.log("POSTS DATA:", postData);
      console.log("POSTS ERROR:", postsError);

      if (postsError) {
        console.warn("Posts query failed:", postsError.message);
        setPosts([]);
      } else {
        setPosts((postData ?? []) as Post[]);
      }

      // Followers are optional.
      const { count: followerCount, error: followerError } = await supabase
        .from("follows")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("following_id", authUser.id);

      console.log("FOLLOWERS:", followerCount);
      console.log("FOLLOWERS ERROR:", followerError);

      // Following is optional.
      const { count: followingCount, error: followingError } = await supabase
        .from("follows")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("guest_id", authUser.id);

      console.log("FOLLOWING:", followingCount);
      console.log("FOLLOWING ERROR:", followingError);

      setFollowers(followerCount ?? 0);
      setFollowing(followingCount ?? 0);

      setLoading(false);
    } catch (err: unknown) {
      console.error("PROFILE LOAD ERROR:", err);

      const message =
        err instanceof Error ? err.message : "Unable to load profile.";

      setError(message);
      setPosts([]);
      setFollowers(0);
      setFollowing(0);
      setLoading(false);
    }
  }

  async function saveProfile() {
    if (!user) return;

    setSaving(true);
    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanUsername = username
      .trim()
      .replace(/^@/, "")
      .toLowerCase();

    if (!cleanName) {
      setError("Name cannot be empty.");
      setSaving(false);
      return;
    }

    const { data, error: updateError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          name: cleanName,
          username: cleanUsername || null,
          avatar_url: profile?.avatar_url || null,
        },
        {
          onConflict: "id",
        }
      )
      .select("id, name, username, avatar_url")
      .single();

    if (updateError) {
      setError(updateError.message);
      setSaving(false);
      return;
    }

    setProfile(data as Profile);
    setName(data.name || "");
    setUsername(data.username || "");

    setMessage("Profile updated successfully.");
    setSaving(false);

    window.setTimeout(() => setMessage(""), 3000);
  }

  async function uploadAvatar(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !user) return;

    setUploading(true);
    setMessage("");
    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      setUploading(false);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      setUploading(false);
      return;
    }

    const extension = file.name.split(".").pop() || "jpg";

    const filePath = `${user.id}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const { data, error: updateError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          name: profile?.name || name.trim() || null,
          username:
            profile?.username ||
            username.trim().replace(/^@/, "") ||
            null,
          avatar_url: publicUrl,
        },
        {
          onConflict: "id",
        }
      )
      .select("id, name, username, avatar_url")
      .single();

    if (updateError) {
      setError(updateError.message);
      setUploading(false);
      return;
    }

    setProfile(data as Profile);
    setMessage("Profile photo updated.");
    setUploading(false);

    event.target.value = "";

    window.setTimeout(() => setMessage(""), 3000);
  }

  const displayName =
    profile?.name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

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
      <main className="min-h-screen bg-[#07070a] px-4 py-10 text-white sm:px-8">
        <div className="mx-auto max-w-5xl animate-pulse">
          <div className="h-40 rounded-[30px] bg-white/[0.04]" />

          <div className="mt-8 flex gap-6">
            <div className="h-28 w-28 rounded-full bg-white/[0.05]" />

            <div className="flex-1">
              <div className="h-8 w-52 rounded-lg bg-white/[0.05]" />
              <div className="mt-4 h-5 w-32 rounded bg-white/[0.04]" />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-2">
            <div className="aspect-square rounded-2xl bg-white/[0.04]" />
            <div className="aspect-square rounded-2xl bg-white/[0.04]" />
            <div className="aspect-square rounded-2xl bg-white/[0.04]" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-5 text-white">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/[0.035] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black text-black">
            BV
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight">
            Sign in to view your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            Create your profile, publish articles and connect
            with readers.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
          >
            Sign in →
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070a] px-4 pb-20 pt-8 text-white sm:px-8 sm:pt-12">
      <div className="mx-auto max-w-5xl">

        {/* PROFILE HEADER */}

        <section className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-white/[0.025] shadow-2xl shadow-black/30 backdrop-blur-xl">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-40 h-96 w-96 rounded-full bg-violet-600/[0.12] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-500/[0.07] blur-[110px]"
          />

          <div className="relative px-6 py-8 sm:px-10 sm:py-10">

            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">

              {/* AVATAR */}

              <div className="relative mx-auto shrink-0 sm:mx-0">

                <div className="h-32 w-32 overflow-hidden rounded-full border border-white/15 bg-gradient-to-br from-violet-500/20 via-white/[0.04] to-blue-500/10 p-1 shadow-2xl sm:h-36 sm:w-36">

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

                <label className="absolute bottom-1 right-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black bg-white text-black shadow-xl transition hover:scale-105">
                  <span className="text-lg font-black">
                    +
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={uploadAvatar}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>

              {/* PROFILE INFO */}

              <div className="min-w-0 flex-1 text-center sm:text-left">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <h1 className="text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                      {displayName}
                    </h1>

                    <p className="mt-1 text-sm text-white/35">
                      {profile?.username
                        ? `@${profile.username}`
                        : user.email}
                    </p>
                  </div>

                  <div className="flex justify-center gap-2 sm:justify-end">

                    <a
                      href="#edit-profile"
                      className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                    >
                      Edit profile
                    </a>

                    <Link
                      href={`/author/${user.id}`}
                      className="rounded-xl bg-white px-4 py-2.5 text-xs font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
                    >
                      View profile
                    </Link>

                  </div>

                </div>

                {/* STATS */}

                <div className="mt-7 flex justify-center gap-8 sm:justify-start sm:gap-10">

                  <div>
                    <p className="text-lg font-black">
                      {posts.length}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Posts
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-black">
                      {followers}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Followers
                    </p>
                  </div>

                  <div>
                    <p className="text-lg font-black">
                      {following}
                    </p>

                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                      Following
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ARTICLES */}

        <section className="mt-10">

          <div className="mb-5 flex items-end justify-between border-b border-white/[0.08] pb-4">

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-violet-400">
                Your content
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight">
                Articles
              </h2>
            </div>

            <Link
              href="/create"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-bold text-white/65 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              + Write
            </Link>

          </div>

          {posts.length === 0 ? (
            <div className="rounded-[30px] border border-white/[0.08] bg-white/[0.025] px-6 py-16 text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
                ✦
              </div>

              <h3 className="mt-5 text-xl font-black">
                No articles yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                Your published stories will appear here like
                a personal creator feed.
              </p>

              <Link
                href="/create"
                className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90"
              >
                Create your first article →
              </Link>

            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">

              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.06] bg-[#111116] sm:rounded-2xl"
                >

                  {post.cover_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-violet-500/[0.12] via-white/[0.03] to-blue-500/[0.08]">
                      <span className="text-5xl font-black text-white/[0.12]">
                        BV
                      </span>
                    </div>
                  )}

                  {/* HOVER */}

                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 opacity-0 transition duration-300 group-hover:opacity-100">

                    <div className="translate-y-2 transition duration-300 group-hover:translate-y-0">

                      <h3 className="line-clamp-2 text-sm font-black leading-tight text-white sm:text-base">
                        {post.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-white/60">
                        {truncate(post.excerpt)}
                      </p>

                      <div className="mt-3 flex items-center justify-between text-[10px] font-bold text-white/45">
                        <span>
                          {formatDate(post.created_at)}
                        </span>

                        <span className="text-white">
                          Read →
                        </span>
                      </div>

                    </div>
                  </div>

                </Link>
              ))}

            </div>
          )}

        </section>

        {/* EDIT PROFILE */}

        <section
          id="edit-profile"
          className="mt-12 rounded-[30px] border border-white/[0.08] bg-white/[0.025] p-6 shadow-2xl shadow-black/20 sm:p-8"
        >

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">
              Account
            </p>

            <h2 className="mt-2 text-2xl font-black">
              Edit profile
            </h2>

            <p className="mt-2 text-sm text-white/35">
              Update the information people see on your
              BlogVerse profile.
            </p>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-xs font-bold text-white/40">
                Display name
              </label>

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Your name"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-violet-400/40"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-white/40">
                Username
              </label>

              <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 focus-within:border-violet-400/40">

                <span className="pl-4 text-sm text-white/25">
                  @
                </span>

                <input
                  value={username}
                  onChange={(event) =>
                    setUsername(event.target.value)
                  }
                  placeholder="username"
                  className="w-full bg-transparent px-2 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                />

              </div>
            </div>

          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white/30">
            {user.email || "No email"}
          </div>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          ) : null}

          {message ? (
            <div className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-300">
              {message}
            </div>
          ) : null}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={saveProfile}
              disabled={saving}
              className="rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>

            <Link
              href={`/author/${user.id}`}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-3.5 text-center text-sm font-bold text-white/65 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
            >
              Open public profile
            </Link>

          </div>

        </section>

      </div>
    </main>
  );
}
