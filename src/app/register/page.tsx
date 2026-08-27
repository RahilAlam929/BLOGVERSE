"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    const cleanName = name.trim();
    const cleanUsername = username
      .trim()
      .replace(/^@/, "")
      .toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setError("Please enter your name.");
      setLoading(false);
      return;
    }

    if (!cleanEmail) {
      setError("Please enter your email.");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { data, error: signupError } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
          name: cleanName,
          username: cleanUsername || null,
        },
      },
    });

    if (signupError) {
      setError(signupError.message);
      setLoading(false);
      return;
    }

    if (data.user && data.session) {
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(
          {
            id: data.user.id,
            name: cleanName,
            username: cleanUsername || null,
            avatar_url: null,
          },
          { onConflict: "id" }
        );

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }

      router.replace("/");
      router.refresh();
      return;
    }

    setMessage(
      "Account created! Please check your email to confirm your account."
    );

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-12 text-slate-950 sm:px-8">
      <div className="mx-auto flex min-h-[80vh] max-w-md items-center justify-center">
        <div className="w-full rounded-[32px] border border-slate-200 bg-white p-7 shadow-[0_25px_80px_rgba(15,23,42,0.08)] sm:p-9">

          <Link
            href="/"
            className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-xl font-black text-white shadow-lg"
          >
            B
          </Link>

          <div className="mt-7 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-500">
              Join BlogVerse
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-[-0.05em]">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Create your profile and start sharing your ideas.
            </p>
          </div>

          <form onSubmit={handleRegister} className="mt-8 space-y-4">

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Full name
              </label>

              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="MD Rahil"
                autoComplete="name"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Username
              </label>

              <div className="flex items-center rounded-2xl border border-slate-200 bg-slate-50 focus-within:border-violet-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10">
                <span className="pl-4 text-sm font-bold text-slate-400">
                  @
                </span>

                <input
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="rahil"
                  autoComplete="username"
                  className="w-full bg-transparent px-2 py-3.5 text-sm outline-none placeholder:text-slate-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Password
              </label>

              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-slate-600">
                Confirm password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-600">
                {error}
              </div>
            ) : null}

            {message ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-600">
                {message}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create account →"}
            </button>
          </form>

          <p className="mt-7 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-black text-violet-600 hover:text-violet-700"
            >
              Sign in
            </Link>
          </p>

          <Link
            href="/"
            className="mt-5 block text-center text-xs font-bold text-slate-400 transition hover:text-slate-700"
          >
            ← Back to BlogVerse
          </Link>
        </div>
      </div>
    </main>
  );
}
