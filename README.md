# ClaudeTerminal Website

Official website for [ClaudeTerminal](https://github.com/talayash/claude-terminal) — a modern multi-instance terminal manager for Claude Code.

**Live:** [https://claude-terminal.dev](https://claude-terminal.dev)

## Tech Stack

- [Astro](https://astro.build/) — static site generator
- [Tailwind CSS v4](https://tailwindcss.com/) — styling
- [Vercel](https://vercel.com/) — hosting & deployment

## Development

```bash
npm install
npm run dev       # Start dev server at localhost:4321
npm run build     # Build production site to ./dist/
npm run preview   # Preview production build locally
```

## How It Stays Updated

- **Version number** is fetched from the [GitHub Releases API](https://api.github.com/repos/talayash/claude-terminal/releases/latest) at build time
- **Download links** are dynamically constructed from the latest version
- **Changelog** is sourced from `src/data/changelog.json`, synced from the main repo via the `sync-release.yml` workflow
- A **repository dispatch** from the main repo's release workflow triggers a rebuild on each new release

## Project Structure

```
src/
  layouts/Layout.astro        # Base HTML layout with SEO meta
  components/
    Navbar.astro              # Fixed navigation bar
    Hero.astro                # Hero section with version badge & demo
    Features.astro            # Feature grid
    Screenshots.astro         # Screenshot gallery
    Download.astro            # Download section with installer links
    TechStack.astro           # Technology badges
    Footer.astro              # Site footer
  pages/
    index.astro               # Landing page
    changelog.astro           # Release history timeline
  data/
    changelog.json            # Release notes data
    features.json             # Feature descriptions
  styles/global.css           # Tailwind config & custom styles
public/
  screenshots/                # App screenshots & demo GIF
  icons/                      # App icon
vercel.json                   # Vercel deployment config
.github/workflows/
  deploy.yml                  # Build verification
  sync-release.yml            # Changelog sync from main repo
```

## License

MIT
