"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "blogverse-reading-theme";

export function ReadingThemeToggle() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const isDark = saved === "dark";

    setDark(isDark);
    setMounted(true);

    if (isDark) {
      document.documentElement.classList.add("blogverse-reading-dark");
    } else {
      document.documentElement.classList.remove("blogverse-reading-dark");
    }
  }, []);

  function toggleTheme() {
    const nextDark = !dark;

    setDark(nextDark);

    if (nextDark) {
      document.documentElement.classList.add("blogverse-reading-dark");
      window.localStorage.setItem(STORAGE_KEY, "dark");
    } else {
      document.documentElement.classList.remove("blogverse-reading-dark");
      window.localStorage.setItem(STORAGE_KEY, "light");
    }
  }

  if (!mounted) {
    return (
      <button
        type="button"
        className="rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm font-bold text-zinc-900"
      >
        🌙 Dark
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={dark ? "Switch to light reading mode" : "Switch to dark reading mode"}
      className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold shadow-sm transition hover:-translate-y-0.5"
      style={{
        backgroundColor: dark ? "#18181b" : "#ffffff",
        color: dark ? "#f4f4f5" : "#18181b",
        borderColor: dark
          ? "rgba(255,255,255,.14)"
          : "rgba(0,0,0,.12)",
      }}
    >
      <span>{dark ? "☀️" : "🌙"}</span>
      <span>{dark ? "Light" : "Dark"}</span>
    </button>
  );
}
