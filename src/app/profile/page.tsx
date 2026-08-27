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

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      setLoading(false);
      return;
    }

    setUser(authUser);

    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("id, name, username, avatar_url")
      .eq("id", authUser.id)
      .maybeSingle();

    if (profileError) {
      setError(profileError.message);
      setLoading(false);
      return;
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

    const { data: postData } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image, created_at")
      .eq("guest_id", authUser.id)
      .order("created_at", { ascending: false });

    setPosts((postData ?? []) as Post[]);

    const { count: followerCount } = await supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("following_id", authUser.id);

    const { count: followingCount } = await supabase
      .from("follows")
      .select("id", { count: "exact", head: true })
      .eq("guest_id", authUser.id);

    setFollowers(followerCount ?? 0);
    setFollowing(followingCount ?? 0);

    setLoading(false);
  }

  async function saveProfile() {
    if (!user) return;

    setSaving(true);
    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanUsername = username.trim().replace(/^@/, "").toLowerCase();

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
        { onConflict: "id" }
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
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    const { data, error: updateError } = await supabase
      .from("profiles")
      .upsert(
        {
          id: user.id,
          name: profile?.name || name.trim() || null,
          username: profile?.username || username.trim() || null,
          avatar_url: publicUrl,
        },
        { onConflict: "id" }
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

  const publicProfileId = user?.id;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-16 text-white sm:px-8 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="h-72 animate-pulse rounded-[32px] border border-white/[0.08] bg-white/[0.03]" />
          <div className="mt-8 h-10 w-56 animate-pulse rounded-xl bg-white/[0.05]" />
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            <div className="h-64 animate-pulse rounded-[26px] bg-white/[0.03]" />
            <div className="h-64 animate-pulse rounded-[26px] bg-white/[0.03]" />
            <div className="h-64 animate-pulse rounded-[26px] bg-white/[0.03]" />
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#050505] px-5 text-white">
        <div className="w-full max-w-md rounded-[30px] border border-white/10 bg-white/[0.035] p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-black text-black">
            BV
          </div>

          <h1 className="mt-6 text-3xl font-black tracking-tight">
            Sign in to view your profile
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/40">
            Create your profile, publish articles and connect with readers.
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
    <main className="min-h-screen bg-[#050505] px-5 py-10 text-white sm:px-8 lg:px-10 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#0a0a0a]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-violet-600/10 blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-blue-600/10 blur-[120px]"
          />

          <div className="relative p-7 sm:p-10 lg:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="relative">
                  <div className="h-28 w-28 overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.06] shadow-2xl sm:h-32 sm:w-32">
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

                  <label className="absolute -bottom-2 -right-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white text-black shadow-xl transition hover:scale-105">
                    <span className="text-sm">+</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={uploadAvatar}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30">
                    Your profile
                  </p>

                  <h1 className="mt-2 text-4xl font-black tracking-[-0.05em] sm:text-5xl">
                    {displayName}
                  </h1>

                  <p className="mt-2 text-sm text-white/35">
                    {profile?.username
                      ? `@${profile.username}`
                      : user.email}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-7">
                    <div>
                      <p className="text-xl font-black">{posts.length}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Posts
                      </p>
                    </div>

                    <div>
                      <p className="text-xl font-black">{followers}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Followers
                      </p>
                    </div>

                    <div>
                      <p className="text-xl font-black">{following}</p>
                      <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/25">
                        Following
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {publicProfileId ? (
                <Link
                  href={`/author/${publicProfileId}`}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-white/70 transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                >
                  View public profile →
                </Link>
              ) : null}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">
                  Account
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Profile details
                </h2>
              </div>
            </div>

            <div className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-xs font-bold text-white/40">
                  Display name
                </label>

                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-white/40">
                  Username
                </label>

                <div className="flex items-center rounded-2xl border border-white/10 bg-black/30 focus-within:border-white/25">
                  <span className="pl-4 text-sm text-white/25">@</span>

                  <input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="username"
                    className="w-full bg-transparent px-2 py-3.5 text-sm text-white outline-none placeholder:text-white/20"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold text-white/40">
                  Email
                </label>

                <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3.5 text-sm text-white/35">
                  {user.email || "No email"}
                </div>
              </div>

              {error ? (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              ) : null}

              {message ? (
                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm text-emerald-300">
                  {message}
                </div>
              ) : null}

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving}
                className="w-full rounded-2xl bg-white px-5 py-3.5 text-sm font-black text-black transition hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/25">
                  Published work
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Your articles
                </h2>
              </div>

              <Link
                href="/create"
                className="rounded-xl bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white/60 transition hover:bg-white/[0.1] hover:text-white"
              >
                + Write
              </Link>
            </div>

            {posts.length === 0 ? (
              <div className="rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.06] text-xl">
                  ✦
                </div>

                <h3 className="mt-5 text-xl font-black">
                  No articles yet
                </h3>

                <p className="mt-2 text-sm text-white/30">
                  Share your first idea with the BlogVerse community.
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
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group flex gap-4 overflow-hidden rounded-[24px] border border-white/[0.08] bg-white/[0.025] p-4 transition hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.045]"
                  >
                    <div className="h-24 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#111] sm:h-28 sm:w-40">
                      {post.cover_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={post.cover_image}
                          alt={post.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white/[0.04]">
                          BV
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 py-1">
                      <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/25">
                        {post.created_at
                          ? new Intl.DateTimeFormat("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }).format(new Date(post.created_at))
                          : "Recently"}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-lg font-black leading-tight tracking-[-0.02em]">
                        {post.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/30">
                        {post.excerpt || "Read this article on BlogVerse."}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
