/**
 * Refreshes src/data/repos.json from the GitHub API.
 * Run with `pnpm sync-repos`. The build also fetches live, but this snapshot is
 * what ships when the API is rate-limited or unreachable.
 */
import { writeFile } from "node:fs/promises";
import { featured, overrides, profile } from "../src/data/profile.ts";
import { resolveMissing, shapeRepo, toSlug } from "../src/lib/repo.ts";

const url = `https://api.github.com/users/${profile.github}/repos?type=owner&per_page=100&sort=pushed`;
const headers = { Accept: "application/vnd.github+json" };
if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const response = await fetch(url, { headers });
if (!response.ok) {
  console.error(`GitHub API ${response.status}: ${await response.text()}`);
  process.exit(1);
}

const all = await response.json();
const bySlug = new Map(all.map((repo) => [repo.full_name, repo]));
await resolveMissing(bySlug, featured, profile.github, headers, "throw");

const repos = featured.map((entry) => shapeRepo(bySlug.get(toSlug(entry, profile.github)), overrides[entry]));
const publicCount = all.filter((repo) => !repo.fork).length;

const payload = { generatedAt: new Date().toISOString(), publicCount, repos };
await writeFile(new URL("../src/data/repos.json", import.meta.url), `${JSON.stringify(payload, null, 2)}\n`);
console.log(`Wrote ${repos.length} repos (${publicCount} public sources total).`);
