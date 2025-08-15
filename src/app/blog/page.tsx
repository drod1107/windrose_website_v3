import Link from "next/link";
import { format } from "date-fns";
import { getAllPosts } from "@/lib/mdx";

const POSTS_PER_PAGE = 5;

export const metadata = {
  title: "Blog",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string>>;
}) {
  const resolved = await (searchParams as
    | Promise<Record<string, string>>
    | undefined);
  const params: Record<string, string> =
    (resolved as Record<string, string>) ?? {};
  const page = parseInt((params.page as string) ?? "1", 10);
  const allPosts = getAllPosts();
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;
  const posts = allPosts.slice(start, start + POSTS_PER_PAGE);

  return (
    <div className="space-y-8">
      {posts.map((post) => (
        <article key={post.slug} className="space-y-2">
          <h2 className="text-2xl font-bold">
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h2>
          <p className="text-sm text-gray-500">
            {format(new Date(post.date), "MMMM d, yyyy")} ·{" "}
            {post.tags.join(", ")}
          </p>
          <p>{post.excerpt}</p>
        </article>
      ))}
      <nav className="flex justify-between">
        {page > 1 ? (
          <Link href={`/blog?page=${page - 1}`}>Previous</Link>
        ) : (
          <span />
        )}
        {page < totalPages ? (
          <Link href={`/blog?page=${page + 1}`}>Next</Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
