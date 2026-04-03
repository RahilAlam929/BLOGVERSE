
    import { Header } from "@/components/header";
import { CategoryTabs } from "@/components/category-tabs";
import { FeaturedPost } from "@/components/featured-post";
import { PostGrid } from "@/components/post-grid";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; topic?: string; language?: string }>;
}) {
  const { category, q, topic, language } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profileUsername: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", user.id)
      .single();

    profileUsername = profile?.username ?? null;
  }

  let query = supabase
    .from("posts")
    .select(`
      *,
      profiles(name, username, avatar_url),
      likes(id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (q) {
    query = query.or(`title.ilike.%${q}%,excerpt.ilike.%${q}%,content.ilike.%${q}%`);
  }

  const { data: posts } = await query;

  let normalized =
    posts?.map((post: any) => ({
      ...post,
      likes_count: post.likes?.length ?? 0,
      comments_count: post.comments?.length ?? 0,
    })) ?? [];

  if (topic) {
    normalized = normalized.filter((post: any) =>
      (post.topic || "").toLowerCase().replace(/\s+/g, "-").includes(topic)
    );
  }

  if (language) {
    normalized = normalized.filter((post: any) =>
      (post.language || "").toLowerCase().replace(/\s+/g, "-").includes(language)
    );
  }

  const featured = normalized[0];
  const latest = normalized.slice(1);

  return (
    <main className="min-h-screen">
      <Header user={user} profileUsername={profileUsername} />

      <div className="mx-auto max-w-[1600px] px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <CategoryTabs />

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