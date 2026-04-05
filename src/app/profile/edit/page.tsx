"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [profileId, setProfileId] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    avatar_url: "",
  });

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setProfileId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      const authName = (user.user_metadata?.name as string | undefined) || "";
      const authUsername =
        (user.user_metadata?.username as string | undefined) || "";

      if (profile) {
        setForm({
          name: profile.name || authName,
          username: profile.username || authUsername,
          bio: profile.bio || "",
          avatar_url: profile.avatar_url || "",
        });
      } else {
        setForm({
          name: authName,
          username: authUsername,
          bio: "",
          avatar_url: "",
        });
      }
    }

    loadProfile();
  }, [router, supabase]);

  async function uploadAvatar(file: File) {
    const ext = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filePath = `avatars/${fileName}`;

    const { error } = await supabase.storage
      .from("profile-images")
      .upload(filePath, file, { upsert: false });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !profileId) return;

    setLoading(true);

    try {
      let avatarUrl = form.avatar_url;

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const { error } = await supabase.from("profiles").upsert({
        id: profileId,
        name: form.name.trim(),
        username: form.username.trim(),
        bio: form.bio.trim(),
        avatar_url: avatarUrl,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Profile saved successfully");
      setLoading(false);
      router.push(`/author/${form.username.trim()}`);
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to save profile";
      alert(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26]">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
        <h1 className="text-3xl font-black">Complete your profile</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            {form.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.avatar_url}
                alt="Profile"
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-slate-300" />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <input
            type="text"
            placeholder="Your name"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <textarea
            rows={4}
            placeholder="Your bio"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#6d5efc] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save profile"}
          </button>
        </form>
      </div>
    </main>
  );
}