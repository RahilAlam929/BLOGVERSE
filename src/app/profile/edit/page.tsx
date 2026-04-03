"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [profileId, setProfileId] = useState<string>("");
  const [username, setUsername] = useState("");

  const [form, setForm] = useState({
    name: "",
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

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profile) {
        setProfileId(profile.id);
        setUsername(profile.username || "");
        setForm({
          name: profile.name || "",
          bio: profile.bio || "",
          avatar_url: profile.avatar_url || "",
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

      const { error } = await supabase
        .from("profiles")
        .update({
          name: form.name,
          bio: form.bio,
          avatar_url: avatarUrl,
        })
        .eq("id", profileId);

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Profile updated");
      router.push(`/author/${username}`);
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to update profile");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26] dark:bg-[#09090f] dark:text-white">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111118] sm:p-8">
        <h1 className="text-3xl font-black">Edit profile</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="flex items-center gap-4">
            {form.avatar_url ? (
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
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <textarea
            rows={4}
            placeholder="Your bio"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
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