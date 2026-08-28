"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  avatar_url: string | null;
};

export default function EditProfilePage() {
  const [supabase, setSupabase] = useState<ReturnType<typeof createClient> | null>(null);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const client = createClient();

        if (!mounted) return;
        setSupabase(client);

        const {
          data: { session },
        } = await client.auth.getSession();

        const authUser = session?.user ?? null;

        if (!mounted) return;

        if (!authUser) {
          setLoading(false);
          return;
        }

        setUser(authUser);

        const { data, error: profileError } = await client
          .from("profiles")
          .select("id, name, username, avatar_url")
          .eq("id", authUser.id)
          .maybeSingle();

        if (!mounted) return;

        if (profileError) {
          setError(profileError.message);
        }

        const current = data as Profile | null;

        setProfile(current);

        setName(
          current?.name ||
            authUser.user_metadata?.full_name ||
            authUser.user_metadata?.name ||
            ""
        );

        setUsername(current?.username || "");
        setLoading(false);
      } catch (err) {
        if (!mounted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your profile."
        );

        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  async function saveProfile() {
    if (!user || !supabase) return;

    setSaving(true);
    setError("");
    setMessage("");

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
  }

  async function uploadAvatar(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!supabase) return;

    const file = event.target.files?.[0];

    if (!file || !user) return;

    setUploading(true);
    setError("");
    setMessage("");

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

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath =
      `${user.id}/avatar-${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type,
      });

    if (uploadError) {
      setError(
        uploadError.message.includes("Bucket not found")
          ? 'Supabase Storage me "avatars" bucket create nahi hua hai.'
          : uploadError.message
      );

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

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part: string) => part[0])
    .join("")
    .toUpperCase();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07070a] px-5 pb-20 pt-24 text-white">
        <div className="mx-auto max-w-2xl animate-pulse">
          <div className="h-8 w-40 rounded bg-white/5" />
          <div className="mt-8 h-[500px] rounded-[30px] bg-white/[0.04]" />
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07070a] px-5 text-white">
        <Link
          href="/login"
          className="rounded-2xl bg-white px-6 py-3 font-black text-black"
        >
          Sign in →
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07070a] px-5 pb-20 pt-24 text-white sm:px-8">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/profile"
          className="inline-flex items-center gap-2 text-sm font-bold text-white/50 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        <div className="mt-6 overflow-hidden rounded-[30px] border border-white/[0.08] bg-white/[0.025]">
          <div className="border-b border-white/[0.07] px-6 py-6 sm:px-8">
            <h1 className="text-2xl font-black">
              Edit Profile
            </h1>

            <p className="mt-1 text-sm text-white/35">
              Update your profile information.
            </p>
          </div>

          <div className="space-y-7 p-6 sm:p-8">
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                {message}
              </div>
            )}

            <div>
              <label className="text-sm font-bold text-white/70">
                Profile photo
              </label>

              <div className="mt-4 flex items-center gap-5">
                <div className="h-24 w-24 overflow-hidden rounded-full border border-white/10 bg-[#111116]">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatar}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-black">
                      {initials || "U"}
                    </div>
                  )}
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-bold transition hover:bg-white/10">
                  <Camera className="h-4 w-4" />

                  {uploading
                    ? "Uploading..."
                    : "Change photo"}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={uploadAvatar}
                  />
                </label>
              </div>

              <p className="mt-2 text-xs text-white/25">
                JPG, PNG or WEBP. Maximum 5MB.
              </p>
            </div>

            <div>
              <label
                htmlFor="name"
                className="text-sm font-bold text-white/70"
              >
                Name
              </label>

              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="text-sm font-bold text-white/70"
              >
                Username
              </label>

              <input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
              />

              <p className="mt-2 text-xs text-white/25">
                Your public username on BlogVerse.
              </p>
            </div>

            <div>
              <label className="text-sm font-bold text-white/70">
                Email
              </label>

              <div className="mt-2 rounded-2xl border border-white/[0.06] bg-white/[0.025] px-4 py-3.5 text-sm text-white/35">
                {user.email}
              </div>

              <p className="mt-2 text-xs text-white/20">
                Email cannot be changed here.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-6 py-3.5 text-sm font-bold text-white/60 transition hover:bg-white/[0.05] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="button"
                onClick={saveProfile}
                disabled={saving || !supabase}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3.5 text-sm font-black text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="h-4 w-4" />

                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
