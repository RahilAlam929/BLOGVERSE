import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { FollowButton } from "@/components/follow-button";

type GuestPost = {
  id: number;
  title: string;
  slug: string;
  excerpt?: string | null;
  cover_image?: string | null;
  created_at?: string | null;
  topic?: string | null;
  language?: string | null;
  guest_id?: string | null;
  guest_name?: string | null;
};

export default async function GuestAuthorPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await params;
  const supabase = await createClient();

  const { data: postsData } = await supabase
    .from("posts")
    .select("*")
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });

  const posts = (postsData ?? []) as GuestPost[];

  if (!posts.length) return notFound();

  const authorName = posts[0]?.guest_name || "Anonymous";

  const { data: followersData } = await supabase
    .from("follows")
    .select("id, guest_id")
    .eq("following_id", guestId);

  const followersCount = followersData?.length ?? 0;

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26]">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[28px] border border-black/10 bg-white p-8">
          <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="h-28 w-28 rounded-full bg-slate-300" />

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-4xl font-black">{authorName}</h1>
                  <span className="text-slate-500">@guest</span>
                </div>

                <p className="mt-4 text-slate-500">
                  Guest creator on BuildVerse
                </p>

                <div className="mt-5 flex flex-wrap gap-6 text-sm font-medium text-slate-600">
                  <span>
                    <strong className="text-[#1f1f26]">{posts.length}</strong> posts
                  </span>
                  <span>
                    <strong className="text-[#1f1f26]">{followersCount}</strong> followers
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <FollowButton
                authorGuestId={guestId}
                initialFollowing={false}
                initialFollowersCount={followersCount}
              />
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-black">
              Posts by {authorName}
            </h2>
          </div>

          {posts.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-[24px] border border-black/10 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image || "https://via.placeholder.com/800x500"}
                      alt={post.title}
                      className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {post.topic ? (
                        <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                          {post.topic}
                        </span>
                      ) : null}

                      {post.language ? (
                        <span className="rounded-full border border-black/10 bg-slate-50 px-3 py-1 text-xs text-slate-600">
                          {post.language}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="text-2xl font-black leading-tight">{post.title}</h3>

                    <p className="mt-3 line-clamp-3 text-slate-600">
                      {post.excerpt}
                    </p>

                    <p className="mt-4 text-sm text-slate-500">
                      {formatDate(post.created_at)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-black/10 bg-white p-8 text-slate-500">
              No posts yet.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}