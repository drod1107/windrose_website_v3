import Link from "next/link";
import { format } from "date-fns";
import { notFound } from "next/navigation";
import mdxComponents from "@/components/mdx";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { meta } = await getPostBySlug(slug);
  return { title: meta.title, description: meta.excerpt };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const { meta, Content, lastUpdated } = await getPostBySlug(slug);
    const related = getAllPosts()
      .filter(
        (p) =>
          p.slug !== meta.slug && p.tags.some((t) => meta.tags.includes(t)),
      )
      .slice(0, 3);

    return (
      <article className="prose dark:prose-invert max-w-none">
        <h1>{meta.title}</h1>
        <p className="text-sm text-gray-500">
          {format(new Date(meta.date), "MMMM d, yyyy")} · {meta.tags.join(", ")}
        </p>
        <Content components={mdxComponents} />
        <p className="text-sm text-gray-500 mt-8">
          Last updated: {format(new Date(lastUpdated), "MMMM d, yyyy")}
        </p>
        {related.length > 0 && (
          <section className="mt-8">
            <h3 className="text-xl font-semibold">Related posts</h3>
            <ul>
              {related.map((p) => (
                <li key={p.slug}>
                  <Link href={`/blog/${p.slug}`}>{p.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>
    );
  } catch {
    notFound();
  }
}
