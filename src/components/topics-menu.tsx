"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const topicGroups = [
  {
    title: "Web Development",
    items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Frontend UI", "Backend APIs"],
  },
  {
    title: "AI & Machine Learning",
    items: ["Generative AI", "Agentic AI", "Machine Learning", "Deep Learning", "Prompt Engineering", "AI Tools"],
  },
  {
    title: "Programming",
    items: ["JavaScript", "Python", "C++", "Java", "DSA", "Competitive Programming"],
  },
  {
    title: "Data & Cloud",
    items: ["Data Science", "Data Analytics", "SQL", "Cloud Computing", "AWS", "Supabase"],
  },
  {
    title: "Developer Life",
    items: ["Coding Tips", "Productivity", "Build in Public", "Projects", "Startups", "Career Growth"],
  },
  {
    title: "Emerging Tech",
    items: ["Robotics", "Cybersecurity", "IoT", "Open Source", "SaaS", "Tech Trends"],
  },
];

const languageGroups = [
  "JavaScript",
  "TypeScript",
  "Python",
  "C++",
  "Java",
  "SQL",
  "HTML",
  "CSS",
];

function toSlug(value: string) {
  return value.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "");
}

export function TopicsMenu() {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 transition hover:text-black dark:text-slate-300 dark:hover:text-white"
      >
        Topics
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-3 w-[980px] max-w-[95vw] rounded-[24px] border border-black/10 bg-white p-8 shadow-2xl dark:border-white/10 dark:bg-[#111118]">
          <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div>
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Topics
              </h3>

              <div className="grid gap-8 md:grid-cols-3">
                {topicGroups.map((group) => (
                  <div key={group.title}>
                    <h4 className="mb-3 text-sm font-semibold text-[#1f1f26] dark:text-white">
                      {group.title}
                    </h4>

                    <div className="space-y-2.5">
                      {group.items.map((item) => (
                        <Link
                          key={item}
                          href={`/?topic=${toSlug(item)}`}
                          onClick={() => setOpen(false)}
                          className="block text-[15px] text-slate-700 transition hover:text-black dark:text-slate-300 dark:hover:text-white"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black/10 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-white/10">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Languages
              </h3>

              <div className="space-y-3">
                {languageGroups.map((lang) => (
                  <Link
                    key={lang}
                    href={`/?language=${toSlug(lang)}`}
                    onClick={() => setOpen(false)}
                    className="block text-[15px] text-slate-700 transition hover:text-black dark:text-slate-300 dark:hover:text-white"
                  >
                    {lang}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}