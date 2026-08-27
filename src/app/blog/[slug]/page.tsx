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

function renderBlock(block: Block, index: number) {
  if (block.type === "heading") {
    const headingId = makeHeadingId(block.text);

    return (
      <section key={index} id={headingId} className="scroll-mt-28">
        <h2 className="group mt-16 text-2xl font-black leading-tight tracking-[-0.025em] text-slate-950 sm:text-3xl lg:text-[2.15rem] dark:text-white">
          {block.text}
          <a
            href={`#${headingId}`}
            className="ml-2 text-sm font-bold text-violet-500 opacity-0 transition group-hover:opacity-100"
            aria-label={`Link to ${block.text}`}
          >
            #
          </a>
        </h2>
      </section>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        key={index}
        className="my-10 rounded-r-2xl border-l-4 border-violet-500 bg-violet-50 px-6 py-5 text-lg font-medium italic leading-8 text-slate-700 dark:bg-violet-500/[0.08] dark:text-slate-300"
      >
        <span className="mr-2 text-3xl font-black text-violet-500">“</span>
        {block.text}
      </blockquote>
    );
  }

  if (block.type === "image") {
    return (
      <figure key={index} className="my-10">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-slate-100 shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={block.url}
            alt={block.caption || "Article image"}
            className="h-auto max-h-[700px] w-full object-cover"
            loading="lazy"
          />
        </div>

        {block.caption ? (
          <figcaption className="mt-3 text-center text-sm leading-6 text-slate-500 dark:text-slate-500">
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
        className="my-10 overflow-hidden rounded-2xl border border-slate-800 bg-[#111318] shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </div>

          {block.language ? (
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              {block.language}
            </span>
          ) : null}
        </div>

        <pre className="overflow-x-auto p-5 text-[13px] leading-7 text-slate-200 sm:text-sm">
          <code>{block.code}</code>
        </pre>
      </div>
    );
  }

  return (
    <p
      key={index}
      className="mt-7 whitespace-pre-wrap text-[17px] leading-[1.9] text-slate-700 sm:text-[18px] sm:leading-[1.95] lg:text-[19px] dark:text-slate-300"
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

  const readingTime = Math.max(
    1,
    Math.ceil(
      blocks.reduce((total, block) => {
        if (block.type === "image") {
          return total;
        }

        const text = block.type === "code" ? block.code : block.text;

        return total + text.split(/\s+/).filter(Boolean).length;
      }, 0) / 200,
    ),
  );

  return (
    <main className="min-h-screen bg-[#f5f5f7] text-slate-950 transition-colors dark:bg-[#0b0d10] dark:text-white">
      {/* TOP READING BAR */}
      <div className="border-b border-black/[0.06] bg-white/80 backdrop-blur-xl dark:border-white/[0.07] dark:bg-[#0b0d10]/90">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a
            href="/blogs"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-slate-950 dark:text-slate-400 dark:hover:text-white"
          >
            <span className="text-lg">←</span>
            <span className="hidden sm:inline">Back to blogs</span>
            <span className="sm:hidden">Back</span>
          </a>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs font-semibold text-slate-400 sm:inline">
              {readingTime} min read
            </span>

            <ReadingThemeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        {/* ARTICLE HEADER */}
        <article className="mx-auto max-w-[820px]">
          <div className="flex flex-wrap gap-2">
            {post.category ? (
              <span className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                {post.category}
              </span>
            ) : null}

            {post.topic ? (
              <span className="rounded-full border border-violet-500/20 bg-violet-500/[0.08] px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-violet-600 dark:text-violet-300">
                {post.topic}
              </span>
            ) : null}

            {post.language ? (
              <span className="rounded-full border border-black/[0.08] bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wide text-slate-600 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
                {post.language}
              </span>
            ) : null}
          </div>

          <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-[-0.045em] text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
            {post.title}
          </h1>

          {post.excerpt ? (
            <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-500 sm:text-xl sm:leading-9 dark:text-slate-400">
              {post.excerpt}
            </p>
          ) : null}

          {/* AUTHOR */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-y border-black/[0.08] py-5 dark:border-white/[0.08]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 text-sm font-black text-white">
                {(post.guest_name || "A")
                  .slice(0, 1)
                  .toUpperCase()}
              </div>

              <div>
                <p className="text-sm font-black text-slate-950 dark:text-white">
                  {post.guest_name || "Anonymous"}
                </p>

                <p className="text-xs text-slate-400">
                  {formatDate(post.created_at)} · {readingTime} min read
                </p>
              </div>
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

          {/* COVER */}
          {post.cover_image ? (
            <figure className="mt-9 overflow-hidden rounded-[28px] border border-black/[0.08] bg-white shadow-xl dark:border-white/[0.08] dark:bg-white/[0.03]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image}
                alt={post.title}
                className="h-auto max-h-[620px] w-full object-cover"
              />
            </figure>
          ) : null}

          {/* CONTENT + TOC */}
          <div className="mt-10 lg:grid lg:grid-cols-[1fr_190px] lg:gap-12">
            <div>
              {headings.length > 0 ? (
                <details className="mb-10 overflow-hidden rounded-2xl border border-black/[0.08] bg-white dark:border-white/[0.08] dark:bg-white/[0.035] lg:hidden">
                  <summary className="cursor-pointer px-5 py-4 text-sm font-black">
                    📑 On this page
                  </summary>

                  <div className="border-t border-black/[0.06] px-5 py-4 dark:border-white/[0.06]">
                    <nav className="space-y-2">
                      {headings.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="block text-sm leading-6 text-slate-500 transition hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-300"
                        >
                          {item.text}
                        </a>
                      ))}
                    </nav>
                  </div>
                </details>
              ) : null}

              <div>
                {blocks.length > 0 ? (
                  blocks.map((block, index) =>
                    renderBlock(block, index),
                  )
                ) : (
                  <p className="text-slate-500">
                    No content available.
                  </p>
                )}
              </div>

              {/* ARTICLE ACTIONS */}
              <div className="mt-14 flex flex-wrap items-center gap-3 border-t border-black/[0.08] pt-7 dark:border-white/[0.08]">
                <LikeButton
                  postId={post.id}
                  initialLiked={false}
                  initialCount={post.likes?.length ?? 0}
                />

                <ShareSection />
              </div>
            </div>

            {/* DESKTOP TOC */}
            {headings.length > 0 ? (
              <aside className="hidden lg:block">
                <div className="sticky top-28">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    On this page
                  </p>

                  <nav className="mt-4 border-l border-black/[0.08] pl-4 dark:border-white/[0.08]">
                    <div className="space-y-3">
                      {headings.map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.id}`}
                          className="block text-xs font-semibold leading-5 text-slate-400 transition hover:text-violet-600 dark:hover:text-violet-300"
                        >
                          {item.text}
                        </a>
                      ))}
                    </div>
                  </nav>
                </div>
              </aside>
            ) : null}
          </div>

          {/* COMMENTS */}
          <section className="mt-20 border-t border-black/[0.08] pt-12 dark:border-white/[0.08]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-violet-500">
                Community
              </p>

              <h2 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
                Join the conversation
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
                Share your thoughts, questions or perspective on this article.
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm dark:border-white/[0.08] dark:bg-white/[0.035] sm:p-7">
              <CommentForm
                postId={post.id}
                parentId={null}
              />
            </div>

            <div className="mt-10">
              <CommentThread
                comments={comments}
                postId={post.id}
              />
            </div>
          </section>
        </article>

        {/* RELATED */}
        <section className="mt-20 border-t border-black/[0.08] pt-14 dark:border-white/[0.08]">
          <BlogDiscovery posts={relatedPosts} />
        </section>
      </div>
    </main>
  );
}
