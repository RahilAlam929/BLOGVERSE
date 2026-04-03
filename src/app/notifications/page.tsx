import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26] dark:bg-[#09090f] dark:text-white">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-black">Notifications</h1>
          <p className="mt-6 text-slate-600 dark:text-slate-300">
            Please login first.
          </p>
        </div>
      </main>
    );
  }

  const { data: notifications } = await supabase
    .from("notifications")
    .select(`
      *,
      posts(slug, title),
      profiles!notifications_actor_id_fkey(name, username, avatar_url)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#f3f3f5] px-4 py-10 text-[#1f1f26] dark:bg-[#09090f] dark:text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-black">Updates</h1>

        <div className="mt-8 space-y-4">
          {notifications?.length ? (
            notifications.map((item: any) => (
              <div
                key={item.id}
                className="rounded-2xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-[#111118]"
              >
                <div className="flex items-start gap-4">
                  {item.profiles?.avatar_url ? (
                    <img
                      src={item.profiles.avatar_url}
                      alt={item.profiles?.name || "Author"}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-slate-300" />
                  )}

                  <div className="min-w-0">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      <span className="font-semibold text-[#1f1f26] dark:text-white">
                        {item.profiles?.name || "Someone"}
                      </span>{" "}
                      {item.message}
                    </p>

                    {item.posts?.slug ? (
                      <Link
                        href={`/blog/${item.posts.slug}`}
                        className="mt-2 block text-sm font-medium text-violet-600"
                      >
                        {item.posts.title}
                      </Link>
                    ) : null}

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 dark:text-slate-400">
              No notifications yet.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}