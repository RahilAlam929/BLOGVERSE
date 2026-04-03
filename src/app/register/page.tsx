"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    name: "",
    username: "",
    bio: "",
    email: "",
    password: "",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      let avatarUrl = "";

      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            username: form.username,
            name: form.name,
          },
        },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (!data.user) {
        alert("Signup failed");
        setLoading(false);
        return;
      }

      if (avatarFile) {
        avatarUrl = await uploadAvatar(avatarFile);
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: data.user.id,
          name: form.name,
          username: form.username,
          bio: form.bio,
          avatar_url: avatarUrl,
        });

      if (profileError) {
        alert(profileError.message);
        setLoading(false);
        return;
      }

      alert("Account created successfully");
      setLoading(false);
      router.push("/login");
      router.refresh();
    } catch (err: any) {
      alert(err.message || "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26] dark:bg-[#09090f] dark:text-white">
      <div className="mx-auto max-w-md rounded-[28px] border border-black/10 bg-white p-6 dark:border-white/10 dark:bg-[#111118] sm:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-300">
            BuildVerse
          </p>
          <h1 className="mt-2 text-3xl font-black">Create account</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create your creator profile and start publishing.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Full name"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />

          <textarea
            rows={3}
            placeholder="Short bio"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />

          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none dark:border-white/10 dark:bg-white/5"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="rounded-2xl border border-black/10 bg-slate-50 p-4 dark:border-white/10 dark:bg-[#0f0f15]">
            <p className="mb-3 text-sm font-semibold">Profile picture</p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6d5efc] px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}