"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email.trim(),
        password: form.password,
      });

      if (error) {
        const msg = error.message.toLowerCase();

        if (msg.includes("email not confirmed")) {
          alert(
            "Email confirmation is enabled in Supabase. Turn it off for testing, or verify your email first."
          );
        } else if (msg.includes("invalid login credentials")) {
          alert("Invalid email or password.");
        } else {
          alert(error.message);
        }

        setLoading(false);
        return;
      }

      const user = data.user;

      if (!user) {
        alert("Login failed");
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id, username, name")
        .eq("id", user.id)
        .maybeSingle();

      setLoading(false);

      if (!profile || !profile.username || !profile.name) {
        router.push("/profile/edit");
        router.refresh();
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26]">
      <div className="mx-auto max-w-md rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-500">
            BuildVerse
          </p>
          <h1 className="mt-2 text-3xl font-black">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">
            Login to continue.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#6d5efc] px-4 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-violet-600">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}