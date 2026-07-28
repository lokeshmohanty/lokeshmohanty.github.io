#!/usr/bin/env node
/**
 * Creates a new blog post from a template.
 *
 *   npm run new -- "My post title"          # from templates/post.md
 *   npm run new -- "Paper X" --paper        # from templates/paper.md
 */
import { readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const paper = args.includes("--paper");
const title = args.filter((a) => !a.startsWith("--")).join(" ").trim();

if (!title) {
  console.error('usage: npm run new -- "Post title" [--paper]');
  process.exit(1);
}

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const date = new Date().toISOString().slice(0, 10);
const filename = `${date}-${slug}.mdx`;
const target = join(root, "src", "routes", "blog", filename);

if (existsSync(target)) {
  console.error(`refusing to overwrite existing post: ${filename}`);
  process.exit(1);
}

const template = await readFile(
  join(root, "templates", paper ? "paper.md" : "post.md"),
  "utf8",
);

// Replace the template's frontmatter with real values, then add the import
// that every post needs for its header.
const body = template.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");

const frontmatter = [
  "---",
  `title: ${JSON.stringify(title)}`,
  `date: ${JSON.stringify(date)}`,
  'description: ""',
  "draft: true",
  "tags:",
  ...(paper ? ["  - paper-review"] : ["  - TODO"]),
  "---",
  "",
  'import PostHeader from "~/components/PostHeader";',
  "",
  "<PostHeader {...frontmatter} readingTime={readingTime} />",
  "",
].join("\n");

await writeFile(target, frontmatter + body);

console.log(`created src/routes/blog/${filename}`);
console.log("It is a draft — set `draft: false` in the frontmatter to publish.");
