"use client";

import {
  Check,
  Copy,
  Linkedin,
  Share2,
  Twitter,
} from "lucide-react";
import { useEffect, useState } from "react";

export function ShareSection() {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  async function copyLink() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Could not copy link");
    }
  }

  async function nativeShare() {
    if (!url) return;

    if (navigator.share) {
      await navigator.share({
        title: document.title,
        url,
      });
    } else {
      await copyLink();
    }
  }

  return (
    <section className="mt-12 border-y border-slate-200 py-6 dark:border-white/10">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 dark:bg-white/[0.06] dark:text-slate-200">
            <Share2 className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              Share this article
            </p>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Help someone discover this idea.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <Twitter className="h-4 w-4" />
            X
          </a>

          <a
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            <Linkedin className="h-4 w-4" />
            LinkedIn
          </a>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}

            {copied ? "Copied" : "Copy"}
          </button>

          <button
            type="button"
            onClick={nativeShare}
            className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </section>
  );
}
