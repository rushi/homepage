const BASE = import.meta.env.BASE_URL;

/** Joins a public-asset path onto Astro's configured base without doubling slashes. */
export function withBase(path: string) {
  const trimmedPath = path.startsWith("/") ? path : `/${path}`;
  const trimmedBase = BASE.endsWith("/") ? BASE.slice(0, -1) : BASE;
  return `${trimmedBase}${trimmedPath}`;
}

/** Spread onto an <a> so off-site destinations open in a new tab. */
export function externalAttrs(href: string): Record<string, string> {
  return /^https?:\/\//i.test(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
