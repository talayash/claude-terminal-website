# ClaudeTerminal Website

Official website for [ClaudeTerminal](https://github.com/talayash/claude-terminal) - a modern multi-instance terminal manager for Claude Code.

**Live:** [https://claude-terminal.dev](https://claude-terminal.dev)

## Tech Stack

- [Astro](https://astro.build/) - static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) - styling
- [Inter Variable](https://rsms.me/inter/) via rsms.me CDN - single sans typeface
- [Vitest](https://vitest.dev/) - content-lint + build-smoke test harness
- [Vercel](https://vercel.com/) - hosting & deployment

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
npm run test:run  # Run the content-lint + build-smoke suite
```

## How It Stays Updated

- **Version number** is fetched from the [GitHub Releases API](https://api.github.com/repos/talayash/claude-terminal/releases/latest) at build time
- **Download links** are dynamically constructed from the latest version
- **Changelog** is sourced from `src/data/changelog.json`, synced from the main repo via the `sync-release.yml` workflow
- A **repository dispatch** from the main repo's release workflow triggers a rebuild on each new release

## Project Structure

```
src/
  layouts/Layout.astro        # Base HTML layout with SEO meta + Inter Variable
  components/
    Navbar.astro              # Slim status-bar navigation
    Hero.astro                # Centered pure-type hero with italic coral accent
    Features.astro            # Manifesto pattern (numbered rows)
    Screenshots.astro         # Editorial spread (1 large + 2 small)
    Download.astro            # Two-OS quiet blocks
    Footer.astro              # Three-zone slim footer
  pages/
    index.astro               # Landing page
    changelog.astro           # Release history (manifesto pattern)
    stat.astro                # Hidden telemetry dashboard
  data/
    changelog.json            # Release notes data
    features.json             # Feature descriptions
  styles/global.css           # Palette tokens, type scale, coral signature
tests/
  content-lint.test.js        # Enforces design conventions (palette, IA, coral discipline)
  build-smoke.test.js         # Verifies astro build completes
public/
  screenshots/                # App screenshots
  icons/                      # App icon
vitest.config.js              # Vitest configuration
vercel.json                   # Vercel deployment config
.github/workflows/
  deploy.yml                  # Build verification
  sync-release.yml            # Changelog sync from main repo
```

## Design

The site follows the "Quiet Product" spec at [`docs/superpowers/specs/2026-07-23-claude-like-ui-makeover-design.md`](docs/superpowers/specs/2026-07-23-claude-like-ui-makeover-design.md). Palette is paper (`#faf9f5`) + ink (`#252525`) + coral (`#c86a4a`). Single sans (Inter Variable). Coral appears in exactly 4 named places sitewide (nav status dot, section labels, feature indices, focus rings). No em-dash characters permitted in `src/**` or `README.md` (enforced by tests).

## License

MIT
