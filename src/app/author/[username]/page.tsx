import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "@/components/follow-button";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: author } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!author) return notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select(`
      id,
      title,
      slug,
      excerpt,
      cover_image,
      created_at,
      category,
      topic,
      language
    `)
    .eq("user_id", author.id)
    .order("created_at", { ascending: false });

  const { data: followers } = await supabase
    .from("follows")
    .select("id, follower_id")
    .eq("following_id", author.id);

  const { data: following } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", author.id);

  const isFollowing = !!followers?.find((item: any) => item.follower_id === user?.id);
  const followersCount = followers?.length ?? 0;
  const followingCount = following?.length ?? 0;
  const isOwnProfile = user?.id === author.id;

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26] dark:bg-[#09090f] dark:text-white">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-black/10 bg-white p-8 dark:border-white/10 dark:bg-[#111118]">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={author.name || author.username}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="h-28 w-28 rounded-full bg-slate-300" />
              )}

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black">{author.name || "Anonymous"}</h1>
                  <span className="text-slate-500 dark:text-slate-400">
                    @{author.username}
                  </span>
                </div>

                {author.bio ? (
                  <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    {author.bio}
                  </p>
                ) : (
                  <p className="mt-4 text-slate-500 dark:text-slate-400">
                    No bio added yet.
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <span>
                    <strong className="text-[#1f1f26] dark:text-white">{posts?.length ?? 0}</strong> posts
                  </span>
                  <span>
                    <strong className="text-[#1f1f26] dark:text-white">{followersCount}</strong> followers
                  </span>
                  <span>
                    <strong className="text-[#1f1f26] dark:text-white">{followingCount}</strong> following
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {isOwnProfile ? (
                <Link
                  href="/profile/edit"
                  className="rounded-full bg-[#6d5efc] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Edit profile
                </Link>
              ) : (
                <FollowButton
                  currentUserId={user?.id || null}
                  authorId={author.id}
                  initialFollowing={isFollowing}
                  initialFollowersCount={followersCount}
                />
              )}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black">
              Posts by {author.name || author.username}
            </h2>
          </div>

          {posts?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[24px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111118]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-[#0f0f15]">
                    <img
                      src={post.cover_image || "https://via.placeholder.com/800x500"}
                      alt={post.title}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.topic ? (
                        <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                          {post.topic}
                        </span>
                      ) : null}

                      {post.language ? (
                        <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                          {post.language}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-2xl font-black leading-tight">{post.title}</h3>

                    <p className="mt-3 line-clamp-3 text-slate-600 dark:text-slate-300">
                      {post.excerpt}
                    </p>

                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-black/10 bg-white p-8 text-slate-500 dark:border-white/10 dark:bg-[#111118] dark:text-slate-400">
              No posts yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}