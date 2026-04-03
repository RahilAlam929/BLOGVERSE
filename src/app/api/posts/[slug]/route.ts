import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });

  if (!post || post.authorId !== user.id) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  await prisma.post.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}
