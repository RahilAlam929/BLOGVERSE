"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { getGuestId, getGuestName } from "@/lib/guest";
import { GuestIdentityForm } from "@/components/guest-identity-form";

type Block =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "quote"; text: string }
  | { type: "image"; url: string; caption: string }
  | { type: "code"; language: string; code: string };

export default function CreatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "All",
    topic: "Next.js",
    language: "TypeScript",
  });

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [blocks, setBlocks] = useState<Block[]>([
    { type: "paragraph", text: "" },
  ]);
  const [loading, setLoading] = useState(false);

  function addBlock(type: Block["type"]) {
    if (type === "image") {
      setBlocks((prev) => [...prev, { type: "image", url: "", caption: "" }]);
      return;
    }

    if (type === "code") {
      setBlocks((prev) => [
        ...prev,
        { type: "code", language: "tsx", code: "" },
      ]);
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

  async function uploadFile(file: File, bucketName: string) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await supabase.storage.from(bucketName).upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) throw new Error(error.message);

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
    return data.publicUrl;
  }

  async function handleInlineImageUpload(index: number, file: File) {
    try {
      setLoading(true);
      const url = await uploadFile(file, "post-images");
      updateBlock(index, { url });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Image upload failed";
      alert(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;

    const guestId = getGuestId();
    const guestName = getGuestName().trim() || "Anonymous";
    setLoading(true);

    try {
      let coverImage = "";
      if (coverFile) {
        coverImage = await uploadFile(coverFile, "post-images");
      }

      const cleanBlocks = blocks.filter((block) => {
        if (block.type === "image") {
          return (block.url || "").trim() !== "";
        }

        if (block.type === "code") {
          return (block.code || "").trim() !== "";
        }

        return ("text" in block ? block.text : "").trim() !== "";
      });

      const fallbackContent =
        cleanBlocks
          .filter((block) => block.type !== "image")
          .map((block) => {
            if ("text" in block) return block.text;
            if ("code" in block) return block.code;
            return "";
          })
          .join("\n\n") || form.content || form.excerpt;

      const nextSlug = `${slugify(form.title)}-${Date.now()}`;

      const { error } = await supabase.from("posts").insert({
        title: form.title,
        slug: nextSlug,
        excerpt: form.excerpt,
        content: fallbackContent,
        content_blocks: cleanBlocks,
        cover_image: coverImage,
        category: form.category,
        topic: form.topic,
        language: form.language,
        guest_id: guestId,
        guest_name: guestName,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      alert("Post published successfully");
      setLoading(false);
      router.push(`/blog/${nextSlug}`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create post";
      alert(message);
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26]">
      <div className="mx-auto max-w-4xl rounded-[28px] border border-black/10 bg-white p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs uppercase tracking-[0.18em] text-violet-500">
            BuildVerse
          </p>
          <h1 className="mt-2 text-3xl font-black">Create article</h1>
        </div>

        <div className="mb-6">
          <GuestIdentityForm />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="text"
            placeholder="Article title"
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            placeholder="Short excerpt"
            rows={3}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            required
          />

          <div className="grid gap-4 md:grid-cols-3">
            <select
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="All">All</option>
              <option value="News">News</option>
              <option value="Events">Events</option>
              <option value="Livestreams">Livestreams</option>
              <option value="How-To's">How-To&apos;s</option>
            </select>

            <select
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
            >
              <option value="Next.js">Next.js</option>
              <option value="React">React</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Generative AI">Generative AI</option>
              <option value="Python">Python</option>
              <option value="JavaScript">JavaScript</option>
            </select>

            <select
              className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              <option value="TypeScript">TypeScript</option>
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="C++">C++</option>
            </select>
          </div>

          <div className="rounded-2xl border border-black/10 bg-slate-50 p-4">
            <p className="mb-3 text-sm font-semibold">Cover image</p>
            <input
              type="file"
              accept="image/*"
              className="w-full"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="rounded-2xl border border-black/10 bg-slate-50 p-4">
            <div className="mb-4 flex flex-wrap gap-3">
              <button type="button" onClick={() => addBlock("paragraph")} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                + Paragraph
              </button>
              <button type="button" onClick={() => addBlock("heading")} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                + Heading
              </button>
              <button type="button" onClick={() => addBlock("quote")} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                + Quote
              </button>
              <button type="button" onClick={() => addBlock("image")} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                + Image
              </button>
              <button type="button" onClick={() => addBlock("code")} className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm">
                + Code
              </button>
            </div>

            <div className="space-y-5">
              {blocks.map((block, index) => (
                <div key={index} className="rounded-2xl border border-black/10 bg-white p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold uppercase tracking-wide text-violet-500">
                      {block.type}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeBlock(index)}
                      className="text-sm text-red-500"
                    >
                      Remove
                    </button>
                  </div>

                  {block.type === "paragraph" && (
                    <textarea
                      rows={5}
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                      value={block.text}
                      onChange={(e) => updateBlock(index, { text: e.target.value })}
                    />
                  )}

                  {block.type === "heading" && (
                    <input
                      type="text"
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                      value={block.text}
                      onChange={(e) => updateBlock(index, { text: e.target.value })}
                    />
                  )}

                  {block.type === "quote" && (
                    <textarea
                      rows={3}
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                      value={block.text}
                      onChange={(e) => updateBlock(index, { text: e.target.value })}
                    />
                  )}

                  {block.type === "image" && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        className="w-full"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleInlineImageUpload(index, file);
                        }}
                      />
                      <input
                        type="text"
                        placeholder="Or paste image URL"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                        value={block.url}
                        onChange={(e) => updateBlock(index, { url: e.target.value })}
                      />
                      <input
                        type="text"
                        placeholder="Image caption"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                        value={block.caption}
                        onChange={(e) => updateBlock(index, { caption: e.target.value })}
                      />
                    </div>
                  )}

                  {block.type === "code" && (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Language"
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                        value={block.language}
                        onChange={(e) => updateBlock(index, { language: e.target.value })}
                      />
                      <textarea
                        rows={8}
                        className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 font-mono outline-none"
                        value={block.code}
                        onChange={(e) => updateBlock(index, { code: e.target.value })}
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
            className="rounded-full bg-[#6d5efc] px-5 py-3 font-semibold text-white disabled:opacity-60"
          >
            {loading ? "Publishing..." : "Publish article"}
          </button>
        </form>
      </div>
    </main>
  );
}