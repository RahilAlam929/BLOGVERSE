export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "No date";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "Invalid date";

  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}