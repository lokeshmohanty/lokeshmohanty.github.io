#!/usr/bin/env node
/**
 * Post-processing on .output/public that the prerenderer doesn't do itself.
 *
 * GitHub Pages serves `/404.html` for unknown paths, but the prerenderer emits
 * the 404 route as `404/index.html`. Without this copy, visitors to a bad URL
 * get GitHub's default page instead of the site's own.
 */
import { copyFile, stat } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(root, ".output", "public");

const source = join(OUT, "404", "index.html");
const target = join(OUT, "404.html");

try {
  await stat(source);
} catch {
  console.error("finalize-output: 404/index.html was not prerendered");
  process.exit(1);
}

await copyFile(source, target);
console.log("finalize-output: wrote 404.html for GitHub Pages");
