"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white">
      <div className="mx-auto max-w-md rounded-[28px] border border-white/10 bg-[#111118] p-6">
        <h1 className="text-3xl font-black">Login</h1>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full rounded-full bg-white px-4 py-3 font-semibold text-black">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}