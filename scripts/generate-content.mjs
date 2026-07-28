#!/usr/bin/env node
/**
 * Builds post metadata and the search index from src/routes/blog/*.mdx.
 *
 * Why a build step rather than `import.meta.glob` in the app: globbing the MDX
 * modules eagerly to read frontmatter drags every post's *compiled component*
 * (and body text) into every page that lists posts. Emitting plain JSON keeps
 * listing pages independent of post count.
 *
 * Outputs:
 *   src/lib/posts.generated.json  — metadata only, imported by the app
 *   public/search-index.json      — metadata + body text, fetched by /search
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse as parseYaml } from "yaml";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const BLOG_DIR = join(root, "src", "routes", "blog");
const METADATA_OUT = join(root, "src", "lib", "posts.generated.json");
const SEARCH_OUT = join(root, "public", "search-index.json");

const WORDS_PER_MINUTE = 220;
const EXCERPT_LENGTH = 200;
const MAX_BODY = 8000;

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

/** Strip MDX/markdown syntax down to readable prose. */
function toPlainText(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ") // fenced code
    .replace(/^import\s.+$/gm, "") // MDX imports
    .replace(/^export\s.+$/gm, "") // MDX exports
    .replace(/<[^>]+>/g, " ") // JSX / HTML tags
    .replace(/\{[^}]*\}/g, " ") // JSX expressions
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links → text
    .replace(/^\s{0,3}#{1,6}\s+/gm, "") // headings
    .replace(/[*_`~>|]/g, "") // inline markers
    .replace(/\s+/g, " ")
    .trim();
}

async function readPost(file) {
  const slug = file.replace(/\.mdx$/, "");
  const source = await readFile(join(BLOG_DIR, file), "utf8");

  const match = source.match(FRONTMATTER);
  if (!match) {
    throw new Error(`${file}: missing YAML frontmatter (--- ... ---)`);
  }

  const data = parseYaml(match[1]) ?? {};
  if (!data.title) throw new Error(`${file}: frontmatter is missing "title"`);

  const text = toPlainText(source.slice(match[0].length));
  const words = text ? text.split(" ").length : 0;

  return {
    slug,
    href: `/blog/${slug}`,
    title: String(data.title),
    date: data.date ? String(data.date) : undefined,
    description: data.description ? String(data.description) : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    draft: Boolean(data.draft),
    readingTime: Math.max(1, Math.round(words / WORDS_PER_MINUTE)),
    excerpt:
      data.description ??
      (text.length > EXCERPT_LENGTH ? `${text.slice(0, EXCERPT_LENGTH).trimEnd()}…` : text),
    body: text.slice(0, MAX_BODY),
  };
}

const files = (await readdir(BLOG_DIR)).filter((f) => f.endsWith(".mdx"));
const all = await Promise.all(files.map(readPost));

// Drafts never reach a build. Newest first; undated posts sort last.
const published = all
  .filter((p) => !p.draft)
  .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

const metadata = published.map(({ body, draft, ...rest }) => rest);
const searchIndex = published.map(({ title, href, date, tags, excerpt, body }) => ({
  title,
  href,
  date: date ?? "",
  tags,
  excerpt,
  body,
}));

await writeFile(METADATA_OUT, `${JSON.stringify(metadata, null, 2)}\n`);
await writeFile(SEARCH_OUT, JSON.stringify(searchIndex));

console.log(
  `content: ${published.length} post(s), ${all.length - published.length} draft(s) skipped`,
);
