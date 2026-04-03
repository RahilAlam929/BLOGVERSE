"use client";

export function ArticleToc({
  headings,
}: {
  headings: { id: string; text: string }[];
}) {
  if (!headings.length) return null;

  return (
    <div className="border-l border-black/10 pl-5">
      <div className="space-y-4">
        {headings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className="block text-sm leading-6 text-slate-600 transition hover:text-[#1f1f26]"
          >
            {heading.text}
          </a>
        ))}
      </div>
    </div>
  );
}