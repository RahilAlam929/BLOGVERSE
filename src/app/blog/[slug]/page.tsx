import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

import { LikeButton } from "@/components/like-button";
import { CommentForm } from "@/components/comment-form";
import { CommentThread } from "@/components/comment-thread";
import { ShareSection } from "@/components/share-section";
import { FollowButton } from "@/components/follow-button";
import { DeletePostButton } from "@/components/delete-post-button";
import BlogDiscovery from "@/components/blog-discovery";
import { ReadingThemeToggle } from "@/components/reading-theme-toggle";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; url: string; caption?: string }
  | { type: "code"; language?: string; code: string };

type PostData = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  content_blocks?: Block[] | null;
  cover_image?: string | null;
  category?: string | null;
  topic?: string | null;
  language?: string | null;
  created_at?: string | null;
  guest_id?: string | null;
  guest_name?: string | null;
  likes?: { id: number; guest_id?: string | null }[] | null;
};

type CommentItem = {
  id: number;
  post_id: number;
  parent_id?: number | null;
  content: string;
  guest_name?: string | null;
  created_at?: string | null;
};

type RelatedPost = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category?: string | null;
  created_at?: string | null;
  guest_name?: string | null;
  topic?: string | null;
  language?: string | null;
  likes?: { id: number }[] | null;
  comments?: { id: number }[] | null;
};

