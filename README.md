# homepage

Personal site for Rushi Vishavadia. Astro, Tailwind v4, deployed to GitHub Pages. Run it with `pnpm install && pnpm dev`.

## Repo list

The open-source index is driven by `src/data/profile.ts`:

- `featured`: the repo names shown on the page, in display order.
- `overrides`: a hand-written blurb and short tag per repo, used instead of the GitHub description.

`src/data/repos.json` is a committed snapshot. The build fetches live data from the GitHub API and falls back to the snapshot when the API is rate-limited or unreachable. Refresh the snapshot with:

```
pnpm sync-repos
```

Set `GITHUB_TOKEN` first to avoid the 60 requests/hour unauthenticated limit.

## Deploy

The workflow is manual. Trigger it from the Actions tab, or:

```
gh workflow run deploy.yml
```

Set `Settings > Pages > Source` to `GitHub Actions` once, before the first run.

## Custom domain

The site builds for `https://rushi.github.io/homepage` by default. To serve it from a custom domain, build with:

```
SITE=https://rushi.dev BASE=/ pnpm build
```

and add a `public/CNAME` file containing the bare domain.

## Design

The visual system lives in `tokens.css`. Every colour, font, space, radius and easing, in OKLCH, for both themes. Page CSS in `src/styles/global.css` references tokens by name and never inlines a raw value. Theme follows the OS by default; the toggle writes an override to `localStorage`, and toggling back into agreement with the OS clears it.
