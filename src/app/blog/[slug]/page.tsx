import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { LikeButton } from "@/components/like-button";
import { CommentForm } from "@/components/comment-form";
import { CommentThread } from "@/components/comment-thread";
import { ShareSection } from "@/components/share-section";
import { FollowButton } from "@/components/follow-button";
import { DeletePostButton } from "@/components/delete-post-button";

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
  created_at?: string | null;
  guest_name?: string | null;
  topic?: string | null;
  language?: string | null;
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
      <h2
        key={index}
        id={headingId}
        className="group mt-14 scroll-mt-24 text-2xl font-black leading-tight text-[#1f1f26] sm:text-3xl lg:text-4xl"
      >
        <a href={`#${headingId}`} className="inline-flex items-center gap-2">
          {block.text}
          <span className="text-base opacity-0 transition group-hover:opacity-100">
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
        className="mt-8 rounded-r-2xl border-l-4 border-violet-500 bg-violet-50 px-5 py-4 text-lg italic leading-8 text-slate-700"
      >
        {block.text}
      </blockquote>
    );
  }

  if (block.type === "image") {
    return (
      <figure key={index} className="mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={block.url}
          alt={block.caption || "Article image"}
          className="w-full rounded-[22px] border border-black/10 object-cover"
        />
        {block.caption ? (
          <figcaption className="mt-3 text-sm text-slate-500">
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
        className="mt-8 overflow-x-auto rounded-[20px] border border-slate-800 bg-[#0f172a] p-5"
      >
        {block.language ? (
          <div className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
            {block.language}
          </div>
        ) : null}
        <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-100">
          <code>{block.code}</code>
        </pre>
      </div>
    );
  }

  return (
    <p
      key={index}
      className="mt-6 whitespace-pre-wrap text-[17px] leading-8 text-slate-700 sm:text-[19px] sm:leading-9"
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
    .select("*")
    .neq("id", post.id)
    .order("created_at", { ascending: false })
    .limit(3);

  const relatedPosts = (rawRelated ?? []) as RelatedPost[];

  const blocks: Block[] =
    Array.isArray(post.content_blocks) && post.content_blocks.length > 0
      ? post.content_blocks
      : post.content
      ? [{ type: "paragraph", text: post.content }]
      : [];

  const headings = blocks
    .filter((block): block is Extract<Block, { type: "heading" }> => block.type === "heading")
    .map((block) => ({
      text: block.text,
      id: makeHeadingId(block.text),
    }));

  return (
    <main className="min-h-screen bg-[#f3f3f5] text-[#1f1f26]">
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-[850px]">
          <div className="mb-6 flex flex-wrap gap-2">
            {post.category ? (
              <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-sm">
                {post.category}
              </span>
            ) : null}

            {post.topic ? (
              <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-sm">
                {post.topic}
              </span>
            ) : null}

            {post.language ? (
              <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-sm">
                {post.language}
              </span>
            ) : null}
          </div>

          <h1 className="text-3xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-6">
            <div>
              <p className="text-lg font-semibold">
                {post.guest_name || "Anonymous"}
              </p>
              <p className="text-sm text-slate-500">
                {formatDate(post.created_at)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
            <p className="mt-8 text-lg leading-8 text-slate-700 sm:text-[22px] sm:leading-10">
              {post.excerpt}
            </p>
          ) : null}

          {headings.length > 0 ? (
            <div className="mt-8 rounded-[20px] border border-black/10 bg-white p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
                On this page
              </p>
              <div className="mt-3 flex flex-col gap-2">
                {headings.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="text-sm text-slate-700 hover:text-violet-600"
                  >
                    {item.text}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {post.cover_image ? (
            <div className="mt-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full rounded-[24px] border border-black/10 object-cover"
              />
            </div>
          ) : null}

          <div className="mt-10">
            {blocks.length > 0 ? (
              blocks.map((block, index) => renderBlock(block, index))
            ) : (
              <p className="text-slate-600">No content available.</p>
            )}
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-black/10 pt-8">
            <LikeButton
              postId={post.id}
              initialLiked={false}
              initialCount={post.likes?.length ?? 0}
            />
          </div>

          <ShareSection />

          <section className="mt-16">
            <h2 className="text-2xl font-black sm:text-3xl">Comments</h2>

            <div className="mt-6">
              <CommentForm postId={post.id} parentId={null} />
            </div>

            <div className="mt-10">
              <CommentThread comments={comments} postId={post.id} />
            </div>
          </section>
        </article>

        <section className="mt-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black sm:text-3xl">
              New articles
            </h2>
          </div>

          {relatedPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((item) => (
                <Link
                  key={item.id}
                  href={`/blog/${item.slug}`}
                  className="group overflow-hidden rounded-[24px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image || "https://via.placeholder.com/800x500"}
                      alt={item.title}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {item.topic ? (
                        <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                          {item.topic}
                        </span>
                      ) : null}

                      {item.language ? (
                        <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                          {item.language}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-xl font-black leading-tight">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-slate-600">
                      {item.excerpt}
                    </p>

                    <div className="mt-4 text-sm text-slate-500">
                      {item.guest_name || "Anonymous"} • {formatDate(item.created_at)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-black/10 bg-white p-8 text-slate-500">
              No more articles yet.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}