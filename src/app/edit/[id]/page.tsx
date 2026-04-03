"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; url: string; caption: string };

export default function EditPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "All",
    cover_image: "",
  });

  const [blocks, setBlocks] = useState<Block[]>([{ type: "paragraph", text: "" }]);

  useEffect(() => {
    async function loadPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error || !data) {
        alert("Post not found");
        router.push("/");
        return;
      }

      setForm({
        title: data.title || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "All",
        cover_image: data.cover_image || "",
      });

      setBlocks(
        Array.isArray(data.content_blocks) && data.content_blocks.length > 0
          ? data.content_blocks
          : [{ type: "paragraph", text: data.content || "" }]
      );

      setFetching(false);
    }

    loadPost();
  }, [params.id, router, supabase]);

  function addBlock(type: Block["type"]) {
    if (type === "image") {
      setBlocks((prev) => [...prev, { type: "image", url: "", caption: "" }]);
      return;
    }
    setBlocks((prev) => [...prev, { type, text: "" } as Block]);
  }

  function updateBlock(index: number, value: Partial<Block>) {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? ({ ...block, ...value } as Block) : block))
    );
  }

  function removeBlock(index: number) {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const cleanBlocks = blocks.filter((block) => {
      if (block.type === "image") return block.url.trim() !== "";
      return block.text.trim() !== "";
    });

    const fallbackContent =
      cleanBlocks
        .filter((block) => block.type !== "image")
        .map((block) => ("text" in block ? block.text : ""))
        .join("\n\n") || form.content || form.excerpt;

    const newSlug = `${slugify(form.title)}-${params.id}`;

    const { error } = await supabase
      .from("posts")
      .update({
        title: form.title,
        slug: newSlug,
        excerpt: form.excerpt,
        content: fallbackContent,
        content_blocks: cleanBlocks,
        cover_image: form.cover_image,
        category: form.category,
      })
      .eq("id", params.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Post updated");
    router.push(`/blog/${newSlug}`);
    router.refresh();
  }

  if (fetching) {
    return (
      <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white">
        <div className="mx-auto max-w-4xl">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0b0f] px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-white/10 bg-[#111118] p-6 sm:p-8">
        <h1 className="text-3xl font-black">Edit article</h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <input
            type="text"
            placeholder="Article title"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            rows={3}
            placeholder="Short excerpt"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
          />

          <input
            type="text"
            placeholder="Cover image URL"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={form.cover_image}
            onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
          />

          <select
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="All">All</option>
            <option value="News">News</option>
            <option value="Events">Events</option>
            <option value="Livestreams">Livestreams</option>
            <option value="How-To's">How-To's</option>
          </select>

          <div className="rounded-2xl border border-white/10 bg-[#0f0f15] p-4">
            <div className="mb-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => addBlock("paragraph")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                + Paragraph
              </button>
              <button type="button" onClick={() => addBlock("heading")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                + Heading
              </button>
              <button type="button" onClick={() => addBlock("quote")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                + Quote
              </button>
              <button type="button" onClick={() => addBlock("image")} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                + Image
              </button>
            </div>

            <div className="space-y-5">
              {blocks.map((block, index) => (
                <div key={index} className="rounded-2xl border border-white/10 bg-[#111118] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-wide text-violet-300">
                      {block.type}
                    </p>
                    <button type="button" onClick={() => removeBlock(index)} className="text-sm text-red-300">
                      Remove
                    </button>
                  </div>

                  {block.type !== "image" ? (
                    block.type === "heading" ? (
                      <input
                        type="text"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        value={block.text}
                        onChange={(e) => updateBlock(index, { text: e.target.value })}
                      />
                    ) : (
                      <textarea
                        rows={4}
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        value={block.text}
                        onChange={(e) => updateBlock(index, { text: e.target.value })}
                      />
                    )
                  ) : (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Image URL"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        value={block.url}
                        onChange={(e) => updateBlock(index, { url: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Image caption"
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                        value={block.caption}
                        onChange={(e) => updateBlock(index, { caption: e.target.value })}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-white px-5 py-3 font-semibold text-black disabled:opacity-60"
          >
            {loading ? "Updating..." : "Update article"}
          </button>
        </form>
      </div>
    </main>
  );
}