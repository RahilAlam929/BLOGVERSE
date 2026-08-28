import { createClient } from "@/lib/supabase/server";
import BlogDiscovery from "@/components/blog-discovery";

type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image?: string | null;
  category?: string | null;
  topic?: string | null;
  language?: string | null;
  guest_name?: string | null;
  guest_id?: string | null;
  created_at?: string | null;
  likes?: { id: number }[] | null;
  comments?: { id: number }[] | null;
};

export default async function BlogsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      slug,
      title,
      excerpt,
      cover_image,
      category,
      topic,
      language,
      guest_name,
      guest_id,
      created_at,
      likes(id),
      comments(id)
    `)
    .order("created_at", { ascending: false });

  const posts = (error ? [] : data ?? []) as Post[];

  return <BlogDiscovery posts={posts} />;
}
