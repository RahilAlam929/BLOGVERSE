"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [term, setTerm] = useState(searchParams.get("q") || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (term.trim()) {
      params.set("q", term.trim());
    } else {
      params.delete("q");
    }

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSearch} className="flex items-center gap-2">
      <input
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder="Search articles..."
        className="w-full rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm text-[#1f1f26] outline-none placeholder:text-slate-400"
      />
      <button
        type="submit"
        className="rounded-full border border-black/10 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}