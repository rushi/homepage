import { featured, overrides, profile } from "../data/profile";
import snapshot from "../data/repos.json";
import { resolveMissing, shapeRepo, toSlug, type ApiRepo, type Repo } from "./repo";

export type { Repo } from "./repo";

const API = `https://api.github.com/users/${profile.github}/repos?type=owner&per_page=100&sort=pushed`;

/**
 * Keep in step with the `.dot[data-lang="…"]` rules in src/styles/global.css.
 * A language with no entry here renders with the neutral "other" dot.
 */
export const LANGUAGE_TOKENS = {
  CSS: "css",
  PHP: "php",
  Python: "py",
  Shell: "shell",
  TypeScript: "ts",
  JavaScript: "js",
} as const;

export type LanguageToken = (typeof LANGUAGE_TOKENS)[keyof typeof LANGUAGE_TOKENS] | "other";

export function languageToken(language: string | null): LanguageToken {
  return LANGUAGE_TOKENS[language as keyof typeof LANGUAGE_TOKENS] ?? "other";
}

function order(byName: Map<string, ApiRepo>) {
  return featured.filter((name) => byName.has(name)).map((name) => shapeRepo(byName.get(name)!, overrides[name]));
}

/**
 * Runs once at build time. Falls back to the committed snapshot when the API is
 * rate-limited or offline, so a build never ships an empty index.
 */
export async function getRepos(): Promise<{ repos: Repo[]; publicCount: number; live: boolean }> {
  const snapshotRepos = featured
    .map((entry) => (snapshot.repos as Repo[]).find((repo) => repo.slug === toSlug(entry, profile.github)))
    .filter((repo): repo is Repo => Boolean(repo));
  const fallback = { live: false, repos: snapshotRepos, publicCount: snapshot.publicCount };

  try {
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    const token = process.env.GITHUB_TOKEN;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(API, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API ${response.status}`);
    }

    const all = (await response.json()) as (ApiRepo & { fork: boolean })[];
    const bySlug = new Map<string, ApiRepo>(all.map((repo) => [repo.full_name, repo]));
    await resolveMissing(bySlug, featured, profile.github, headers, "skip");

    const repos = order(bySlug);
    if (repos.length !== featured.length) {
      throw new Error(`Expected ${featured.length} featured repos, resolved ${repos.length}`);
    }

    const publicCount = all.filter((repo) => !repo.fork).length;
    return { live: true, repos, publicCount };
  } catch (error) {
    console.warn(`[github] falling back to committed snapshot: ${(error as Error).message}`);
    return fallback;
  }
}
