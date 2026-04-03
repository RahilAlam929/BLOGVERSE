"use client";

import { useEffect, useState } from "react";

export function ShareSection() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied");
    } catch {
      alert("Could not copy link");
    }
  }

  return (
    <section className="mt-14 border-t border-black/10 pt-8 dark:border-white/10">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <h3 className="text-2xl font-black text-[#1f1f26] dark:text-white">
          Share this article
        </h3>

        <div className="flex flex-wrap gap-3">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Share on X
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Share on LinkedIn
          </a>

          <button
            onClick={copyLink}
            className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10"
          >
            Copy link
          </button>
        </div>
      </div>
    </section>
  );
}