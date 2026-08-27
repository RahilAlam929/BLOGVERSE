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

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      alert("Could not copy link");
    }
  }

  async function nativeShare() {
    if (!url) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url,
        });
      } catch {
        // User cancelled sharing.
      }
      return;
    }

    await copyLink();
  }

  const encodedUrl = encodeURIComponent(url);

  return (
    <section className="mt-14">
      <div
        className="reading-surface reading-border overflow-hidden rounded-2xl border"
      >
        <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-start gap-3">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              style={{
                borderColor: "var(--reading-border)",
                backgroundColor: "var(--reading-bg)",
              }}
            >
              <Share2
                className="h-[18px] w-[18px]"
                style={{ color: "var(--reading-accent)" }}
              />
            </div>

            <div>
              <p className="reading-text text-sm font-bold">
                Share this article
              </p>

              <p className="reading-muted mt-1 text-xs">
                Help others discover this article.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href={`https://twitter.com/intent/tweet?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on X"
              className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--reading-bg)",
                borderColor: "var(--reading-border)",
                color: "var(--reading-text)",
              }}
            >
              <Twitter className="h-4 w-4" />
              <span className="hidden sm:inline">X</span>
            </a>

            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
              target="_blank"
              rel="noreferrer"
              aria-label="Share on LinkedIn"
              className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--reading-bg)",
                borderColor: "var(--reading-border)",
                color: "var(--reading-text)",
              }}
            >
              <Linkedin className="h-4 w-4" />
              <span className="hidden sm:inline">LinkedIn</span>
            </a>

            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--reading-bg)",
                borderColor: "var(--reading-border)",
                color: "var(--reading-text)",
              }}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}

              <span>{copied ? "Copied" : "Copy link"}</span>
            </button>

            <button
              type="button"
              onClick={nativeShare}
              className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white transition hover:-translate-y-0.5"
              style={{
                backgroundColor: "var(--reading-accent)",
              }}
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
