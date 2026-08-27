"use client";

import { useEffect, useState } from "react";

export function ReadingThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("blogverse-reading-theme");
    const isDark = saved === "dark";

    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  function toggleTheme() {
    const next = !dark;

    setDark(next);
    localStorage.setItem(
      "blogverse-reading-theme",
      next ? "dark" : "light",
    );

    document.documentElement.classList.toggle("dark", next);
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle reading theme"
      className="
        inline-flex items-center gap-2
        rounded-full
        border border-slate-200
        bg-white
        px-4 py-2.5
        text-sm font-bold text-slate-700
        shadow-sm
        transition-all duration-200
        hover:-translate-y-0.5
        hover:shadow-md
        dark:border-white/10
        dark:bg-white/[0.06]
        dark:text-white
      "
    >
      <span className="text-base">
        {dark ? "☀️" : "🌙"}
      </span>

      <span>
        {dark ? "Light" : "Dark"}
      </span>
    </button>
  );
}
