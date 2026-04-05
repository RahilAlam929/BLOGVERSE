import { Header } from "@/components/header";
import { FeaturedPost } from "@/components/featured-post";
import { PostGrid } from "@/components/post-grid";
import { createClient } from "@/lib/supabase/server";

type RawPost = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  topic?: string | null;
  language?: string | null;
  category?: string | null;
  guest_name?: string | null;
  guest_id?: string | null;
  likes?: { id: number }[] | null;
  comments?: { id: number }[] | null;
};

export default async function HomePage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select(`
      *,
      likes(id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  const posts = (data ?? []) as RawPost[];

  const normalized = posts.map((post) => ({
    ...post,
    profiles: {
      name: post.guest_name || "Anonymous",
      avatar_url: null,
    },
    likes_count: post.likes?.length ?? 0,
    comments_count: post.comments?.length ?? 0,
  }));

  const featured = normalized[0];
  const latest = normalized.slice(1);

  return (
    <main className="min-h-screen bg-[#f3f3f5] text-[#1f1f26]">
      <Header />

      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <div className="mt-8">
          {featured ? <FeaturedPost post={featured} /> : null}
        </div>

        <div className="mt-14">
          <PostGrid posts={latest} />
        </div>
      </div>
    </main>
  );
}