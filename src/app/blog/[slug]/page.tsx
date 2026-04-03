import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { LikeButton } from "@/components/like-button";
import { CommentForm } from "@/components/comment-form";
import { CommentThread } from "@/components/comment-thread";
import { DiscoverMore } from "@/components/discover-more";
import { ArticleToc } from "@/components/article-toc";
import { ShareSection } from "@/components/share-section";
import { EditPostButton } from "@/components/edit-post-button";
import { DeletePostButton } from "@/components/delete-post-button";
import { FollowButton } from "@/components/follow-button";

function getHeadings(blocks: any[]) {
  let headingCount = 0;

  return blocks
    .filter((block) => block.type === "heading" && block.text)
    .map((block) => ({
      id: `heading-${headingCount++}`,
      text: block.text,
    }));
}

function renderBlock(
  block: any,
  index: number,
  headingIndexRef: { value: number }
) {
  if (block.type === "heading") {
    const id = `heading-${headingIndexRef.value++}`;

    return (
      <h2
        key={index}
        id={id}
        className="mt-16 scroll-mt-24 text-3xl font-black leading-tight text-[#1f1f26] dark:text-white sm:text-4xl"
      >
        {block.text}
      </h2>
    );
  }

  if (block.type === "image") {
    return (
      <figure key={index} className="mt-10">
        <img
          src={block.url}
          alt={block.caption || "Article image"}
          className="w-full rounded-[22px] border border-black/10 object-cover dark:border-white/10"
        />
        {block.caption ? (
          <figcaption className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  if (block.type === "quote") {
    return (
      <blockquote
        key={index}
        className="mt-10 border-l-4 border-violet-500 pl-5 text-xl italic leading-9 text-slate-700 dark:text-slate-300"
      >
        {block.text}
      </blockquote>
    );
  }

  if (block.type === "code") {
    return (
      <div
        key={index}
        className="mt-10 overflow-x-auto rounded-[18px] border border-black/10 bg-[#111827] p-5 dark:border-white/10"
      >
        <pre className="text-sm leading-7 text-slate-100">
          <code>{block.code}</code>
        </pre>
      </div>
    );
  }

  return (
    <p
      key={index}
      className="mt-7 whitespace-pre-wrap text-[19px] leading-9 text-slate-700 dark:text-slate-300"
    >
      {block.text}
    </p>
  );
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles(name, username, avatar_url),
      likes(id, user_id)
    `)
    .eq("slug", slug)
    .single();

  if (error || !post) return notFound();

  const { data: comments } = await supabase
    .from("comments")
    .select(`
      *,
      profiles(name, username, avatar_url)
    `)
    .eq("post_id", post.id)
    .order("created_at", { ascending: true });

  const { data: relatedPosts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles(name, username, avatar_url)
    `)
    .neq("id", post.id)
    .eq("category", post.category)
    .order("created_at", { ascending: false })
    .limit(4);

  const { data: followers } = await supabase
    .from("follows")
    .select("id, follower_id")
    .eq("following_id", post.user_id);

  const isFollowing = !!followers?.find((item: any) => item.follower_id === user?.id);
  const followersCount = followers?.length ?? 0;

  const blocks =
    Array.isArray(post.content_blocks) && post.content_blocks.length > 0
      ? post.content_blocks
      : [{ type: "paragraph", text: post.content }];

  const headings = getHeadings(blocks);
  const headingIndexRef = { value: 0 };

  const likedByUser = !!post.likes?.find((like: any) => like.user_id === user?.id);
  const likesCount = post.likes?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#f3f3f5] text-[#1f1f26] dark:bg-[#09090f] dark:text-white">
      <div className="mx-auto max-w-[1380px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,860px)_260px]">
          <article className="min-w-0">
            <div className="mb-8 flex flex-wrap gap-2">
              {post.category ? (
                <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {post.category}
                </span>
              ) : null}

              {post.topic ? (
                <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {post.topic}
                </span>
              ) : null}

              {post.language ? (
                <span className="rounded-md border border-black/10 bg-white px-3 py-1 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                  {post.language}
                </span>
              ) : null}
            </div>

            <h1 className="max-w-5xl text-4xl font-black leading-[1.02] tracking-tight text-[#1f1f26] dark:text-white sm:text-5xl lg:text-[72px]">
              {post.title}
            </h1>

            <div className="mt-8 flex flex-col gap-5 border-b border-black/10 pb-8 dark:border-white/10 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                {post.profiles?.avatar_url ? (
                  <img
                    src={post.profiles.avatar_url}
                    alt={post.profiles?.name || "Author"}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-14 w-14 rounded-full bg-slate-300" />
                )}

                <div>
                  <p className="text-lg font-semibold text-[#1f1f26] dark:text-white">
                    {post.profiles?.name || "Anonymous"}
                  </p>
                  <p className="text-base text-slate-500 dark:text-slate-400">
                    {formatDate(post.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <FollowButton
                  currentUserId={user?.id || null}
                  authorId={post.user_id}
                  initialFollowing={isFollowing}
                  initialFollowersCount={followersCount}
                />

                <EditPostButton
                  postId={post.id}
                  userId={user?.id || null}
                  authorId={post.user_id}
                />

                <DeletePostButton
                  postId={post.id}
                  postTitle={post.title}
                  userId={user?.id || null}
                  authorId={post.user_id}
                />
              </div>
            </div>

            <p className="mt-10 max-w-4xl text-[24px] leading-10 text-slate-700 dark:text-slate-300">
              {post.excerpt}
            </p>

            <div className="mt-10">
              <img
                src={post.cover_image || "https://via.placeholder.com/1400x800"}
                alt={post.title}
                className="w-full rounded-[24px] border border-black/10 object-cover dark:border-white/10"
              />
            </div>

            <div className="mt-12">
              {blocks.map((block: any, index: number) =>
                renderBlock(block, index, headingIndexRef)
              )}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4 border-t border-black/10 pt-8 dark:border-white/10">
              <LikeButton
                postId={post.id}
                initialLiked={likedByUser}
                initialCount={likesCount}
                userId={user?.id || null}
              />
            </div>

            <ShareSection />

            <section className="mt-16">
              <h2 className="text-3xl font-black">Comments</h2>

              <div className="mt-6">
                <CommentForm
                  postId={post.id}
                  userId={user?.id || null}
                  parentId={null}
                />
              </div>

              <div className="mt-10">
                <CommentThread
                  comments={comments || []}
                  postId={post.id}
                  userId={user?.id || null}
                />
              </div>
            </section>

            <div className="mt-20">
              <DiscoverMore posts={relatedPosts || []} />
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <ArticleToc headings={headings} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}