function makeHeadingId(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

function wordCount(blocks: Block[]) {
  return blocks.reduce((total, block) => {
    const text =
      block.type === "image"
        ? block.caption || ""
        : block.type === "code"
          ? block.code
          : block.text;

    return total + text.split(/\s+/).filter(Boolean).length;
  }, 0);
}

function renderBlock(block: Block, index: number) {
  if (block.type === "heading") {
    const headingId = makeHeadingId(block.text);

    return (
      <h2
        key={index}
        id={headingId}
        className="reading-text group mt-14 scroll-mt-28 text-2xl font-black leading-tight sm:text-3xl lg:text-4xl"
      >
        <a href={`#${headingId}`} className="inline-flex gap-2">
          {block.text}
          <span className="opacity-0 transition group-hover:opacity-50">
            #
          </span>
        </a>
      </h2>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        key={index}
        className="reading-surface reading-border mt-9 rounded-r-2xl border-l-4 px-5 py-5 sm:px-7"
        style={{ borderLeftColor: "var(--reading-accent)" }}
      >
        <p className="reading-text text-lg italic leading-8 sm:text-xl">
          {block.text}
        </p>
      </blockquote>
    );
  }

  if (block.type === "image") {
    return (
      <figure key={index} className="mt-9">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.url}
          alt={block.caption || "Article image"}
          className="reading-image w-full rounded-2xl border object-cover shadow-sm"
          style={{ borderColor: "var(--reading-border)" }}
        />

        {block.caption ? (
          <figcaption className="reading-muted mt-3 text-center text-sm">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "code") {
    return (
      <div
        key={index}
        className="reading-code mt-9 overflow-hidden rounded-2xl border"
        style={{ borderColor: "var(--reading-border)" }}
      >
        {block.language ? (
          <div className="border-b px-4 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-zinc-400">
            {block.language}
          </div>
        ) : null}

        <pre className="overflow-x-auto p-5 text-sm leading-7">
          <code>{block.code}</code>
        </pre>
      </div>
    );
  }

  return (
    <p
      key={index}
      className="reading-text mt-7 whitespace-pre-wrap text-[17px] leading-[1.9] sm:text-[19px]"
    >
      {block.text}
    </p>
  );
}

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: rawPost, error } = await supabase
    .from("posts")
    .select(`
      *,
      likes(id, guest_id)
    `)
    .eq("slug", slug)
    .single();

  if (error || !rawPost) {
    notFound();
  }

  const post = rawPost as PostData;

  const { data: rawComments } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  const comments = (rawComments ?? []) as CommentItem[];

  const { data: rawFollowers } = await supabase
    .from("follows")
    .select("id, guest_id")
    .eq("following_id", post.guest_id || "");

  const followersCount = rawFollowers?.length ?? 0;

  const { data: rawRelated } = await supabase
    .from("posts")
    .select(`
      *,
      likes(id),
      comments(id)
    `)
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(24);

  const allRelatedPosts = (rawRelated ?? []) as RelatedPost[];

  const relatedPosts = [...allRelatedPosts]
    .sort((a, b) => {
      const score = (item: RelatedPost) => {
        let value = 0;

        if (
          post.category &&
          item.category &&
          post.category.toLowerCase() === item.category.toLowerCase()
        ) {
          value += 3;
        }

        if (
          post.topic &&
          item.topic &&
          post.topic.toLowerCase() === item.topic.toLowerCase()
        ) {
          value += 2;
        }

        if (
          post.language &&
          item.language &&
          post.language.toLowerCase() === item.language.toLowerCase()
        ) {
          value += 1;
        }

        return value;
      };

      return score(b) - score(a);
    })
    .slice(0, 12);

  const blocks: Block[] =
    Array.isArray(post.content_blocks) && post.content_blocks.length > 0
      ? post.content_blocks
      : post.content
        ? [{ type: "paragraph", text: post.content }]
        : [];

  const headings = blocks
    .filter(
      (block): block is Extract<Block, { type: "heading" }> =>
        block.type === "heading",
    )
    .map((block) => ({
      text: block.text,
      id: makeHeadingId(block.text),
    }));

  const readingWords = wordCount(blocks);
  const readingMinutes = Math.max(1, Math.ceil(readingWords / 200));
  const commentCount = comments.length;
  const likeCount = post.likes?.length ?? 0;

  return (
    <main className="reading-page min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto max-w-[900px]">

          {/* READING CONTROLS */}

          <div className="reading-surface reading-border sticky top-[76px] z-30 mb-8 flex items-center justify-between gap-4 rounded-2xl border px-3 py-2.5 shadow-sm backdrop-blur-xl sm:px-4">
            <div className="reading-muted flex items-center gap-2 text-xs font-semibold">
              <span>Reading mode</span>
              <span className="hidden sm:inline">•</span>
              <span>{readingMinutes} min read</span>
            </div>

            <ReadingThemeToggle />
          </div>

          {/* ARTICLE HEADER */}

          <article>
            <div className="mb-6 flex flex-wrap gap-2">
              {[post.category, post.topic, post.language]
                .filter(Boolean)
                .map((item) => (
                  <span
                    key={item}
                    className="reading-surface reading-border reading-text rounded-full border px-3 py-1.5 text-xs font-bold"
                  >
                    {item}
                  </span>
                ))}
            </div>

            <h1 className="reading-text max-w-4xl text-4xl font-black leading-[1.08] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>

            <div className="reading-border mt-7 flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="reading-text font-bold">
                  {post.guest_name || "Anonymous"}
                </p>

                <p className="reading-muted mt-1 text-sm">
                  {formatDate(post.created_at)}
                  {readingWords > 0 ? ` • ${readingWords} words` : ""}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {post.guest_id ? (
                  <FollowButton
                    authorGuestId={post.guest_id}
                    initialFollowing={false}
                    initialFollowersCount={followersCount}
                  />
                ) : null}

                <DeletePostButton
                  postId={post.id}
                  authorGuestId={post.guest_id}
                />
              </div>
            </div>

            {post.excerpt ? (
              <p className="reading-muted mt-8 max-w-3xl text-lg leading-8 sm:text-xl sm:leading-9">
                {post.excerpt}
              </p>
            ) : null}

            {/* TABLE OF CONTENTS */}

            {headings.length > 0 ? (
              <aside className="reading-surface reading-border mt-9 rounded-2xl border p-5 sm:p-6">
                <p className="reading-muted text-xs font-black uppercase tracking-[0.18em]">
                  Contents
                </p>

                <nav className="mt-4 space-y-1">
                  {headings.map((item, index) => (
                    <a
                      key={`${item.id}-${index}`}
                      href={`#${item.id}`}
                      className="reading-text block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      {index + 1}. {item.text}
                    </a>
                  ))}
                </nav>
              </aside>
            ) : null}

            {/* COVER */}

            {post.cover_image ? (
              <figure className="mt-9">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="reading-image w-full rounded-3xl border object-cover shadow-sm"
                  style={{ borderColor: "var(--reading-border)" }}
                />
              </figure>
            ) : null}

            {/* CONTENT */}

            <div className="mt-10">
              {blocks.length > 0 ? (
                blocks.map((block, index) => renderBlock(block, index))
              ) : (
                <p className="reading-muted py-10 text-center">
                  No content available.
                </p>
              )}
            </div>

            {/* ARTICLE ACTIONS */}

            <div className="reading-border mt-14 border-y py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="reading-text text-sm font-bold">
                    Enjoyed this article?
                  </p>
                  <p className="reading-muted mt-1 text-xs">
                    Support the writer and share it with others.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <LikeButton
                    postId={post.id}
                    initialLiked={false}
                    initialCount={likeCount}
                  />

                  <a
                    href="#comments"
                    className="reading-surface reading-border reading-text inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition hover:-translate-y-0.5"
                  >
                    💬 {commentCount}
                    <span className="hidden sm:inline">Comments</span>
                  </a>
                </div>
              </div>
            </div>

            {/* SHARE */}

            <ShareSection />

            {/* COMMENTS */}

            <section
              id="comments"
              className="mt-16 scroll-mt-28"
            >
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="reading-muted text-xs font-black uppercase tracking-[0.18em]">
                    Discussion
                  </p>

                  <h2 className="reading-text mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                    Comments
                  </h2>
                </div>

                <span className="reading-muted text-sm">
                  {commentCount} {commentCount === 1 ? "comment" : "comments"}
                </span>
              </div>

              <div className="reading-surface reading-border mt-7 rounded-3xl border p-5 sm:p-7">
                <CommentForm
                  postId={post.id}
                  parentId={null}
                />
              </div>

              <div className="mt-8">
                <CommentThread
                  comments={comments}
                  postId={post.id}
                />
              </div>
            </section>
          </article>
        </div>

        {/* RELATED */}

        {relatedPosts.length > 0 ? (
          <section className="mt-20 border-t border-black/10 pt-12 dark:border-white/10">
            <BlogDiscovery posts={relatedPosts} />
          </section>
        ) : null}
      </div>
    </main>
  );
}
