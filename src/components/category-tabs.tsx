"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = ["All", "News", "Events", "Livestreams", "How-To's"];

export function CategoryTabs() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "All";

  function handleCategory(category: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <section className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const isActive = active === category;

        return (
          <button
            key={category}
            onClick={() => handleCategory(category)}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              isActive
                ? "bg-[#1f1f26] text-white"
                : "border border-black/10 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            {category}
          </button>
        );
      })}
    </section>
  );
}