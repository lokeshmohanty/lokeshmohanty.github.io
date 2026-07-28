import generated from "./posts.generated.json";

/**
 * Post metadata, produced by `scripts/generate-content.mjs` at build time.
 * Deliberately plain JSON: importing the MDX modules here would pull every
 * post's compiled component into every page that lists posts.
 */
export interface Post {
  slug: string;
  href: string;
  title: string;
  date?: string;
  description?: string;
  excerpt: string;
  tags: string[];
  readingTime: number;
}

/** Published posts, newest first. Drafts are excluded at generation time. */
export const posts: Post[] = generated as Post[];

export function postsByTag(tag: string): Post[] {
  const needle = tag.toLowerCase();
  return posts.filter((p) => p.tags.some((t) => t.toLowerCase() === needle));
}

export interface TagCount {
  tag: string;
  slug: string;
  count: number;
}

export function allTags(): TagCount[] {
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, slug: tagSlug(tag), count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function tagSlug(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(date?: string): string {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
