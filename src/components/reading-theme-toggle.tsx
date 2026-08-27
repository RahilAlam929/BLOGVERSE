"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "blogverse-reading-theme";

export function ReadingThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme, mounted]);

  if (!mounted) {
    return (
      <button
        type="button"
        className="h-10 w-10 rounded-full border border-slate-200 bg-white"
        aria-label="Reading theme"
      />
    );
  }

  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label="Toggle reading theme"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-200"
    >
      {dark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}

      <span className="hidden sm:inline">
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
