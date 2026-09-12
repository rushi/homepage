import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages project site by default: https://rushi.github.io/homepage
// To move to a custom domain (e.g. rushi.dev): set SITE=https://rushi.dev and BASE=/
// then add a CNAME file containing the bare domain to public/.
const site = process.env.SITE ?? "https://rushi.github.io";
const base = process.env.BASE ?? "/homepage";

export default defineConfig({
  site,
  base,
  trailingSlash: "ignore",
  build: { inlineStylesheets: "auto" },
  vite: { plugins: [tailwindcss()] },
});
