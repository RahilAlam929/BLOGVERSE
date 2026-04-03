import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Post } from "@/models/Post";
import { User } from "@/models/User";
import { getSessionUser } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  await connectDB();

  const posts = await Post.find({ published: true })
    .populate("author", "name username")
    .sort({ createdAt: -1 })
    .lean();

  const formatted = posts.map((post: any) => ({
    ...post,
    id: post._id.toString(),
    _count: {
      likes: post.likes?.length || 0,
      comments: 0,
    },
  }));

  return NextResponse.json(formatted);
}

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { title, excerpt, content, coverImage, category } = await req.json();

    await connectDB();

    const slug = `${slugify(title)}-${Date.now()}`;

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      coverImage,
      category,
      author: session.userId,
      published: true,
    });

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { message: "Post create failed" },
      { status: 500 }
    );
  }
}