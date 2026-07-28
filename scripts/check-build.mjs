#!/usr/bin/env node
/**
 * Post-build sanity check on .output/public.
 *
 * Nitro's `failOnError` only catches non-2xx responses. A component that throws
 * during SSR still prerenders "successfully" — as a page whose body is
 * "500 | Internal Server Error". This catches that, plus missing routes and
 * unresolved asset references, so a broken page cannot ship silently.
 */
import { readdir, readFile, stat } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, ".output", "public");

const REQUIRED = [
  "index.html",
  "about/index.html",
  "projects/index.html",
  "publications/index.html",
  "data-science/index.html",
  "blog/index.html",
  "tags/index.html",
  "search/index.html",
  "404/index.html",
  // GitHub Pages serves this for unknown paths; written by finalize-output.mjs.
  "404.html",
  "rss.xml",
  "search-index.json",
  ".nojekyll",
];

const errors = [];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

// 1. Required routes were emitted.
for (const rel of REQUIRED) {
  if (!(await exists(join(OUT, rel)))) errors.push(`missing from build output: ${rel}`);
}

const files = await walk(OUT);
const htmlFiles = files.filter((f) => f.endsWith(".html"));

if (htmlFiles.length === 0) errors.push("no HTML files were prerendered");

// 2. No page rendered an SSR error, and every page has real content.
for (const file of htmlFiles) {
  const rel = relative(OUT, file);
  const html = await readFile(file, "utf8");

  if (html.includes("Internal Server Error")) {
    errors.push(`${rel}: prerendered as an SSR error page`);
  }
  if (!/<title[^>]*>[^<]+<\/title>/.test(html)) {
    errors.push(`${rel}: has no <title>`);
  }
  // The app shell is ~14 kB of scripts even when the body failed to render.
  if (!html.includes('<div id="app">') || html.length < 2000) {
    errors.push(`${rel}: suspiciously small or missing app root`);
  }
}

// 3. Local assets referenced by HTML actually exist.
const referenced = new Set();
for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*\.[a-z0-9]{2,5})"/gi)) {
    referenced.add(m[1]);
  }
}
for (const ref of referenced) {
  if (!(await exists(join(OUT, ref.replace(/^\//, ""))))) {
    errors.push(`referenced asset not found in output: ${ref}`);
  }
}

if (errors.length) {
  console.error(`\ncheck-build: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("");
  process.exit(1);
}

console.log(
  `check-build: ok — ${htmlFiles.length} pages, ${referenced.size} local asset refs resolved`,
);
