/** One repo as the page renders it. */
export interface Repo {
  url: string;
  name: string;
  slug: string;
  stars: number;
  forks: number;
  topics: string[];
  pushedAt: string;
  tag: string | null;
  npm: string | null;
  description: string;
  language: string | null;
  homepage: string | null;
}

/** The subset of the GitHub repo payload this site reads. */
export interface ApiRepo {
  name: string;
  full_name: string;
  html_url: string;
  topics?: string[];
  pushed_at: string;
  forks_count: number;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  description: string | null;
}

type Override = { blurb?: string; tag?: string; npm?: string };

/** Shared by the build (src/lib/github.ts) and `pnpm sync-repos`, so the two cannot drift. */
export function shapeRepo(raw: ApiRepo, override?: Override): Repo {
  return {
    url: raw.html_url,
    name: raw.name,
    slug: raw.full_name,
    stars: raw.stargazers_count,
    forks: raw.forks_count,
    topics: raw.topics ?? [],
    pushedAt: raw.pushed_at,
    tag: override?.tag ?? null,
    npm: override?.npm ?? null,
    description: override?.blurb ?? raw.description ?? "",
    language: raw.language,
    homepage: raw.homepage && raw.homepage.length > 0 ? raw.homepage : null,
  };
}

/** A featured entry is either "name" under the default owner, or a full "owner/name". */
export function toSlug(entry: string, owner: string) {
  return entry.includes("/") ? entry : `${owner}/${entry}`;
}

/**
 * A featured repo can sit outside the owner listing: a fork taken over by the owner,
 * or a repo owned by an org. Resolves those with one direct lookup each, in parallel.
 */
export async function resolveMissing(
  bySlug: Map<string, ApiRepo>,
  featured: readonly string[],
  owner: string,
  headers: Record<string, string>,
  onMissing: "throw" | "skip",
) {
  const missing = featured.map((entry) => toSlug(entry, owner)).filter((slug) => !bySlug.has(slug));

  await Promise.all(
    missing.map(async (slug) => {
      const url = `https://api.github.com/repos/${slug}`;
      const response = await fetch(url, { headers });

      if (response.ok) {
        bySlug.set(slug, (await response.json()) as ApiRepo);
        return;
      }

      if (onMissing === "throw") {
        throw new Error(`Featured repo not found on GitHub: ${slug} (${response.status})`);
      }
    }),
  );
}

/**
 * Splits a blurb on backtick pairs. Odd-indexed segments are code spans, so a
 * blurb can name a command without the row rendering literal backticks.
 */
export function splitCode(text: string) {
  return text.split("`").map((value, index) => ({ value, isCode: index % 2 === 1 }));
}

/** The same blurb with backticks stripped, for plain-text contexts like attributes. */
export function stripCode(text: string) {
  return text.replaceAll("`", "");
}
