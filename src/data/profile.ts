import { canary } from "../lib/canary.ts";

export const profile = {
  name: "Rushi Vishavadia",
  role: "Engineering Manager",
  company: { name: "Xola", url: "https://www.xola.com" },
  location: "Bangalore, India",
  avatar: "/avatar.jpg",
  analyticsId: "G-V3MMFC87M5",
  email: canary.email,
  github: "rushi",
  links: [
    { label: "GitHub", href: "https://github.com/rushi", handle: "@rushi" },
    { label: "Bluesky", href: "https://bsky.app/profile/rushi.io", handle: "@rushi.io" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/rushivishavadia/", handle: "rushivishavadia" },
    { label: "Email", href: `mailto:${canary.email}`, handle: canary.email },
  ],
} as const;

/** Repos featured on the page, in display order. Everything else on GitHub stays on GitHub. */
export const featured = [
  "xola/ui-kit",
  "mongotop-web",
  "gocd-mcp",
  "jstop",
  "frecency",
  "madring",
  "howzat",
  "css-grid-generator",
  "language-flashcards",
  "eslint-plugin-progress",
  "wakatime-node",
  "raycast-tealdeer",
  "gh-current-pr",
  "github-screenshot-taker",
  "server-name-generator",
] as const;

/** Written by hand where GitHub has no description, or where GitHub's is too long for a row. */
export const overrides: Record<string, { blurb?: string; tag?: string; npm?: string }> = {
  "xola/ui-kit": {
    blurb: "Xola's design system. React components on Tailwind, used across the seller and admin apps.",
    tag: "Design system",
    npm: "@xola/ui-kit",
  },
  "mongotop-web": {
    blurb: "A full-stack dashboard over currentOp, so you can see what a MongoDB cluster is doing right now.",
    tag: "Tool",
  },
  "gocd-mcp": {
    blurb: "An MCP server that lets an AI assistant read GoCD pipelines, stages and failing jobs.",
    tag: "MCP",
  },
  jstop: {
    blurb:
      "`ps -ef | grep node`, but useful. Finds the real node, bun and deno processes, skips the Electron noise, kills what you pick.",
    tag: "CLI",
    npm: "@rushiv/jstop",
  },
  frecency: {
    blurb: "Frequency plus recency ranking for search results. ESM-only TypeScript fork of Mixmax's original.",
    tag: "Library",
    npm: "@rushiv/frecency",
  },
  madring: { blurb: "Interactive map of the Spanish F1 Madring circuit.", tag: "Map" },
  howzat: {
    blurb: "Mutes cricket ads on a stream by audio fingerprint. Record the ad once, it mutes every time after.",
    tag: "Audio",
  },
  "css-grid-generator": {
    blurb: "A visual builder for CSS Grid and masonry layouts where you drag the tracks and copy out the CSS.",
    tag: "Generator",
  },
  "language-flashcards": {
    blurb: "Flashcards for learning a new language. Kannada first.",
    tag: "App",
  },
  "eslint-plugin-progress": {
    blurb: "Prints a progress bar while ESLint runs, for repos where a lint pass takes minutes.",
    tag: "ESLint",
    npm: "eslint-plugin-progressbar",
  },
  "wakatime-node": { blurb: "Node library for the Wakatime API.", tag: "Library", npm: "wakatime-node" },
  "raycast-tealdeer": { blurb: "Tealdeer (tldr) pages inside Raycast.", tag: "Raycast" },
  "gh-current-pr": {
    blurb: "gh extension that shows the PR for your current branch: title, URL, merge state, CI checks.",
    tag: "gh",
  },
  "github-screenshot-taker": {
    blurb: "Screenshots your GitHub profile on a schedule, then stitches the frames into a video.",
    tag: "Script",
  },
  "server-name-generator": { blurb: "Generates names for servers so you stop calling them db1.", tag: "CLI" },
};
