# Claude-adjacent "Quiet Product" UI Makeover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the marketing site into a "Quiet Product" visual language (per `docs/superpowers/specs/2026-07-23-claude-like-ui-makeover-design.md`) - paper background, ink type, single sans, coral used only as a disciplined signature in exactly 4 named places. Cuts the homepage from 11 to 5 sections. Adds a content-lint test harness that enforces the design conventions.

**Architecture:** Static Astro 6 site. All changes are in Astro components + one CSS file + one new tests directory. No new pages, no new data files, no framework additions beyond adding Vitest as a devDependency for the content-lint tests. Existing data files (`features.json`, `changelog.json`) untouched. Existing GitHub-release download URLs preserved exactly.

**Tech Stack:** Astro 6.1.x, Tailwind CSS v4 (via `@tailwindcss/vite`), TypeScript, Inter Variable webfont via CDN, Vitest (new dev dependency) for content-lint tests.

**Verification model:** Static site with no logic to unit-test. Verification is two-layered: (1) automated content-lint tests via Vitest that enforce structural design conventions (no em-dashes, no banned color tokens, coral discipline, correct IA), and (2) manual browser check via `npm run dev` after each visual task. The plan calls out both explicitly.

---

## File Structure

**Files created:**
- `tests/content-lint.test.js` - Vitest tests enforcing design conventions
- `tests/build-smoke.test.js` - Vitest test verifying `astro build` completes

**Files modified:**
- `package.json` - add `vitest` devDependency, add `test` and `test:run` scripts
- `src/styles/global.css` - complete rewrite (palette, type, buttons, containers, hairlines, selection, focus)
- `src/layouts/Layout.astro` - Inter Variable preload, remove aurora/glass/scan-line layers
- `src/components/Navbar.astro` - slim status bar, coral dot signature
- `src/components/Hero.astro` - centered small hero, italic coral H1 word, no screenshot, preserve OS-detection JS
- `src/components/Features.astro` - manifesto pattern (numbered rows)
- `src/components/Screenshots.astro` - editorial spread (1 large + 2 small)
- `src/components/Download.astro` - two-OS-block layout, preserve download URLs and copy button
- `src/components/Footer.astro` - three-zone slim footer
- `src/pages/index.astro` - remove imports and instances of cut components
- `src/pages/changelog.astro` - manifesto pattern for releases
- `src/pages/stat.astro` - palette + type repaint

**Files deleted (unused after this plan):**
- `src/components/Trust.astro`
- `src/components/Parallel.astro`
- `src/components/Compare.astro`
- `src/components/ChangelogPreview.astro`
- `src/components/CallToAction.astro`
- `src/components/TechStack.astro`

---

## Task 1: Preflight - baseline snapshot

**Files:**
- Read: `package.json`, `src/pages/index.astro`
- Run: `npm install`, `npm run build`

- [ ] **Step 1: Ensure dependencies are installed**

Run: `npm install`
Expected: completes without errors. May show peer-dep warnings, safe to ignore.

- [ ] **Step 2: Run the current build to capture baseline**

Run: `npm run build`
Expected: `astro build` completes. Note the build output directory (`dist/`) and any warnings for later comparison.

- [ ] **Step 3: Start dev server and eyeball the current site**

Run in a background terminal: `npm run dev`
Open `http://localhost:4321/` in a browser. Confirm the current aurora + mono design renders: dark navy background, aurora glow, mono typography, all 11 sections present. This is the "before" state.

Leave the dev server running for subsequent tasks (every visual task verifies against this).

- [ ] **Step 4: No commit** (verification-only task)

---

## Task 2: Add Vitest and test infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`

- [ ] **Step 1: Install Vitest**

Run: `npm install --save-dev vitest@^2.1.0`
Expected: `vitest` added under `devDependencies` in `package.json`; `package-lock.json` updated.

- [ ] **Step 2: Add test scripts to package.json**

Modify the `scripts` block in `package.json` from:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro"
}
```

to:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "astro": "astro",
  "test": "vitest",
  "test:run": "vitest run"
}
```

- [ ] **Step 3: Create Vitest config**

Create `vitest.config.js` with:

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    testTimeout: 60_000,
    hookTimeout: 60_000,
  },
});
```

- [ ] **Step 4: Verify Vitest picks up an empty suite**

Create `tests/sanity.test.js`:

```js
import { describe, it, expect } from 'vitest';

describe('sanity', () => {
  it('runs vitest', () => {
    expect(1 + 1).toBe(2);
  });
});
```

Run: `npm run test:run`
Expected: 1 test passed. If failure, fix before continuing.

- [ ] **Step 5: Remove the sanity test**

Delete `tests/sanity.test.js`. Real tests come in Task 15.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json vitest.config.js
git commit -m "chore(test): add vitest and test scripts

Sets up the test harness for the upcoming content-lint suite that
enforces the Quiet Product design conventions (no em-dash, no banned
color tokens, coral usage discipline)."
```

---

## Task 3: Foundation - rewrite global.css

**Files:**
- Rewrite entirely: `src/styles/global.css`

This is the load-bearing task. All later component tasks assume these tokens and utilities exist.

- [ ] **Step 1: Replace `src/styles/global.css` entirely with the following content**

```css
/* ==========================================================================
   Claude Terminal marketing site - Quiet Product
   Spec: docs/superpowers/specs/2026-07-23-claude-like-ui-makeover-design.md

   Palette: paper + ink + coral. Neutrals are tints of paper.
   Type: Inter Variable, single family.
   Coral appears in exactly 4 named places sitewide. Discipline is the design.
   ========================================================================== */

@import "tailwindcss";

:root {
  --paper: #faf9f5;
  --ink: #252525;
  --coral: #c86a4a;
  --muted-label: #8a8a85;
  --muted-body: #4a4a45;
  --hairline: #e8e7e1;
  --frame: #e0dfd9;
}

@theme inline {
  --color-paper: var(--paper);
  --color-ink: var(--ink);
  --color-coral: var(--coral);
  --color-muted-label: var(--muted-label);
  --color-muted-body: var(--muted-body);
  --color-hairline: var(--hairline);
  --color-frame: var(--frame);
}

* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
  -webkit-text-size-adjust: 100%;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: 'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-feature-settings: 'cv02', 'cv11', 'ss01';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
}

/* ---------- Reset residual margins ---------- */
h1, h2, h3, h4, h5, h6, p, ul, ol, figure { margin: 0; padding: 0; }
ul, ol { list-style: none; }
img { display: block; max-width: 100%; height: auto; }
button { font-family: inherit; }

/* ---------- Typography scale ---------- */
.h1 {
  font-size: clamp(44px, 6.5vw, 64px);
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 1.05;
  color: var(--ink);
}
.h1 em {
  font-style: italic;
  color: var(--coral);
  font-weight: 500;
}

.h2 {
  font-size: clamp(22px, 3vw, 28px);
  font-weight: 500;
  letter-spacing: -0.1px;
  line-height: 1.2;
  color: var(--ink);
}

.h3 {
  font-size: 18px;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.3;
}

.kicker {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-label);
  line-height: 1.4;
}

.label {
  font-size: 12px;
  font-weight: 500;
  color: var(--muted-label);
  line-height: 1.4;
}

.body {
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: var(--muted-body);
  max-width: 62ch;
}

.body-sm {
  font-size: 13px;
  line-height: 1.55;
  color: var(--muted-body);
}

.meta {
  font-size: 12px;
  color: var(--muted-label);
  line-height: 1.4;
}

.subhead {
  font-size: 17px;
  line-height: 1.55;
  color: var(--muted-body);
  max-width: 52ch;
}

/* ---------- Coral signature (the 4 named places) ---------- */
.coral-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--coral);
  vertical-align: baseline;
  transform: translateY(-1px);
  margin-right: 8px;
  flex-shrink: 0;
}
.coral-num { color: var(--coral); font-variant-numeric: tabular-nums; }

/* ---------- Buttons ---------- */
.btn-primary {
  display: inline-block;
  background: var(--ink);
  color: var(--paper);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1;
  padding: 13px 22px;
  border-radius: 8px;
  border: none;
  text-decoration: none;
  cursor: pointer;
  transition: opacity 150ms ease-out;
}
.btn-primary:hover { opacity: 0.92; }

.btn-outline {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  color: var(--ink);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  line-height: 1;
  padding: 10px 14px;
  border: 1px solid var(--ink);
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
  transition: border-color 150ms ease-out, color 150ms ease-out;
}
.btn-outline:hover { border-color: var(--coral); color: var(--coral); }

.btn-ghost {
  display: inline-block;
  color: var(--muted-body);
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 12px 4px;
  cursor: pointer;
  transition: color 150ms ease-out;
}
.btn-ghost:hover { color: var(--ink); }

/* ---------- Links ---------- */
a {
  color: inherit;
  text-decoration: none;
}
a.underline-link {
  text-decoration: underline;
  text-decoration-color: transparent;
  text-underline-offset: 4px;
  transition: text-decoration-color 150ms ease-out, color 150ms ease-out;
}
a.underline-link:hover {
  text-decoration-color: var(--coral);
  color: var(--ink);
}

/* ---------- Layout containers ---------- */
.container-text { max-width: 640px; margin: 0 auto; padding: 0 20px; }
.container-wide { max-width: 960px; margin: 0 auto; padding: 0 20px; }

@media (min-width: 768px) {
  .container-text { padding: 0 32px; }
  .container-wide { padding: 0 32px; }
}

.section { padding: 96px 0; }
@media (max-width: 767px) { .section { padding: 64px 0; } }

/* ---------- Hairlines ---------- */
.hr { border: 0; border-top: 1px solid var(--hairline); }

/* ---------- Focus rings ---------- */
:focus { outline: none; }
:focus-visible {
  outline: 2px solid var(--coral);
  outline-offset: 2px;
  border-radius: 2px;
}

/* ---------- Selection ---------- */
::selection {
  background: var(--coral);
  color: var(--paper);
}
```

- [ ] **Step 2: Verify the site still builds**

Run: `npm run build`
Expected: build succeeds. The old site will look stripped/broken visually (old components still use old classes), but no build errors. If build errors, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(css): install Quiet Product palette + type foundation

Rewrites global.css with the paper/ink/coral token system, single sans
typography scale, hairline utilities, and coral focus rings. Removes
aurora, glass, scan-line, and gradient utilities from the previous
aesthetic. Components that still reference old class names will render
broken visually until their tasks run; build still succeeds."
```

---

## Task 4: Layout.astro - Inter Variable + minimal shell

**Files:**
- Rewrite: `src/layouts/Layout.astro`

- [ ] **Step 1: Read the current file to preserve site metadata**

Read `src/layouts/Layout.astro` to note existing `<title>` handling, meta tags, and any Vercel analytics/speed-insights inclusions.

- [ ] **Step 2: Replace `src/layouts/Layout.astro` with**

```astro
---
import '../styles/global.css';
import { Analytics } from '@vercel/analytics/astro';
import SpeedInsights from '@vercel/speed-insights/astro';

interface Props {
  title?: string;
  description?: string;
}
const {
  title = 'Claude Terminal - a terminal manager for Claude Code',
  description = 'Run Claude Code in parallel. A terminal manager for developers who spawn many Claude sessions at once.',
} = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#faf9f5" />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <link rel="preconnect" href="https://rsms.me/" crossorigin />
    <link rel="preload" as="style" href="https://rsms.me/inter/inter.css" />
    <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />

    <title>{title}</title>

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
  </head>
  <body>
    <slot />
    <Analytics />
    <SpeedInsights />
  </body>
</html>
```

Note: `rsms.me/inter` serves Inter Variable via CDN with proper caching. If the existing site preloaded another font, that reference is removed.

- [ ] **Step 3: Confirm the favicon and apple-touch-icon paths exist**

Run: `ls public/favicon.svg public/apple-touch-icon.png`
If either is missing, remove that `<link>` line from the head. Do not fabricate icon files.

- [ ] **Step 4: Verify build**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(layout): switch to Inter Variable, remove aurora shell

Replaces the previous aurora + glow + scan-line shell with a minimal
Quiet Product head + body. Inter Variable served via rsms.me CDN with
preconnect + preload. Body defaults to paper background, ink type."
```

---

## Task 5: Navbar.astro - slim status bar

**Files:**
- Rewrite: `src/components/Navbar.astro`

- [ ] **Step 1: Replace `src/components/Navbar.astro` with**

```astro
---
interface Props {
  version?: string;
}
const { version } = Astro.props;
---

<nav class="nav">
  <div class="nav-inner">
    <a href="/" class="wordmark">Claude Terminal</a>

    <div class="nav-links" id="nav-links">
      <a href="#features" class="underline-link nav-link">Features</a>
      <a href="#download" class="underline-link nav-link">Download</a>
      <a href="/changelog" class="underline-link nav-link">Changelog</a>
      <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer" class="underline-link nav-link">
        GitHub <span aria-hidden="true">&nearr;</span>
      </a>
      {version && (
        <span class="nav-version">
          <span class="coral-dot" aria-hidden="true"></span>v{version}
        </span>
      )}
    </div>

    <button class="nav-hamburger" id="nav-hamburger" aria-label="Toggle navigation" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 40;
    background: var(--paper);
    border-bottom: 1px solid var(--hairline);
  }
  .nav-inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 0 20px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }
  @media (min-width: 768px) {
    .nav-inner { padding: 0 32px; }
  }

  .wordmark {
    color: var(--ink);
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.1px;
  }

  .nav-links {
    display: flex;
    align-items: center;
    gap: 22px;
  }
  .nav-link {
    color: var(--muted-body);
    font-size: 13px;
    font-weight: 400;
  }
  .nav-version {
    color: var(--muted-label);
    font-size: 12px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
  }

  .nav-hamburger {
    display: none;
    background: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
  }
  .nav-hamburger span {
    display: block;
    width: 18px;
    height: 1.5px;
    background: var(--ink);
    margin: 4px 0;
    transition: transform 150ms ease-out, opacity 150ms ease-out;
  }

  @media (max-width: 767px) {
    .nav-hamburger { display: block; }
    .nav-links {
      display: none;
      position: absolute;
      top: 56px;
      left: 0;
      right: 0;
      background: var(--paper);
      border-bottom: 1px solid var(--hairline);
      flex-direction: column;
      align-items: flex-start;
      gap: 0;
      padding: 8px 20px 16px;
    }
    .nav-links.open { display: flex; }
    .nav-links .nav-link,
    .nav-links .nav-version {
      padding: 10px 0;
      width: 100%;
    }
  }
</style>

<script>
  const hamburger = document.getElementById('nav-hamburger');
  const links = document.getElementById('nav-links');
  hamburger?.addEventListener('click', () => {
    const open = links?.classList.toggle('open') ?? false;
    hamburger.setAttribute('aria-expanded', String(open));
  });
</script>
```

- [ ] **Step 2: Manual verification**

Refresh `http://localhost:4321/`. Look at just the nav bar (rest of the page will still be broken from the previous aesthetic):
- 56px slim bar, paper background, hairline bottom
- Wordmark "Claude Terminal" on the left
- Links on the right, coral dot before the version
- Resize to <768px width: hamburger appears, links collapse into a dropdown below the nav

If nav doesn't render or JS errors, fix before continuing.

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.astro
git commit -m "feat(nav): slim status-bar with wordmark + text links

Replaces the previous nav (whatever style it had) with the Quiet Product
slim bar: 56px, paper background, 1px hairline bottom border, wordmark
left, text links + coral-dot version right, hamburger dropdown on
mobile."
```

---

## Task 6: Hero.astro - centered small, italic H1

**Files:**
- Rewrite: `src/components/Hero.astro`

Preserves the existing OS-detection behavior (primary Download button rewrites href based on user's OS). Removes the hero screenshot (spec [03]).

- [ ] **Step 1: Replace `src/components/Hero.astro` with**

```astro
---
interface Props {
  version: string;
  stars?: number;
}
const { version } = Astro.props;

const releaseBase = 'https://github.com/talayash/claude-terminal/releases/latest/download';
const winInstaller = `${releaseBase}/ClaudeTerminal_${version}_x64-setup.exe`;
const macInstaller = `${releaseBase}/ClaudeTerminal_${version}_aarch64.dmg`;
---

<section class="hero">
  <div class="container-text hero-inner">
    <p class="kicker hero-kicker">
      <span class="coral-dot" aria-hidden="true"></span>v{version} · macOS + Windows
    </p>

    <h1 class="h1 hero-h1">
      Run Claude Code <em>in parallel.</em>
    </h1>

    <p class="subhead hero-sub">
      A terminal manager for developers who spawn many Claude sessions at once.
    </p>

    <div class="hero-cta">
      <a
        id="hero-primary-dl"
        class="btn-primary"
        href="#download"
        data-win={winInstaller}
        data-mac={macInstaller}
      >
        Download
      </a>
      <a
        class="btn-ghost"
        href="https://github.com/talayash/claude-terminal"
        target="_blank"
        rel="noopener noreferrer"
      >
        GitHub <span aria-hidden="true">&rarr;</span>
      </a>
    </div>
  </div>
</section>

<style>
  .hero { padding: 120px 0 96px; }
  @media (max-width: 767px) { .hero { padding: 64px 0 48px; } }

  .hero-inner { text-align: center; }
  .hero-kicker { margin-bottom: 18px; }
  .hero-h1 { margin-bottom: 20px; max-width: 18ch; margin-left: auto; margin-right: auto; }
  .hero-sub { margin: 0 auto 32px; }
  .hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
  }
</style>

<script>
  // Preserved from the aurora design: primary CTA auto-updates to the
  // detected OS installer. Falls back to scrolling to #download when
  // the platform is unknown.
  const el = document.getElementById('hero-primary-dl');
  if (el) {
    const ua = navigator.userAgent;
    const plat = (navigator.platform || '') + ' ' + ua;
    const isMac = /Mac|iPhone|iPad/i.test(plat);
    const isWin = /Win/i.test(plat);
    const win = el.getAttribute('data-win');
    const mac = el.getAttribute('data-mac');
    if (isMac && mac) {
      el.setAttribute('href', mac);
      el.textContent = 'Download for macOS';
    } else if (isWin && win) {
      el.setAttribute('href', win);
      el.textContent = 'Download for Windows';
    }
    // otherwise leave as "Download" - scrolls to #download with all options
  }
</script>
```

- [ ] **Step 2: Manual verification**

Refresh `http://localhost:4321/`. The hero should now be centered, quiet:
- Coral dot + `v{version} · macOS + Windows` kicker
- H1 with "in parallel" italic + coral
- Single-sentence sub in muted body color
- Ink pill "Download" (auto-detects OS - test by opening dev tools and simulating a Mac or Windows user agent)
- Ghost "GitHub →" link
- **No screenshot in the hero** - the section is pure type

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): centered pure-type hero with italic coral accent

Preserves OS-detecting primary Download link. Drops the previous
two-column layout with the demo.gif screenshot - the Screenshots
section below now carries product-image weight. Italic 'in parallel'
in coral is the site's single editorial gesture (spec [01])."
```

---

## Task 7: Features.astro - manifesto pattern

**Files:**
- Rewrite: `src/components/Features.astro`

- [ ] **Step 1: Replace `src/components/Features.astro` with**

```astro
---
import featuresJson from '../data/features.json';
type Feature = { title: string; description: string; icon?: string };
const features = featuresJson as Feature[];
---

<section id="features" class="section features">
  <div class="container-text">
    <p class="label features-label">
      <span class="coral-dot" aria-hidden="true"></span>Features
    </p>
    <h2 class="h2 features-h2">What the app does.</h2>

    <ol class="feature-list">
      {features.map((feature, i) => (
        <li class="feature-row">
          <span class="feature-num coral-num">{String(i + 1).padStart(2, '0')}</span>
          <div class="feature-body">
            <h3 class="feature-title">{feature.title}</h3>
            <p class="feature-desc">{feature.description}</p>
          </div>
        </li>
      ))}
    </ol>
  </div>
</section>

<style>
  .features-label { margin-bottom: 12px; display: inline-flex; align-items: center; }
  .features-h2 { margin-bottom: 40px; }

  .feature-list {
    border-top: 1px solid var(--hairline);
    border-bottom: 1px solid var(--hairline);
  }
  .feature-row {
    display: grid;
    grid-template-columns: 40px 1fr;
    gap: 16px;
    padding: 22px 0;
    border-top: 1px solid var(--hairline);
    align-items: baseline;
  }
  .feature-row:first-child { border-top: none; }

  .feature-num {
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    padding-top: 2px;
  }
  .feature-title {
    font-size: 16px;
    font-weight: 500;
    color: var(--ink);
    line-height: 1.35;
    margin-bottom: 6px;
  }
  .feature-desc {
    font-size: 14px;
    line-height: 1.55;
    color: var(--muted-body);
    max-width: 56ch;
  }

  @media (max-width: 480px) {
    .feature-row { grid-template-columns: 32px 1fr; gap: 12px; padding: 18px 0; }
    .feature-num { font-size: 12px; }
    .feature-title { font-size: 15px; }
  }
</style>
```

- [ ] **Step 2: Manual verification**

Refresh `http://localhost:4321/`. Scroll to the features section:
- `● Features` label + `What the app does.` H2
- 6 numbered rows, coral 01/02/03/... indices, ink titles, muted descriptions
- Hairline dividers between every row
- No icons, no thumbnails, no card backgrounds

- [ ] **Step 3: Commit**

```bash
git add src/components/Features.astro
git commit -m "feat(features): manifesto pattern with numbered rows

Replaces the previous card/grid treatment with the spec's manifesto
pattern: numbered rows, coral index numerals, hairline dividers,
ink titles + muted-body descriptions. Preserves the 6 features from
features.json unchanged; the icon field is now unused."
```

---

## Task 8: Screenshots.astro - editorial spread

**Files:**
- Rewrite: `src/components/Screenshots.astro`
- Read (do not modify): `public/screenshots/*.png` to confirm which filenames exist

- [ ] **Step 1: Inventory available screenshots**

Run: `ls public/screenshots/`
Note the actual filenames. The spec calls for `main-view.png`, `grid-view.png`, and `settings.png` in the editorial spread; if any of these three don't exist, substitute the closest equivalent from the available list (e.g. `welcome.png` if `settings.png` is missing).

- [ ] **Step 2: Replace `src/components/Screenshots.astro` with**

```astro
---
// Editorial spread: 1 large left + 2 small stacked right. Native aspect ratios preserved.
const screenshots = {
  main: { file: 'main-view.png', alt: 'ClaudeTerminal main view with active sessions', caption: 'Main view' },
  grid: { file: 'grid-view.png', alt: 'Grid layout of up to 8 terminals', caption: 'Grid layout' },
  settings: { file: 'settings.png', alt: 'Settings panel', caption: 'Settings' },
};
---

<section id="screenshots" class="section screenshots">
  <div class="container-wide">
    <p class="label screenshots-label">
      <span class="coral-dot" aria-hidden="true"></span>The app
    </p>
    <h2 class="h2 screenshots-h2">A quick look.</h2>

    <div class="spread">
      <figure class="frame frame-big">
        <img src={`/screenshots/${screenshots.main.file}`} alt={screenshots.main.alt} loading="lazy" decoding="async" />
      </figure>
      <figure class="frame frame-small">
        <img src={`/screenshots/${screenshots.grid.file}`} alt={screenshots.grid.alt} loading="lazy" decoding="async" />
      </figure>
      <figure class="frame frame-small">
        <img src={`/screenshots/${screenshots.settings.file}`} alt={screenshots.settings.alt} loading="lazy" decoding="async" />
      </figure>
    </div>

    <p class="meta screenshots-cap">
      {screenshots.main.caption}, {screenshots.grid.caption}, {screenshots.settings.caption}.
    </p>
  </div>
</section>

<style>
  .screenshots-label { margin-bottom: 12px; display: inline-flex; align-items: center; }
  .screenshots-h2 { margin-bottom: 40px; }

  .spread {
    display: grid;
    grid-template-columns: 1fr;
    gap: 16px;
  }
  @media (min-width: 768px) {
    .spread {
      grid-template-columns: 1.6fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 20px;
    }
    .frame-big { grid-row: 1 / 3; }
  }

  .frame {
    margin: 0;
    border: 1px solid var(--frame);
    border-radius: 4px;
    overflow: hidden;
    background: var(--paper);
  }
  .frame img { width: 100%; height: 100%; object-fit: cover; display: block; }

  .screenshots-cap {
    margin-top: 16px;
    text-align: right;
  }

  @media (max-width: 767px) {
    .frame img { object-fit: contain; }
  }
</style>
```

- [ ] **Step 3: Manual verification**

Refresh `http://localhost:4321/`. Scroll to the screenshots section:
- `● The app` label + `A quick look.` H2
- Editorial 3-image spread on desktop: 1 large left, 2 small right stacked
- Thin 1px frame around each, no shadow, no glow
- Caption line below in muted-label
- Mobile: all three stack vertically

- [ ] **Step 4: Commit**

```bash
git add src/components/Screenshots.astro
git commit -m "feat(screenshots): editorial spread with 1 large + 2 small

Asymmetric grid on desktop, stacks on mobile. Thin 1px frame, no shadow.
Native aspect ratios preserved via object-fit: cover (contain on mobile
where cropping would hide UI). Caption below is a single comma-separated
line in muted-label."
```

---

## Task 9: Download.astro - two-OS quiet blocks

**Files:**
- Rewrite: `src/components/Download.astro`

Preserves: (1) exact GitHub release URLs, (2) copy-to-clipboard on the npm command, (3) code-signing first-run note.

- [ ] **Step 1: Replace `src/components/Download.astro` with**

```astro
---
interface Props { version: string }
const { version } = Astro.props;

const releaseBase = 'https://github.com/talayash/claude-terminal/releases/latest/download';

const artifacts = {
  macos: [
    { label: 'Apple Silicon', file: `ClaudeTerminal_${version}_aarch64.dmg` },
    { label: 'Intel',         file: `ClaudeTerminal_${version}_x64.dmg` },
  ],
  windows: [
    { label: 'NSIS (recommended)', file: `ClaudeTerminal_${version}_x64-setup.exe` },
    { label: 'MSI',                file: `ClaudeTerminal_${version}_x64_en-US.msi` },
  ],
} as const;
---

<section id="download" class="section download">
  <div class="container-text">
    <p class="label download-label">
      <span class="coral-dot" aria-hidden="true"></span>Download
    </p>
    <h2 class="h2 download-h2">Universal binaries, direct from GitHub Releases.</h2>

    <div class="prereq">
      <p class="meta prereq-line">Requires Node.js 18+ and Claude Code installed globally.</p>
      <div class="prereq-cmd">
        <code>npm i -g @anthropic-ai/claude-code</code>
        <button
          class="prereq-copy"
          data-copy="npm i -g @anthropic-ai/claude-code"
          aria-label="Copy install command"
        >copy</button>
      </div>
    </div>

    <div class="os-blocks">
      <div class="os-block">
        <h3 class="h3 os-name">macOS</h3>
        <p class="meta os-req">macOS 11+</p>
        <div class="artifacts">
          {artifacts.macos.map(a => (
            <a class="btn-outline artifact" href={`${releaseBase}/${a.file}`}>
              <span>{a.file}</span>
              <span class="artifact-tag">{a.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div class="os-block">
        <h3 class="h3 os-name">Windows</h3>
        <p class="meta os-req">Windows 10+</p>
        <div class="artifacts">
          {artifacts.windows.map(a => (
            <a class="btn-outline artifact" href={`${releaseBase}/${a.file}`}>
              <span>{a.file}</span>
              <span class="artifact-tag">{a.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>

    <p class="download-note body-sm">
      Builds are not code-signed yet. On macOS, right-click the app then choose Open
      (or run <code>xattr -dr com.apple.quarantine /Applications/ClaudeTerminal.app</code>).
      On Windows, SmartScreen shows a warning - click More info then Run anyway. The source is on GitHub.
    </p>
  </div>
</section>

<style>
  .download-label { margin-bottom: 12px; display: inline-flex; align-items: center; }
  .download-h2 { margin-bottom: 32px; }

  .prereq {
    padding: 20px;
    border: 1px solid var(--hairline);
    border-radius: 8px;
    background: transparent;
    margin-bottom: 40px;
  }
  .prereq-line { margin-bottom: 12px; }
  .prereq-cmd {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }
  .prereq-cmd code {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 13px;
    color: var(--ink);
    background: transparent;
    padding: 0;
  }
  .prereq-copy {
    font-family: inherit;
    font-size: 12px;
    color: var(--muted-label);
    background: transparent;
    border: 1px solid var(--hairline);
    border-radius: 4px;
    padding: 4px 10px;
    cursor: pointer;
    transition: color 150ms ease-out, border-color 150ms ease-out;
  }
  .prereq-copy:hover { color: var(--coral); border-color: var(--coral); }
  .prereq-copy.done { color: var(--coral); border-color: var(--coral); }

  .os-blocks {
    display: grid;
    grid-template-columns: 1fr;
    gap: 32px;
  }
  @media (min-width: 640px) {
    .os-blocks { grid-template-columns: 1fr 1fr; gap: 40px; }
  }

  .os-name { margin-bottom: 4px; }
  .os-req { margin-bottom: 16px; }

  .artifacts {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .artifact {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 14px;
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 12px;
    line-height: 1.4;
  }
  .artifact-tag {
    font-family: 'Inter Variable', 'Inter', sans-serif;
    font-size: 11px;
    color: var(--muted-label);
    white-space: nowrap;
  }

  .download-note {
    margin-top: 32px;
    font-size: 12px;
    color: var(--muted-label);
    line-height: 1.6;
  }
  .download-note code {
    font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11.5px;
    color: var(--ink);
    background: transparent;
    padding: 0 2px;
  }
</style>

<script>
  document.querySelectorAll('.prereq-copy').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy') || '';
      try {
        await navigator.clipboard.writeText(text);
        const prev = btn.textContent;
        btn.textContent = 'copied';
        btn.classList.add('done');
        setTimeout(() => { btn.textContent = prev; btn.classList.remove('done'); }, 1400);
      } catch { /* clipboard blocked, no-op */ }
    });
  });
</script>
```

- [ ] **Step 2: Manual verification**

Refresh `http://localhost:4321/`. Scroll to the download section:
- `● Download` label + H2
- Prereq block with `npm i -g @anthropic-ai/claude-code` and a copy button - click it and verify clipboard has the string
- Two OS columns (macOS left, Windows right on desktop; stacked mobile), each with 2 outlined artifact buttons showing the exact filename
- Hover an artifact button - coral border on hover
- Small first-run note below

- [ ] **Step 3: Commit**

```bash
git add src/components/Download.astro
git commit -m "feat(download): quiet two-OS block layout

Preserves the exact GitHub release URLs, the npm copy-to-clipboard
command, and the code-signing first-run note. Drops the OS-tabs switcher
and the coral 'step' cards from the previous design. Artifact
buttons are plain outlined pills with hover-to-coral borders."
```

---

## Task 10: Footer.astro - three-zone slim

**Files:**
- Rewrite: `src/components/Footer.astro`

- [ ] **Step 1: Replace `src/components/Footer.astro` with**

```astro
---
interface Props { version?: string }
const { version } = Astro.props;

// Build date at build time. Format: "23 Jul 2026"
const buildDate = new Date().toLocaleDateString('en-GB', {
  day: '2-digit', month: 'short', year: 'numeric',
});
---

<footer class="footer">
  <div class="container-wide footer-inner">
    <div class="footer-brand">
      <p class="footer-wordmark">Claude Terminal</p>
      <p class="footer-tagline">A terminal manager for Claude Code.</p>
    </div>

    <nav class="footer-links" aria-label="Footer">
      <a href="#features" class="footer-link underline-link">Features</a>
      <a href="#download" class="footer-link underline-link">Download</a>
      <a href="/changelog" class="footer-link underline-link">Changelog</a>
      <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer" class="footer-link underline-link">
        GitHub <span aria-hidden="true">&nearr;</span>
      </a>
      <a href="https://github.com/talayash/claude-terminal/blob/main/LICENSE" target="_blank" rel="noopener noreferrer" class="footer-link underline-link">
        MIT <span aria-hidden="true">&nearr;</span>
      </a>
    </nav>

    <div class="footer-meta">
      {version && <span>v{version}</span>}
      {version && <span aria-hidden="true"> · </span>}
      <span>built {buildDate}</span>
    </div>
  </div>
</footer>

<style>
  .footer {
    border-top: 1px solid var(--hairline);
    padding: 40px 0;
    background: var(--paper);
  }
  .footer-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 24px;
  }
  @media (min-width: 768px) {
    .footer-inner {
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 40px;
    }
  }

  .footer-wordmark {
    font-size: 14px;
    font-weight: 500;
    color: var(--ink);
    margin-bottom: 4px;
  }
  .footer-tagline {
    font-size: 12px;
    color: var(--muted-label);
  }

  .footer-links {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    justify-content: flex-start;
  }
  @media (min-width: 768px) { .footer-links { justify-content: center; } }
  .footer-link {
    font-size: 13px;
    color: var(--muted-body);
  }

  .footer-meta {
    font-size: 12px;
    color: var(--muted-label);
  }
  @media (min-width: 768px) { .footer-meta { text-align: right; } }
</style>
```

- [ ] **Step 2: Manual verification**

Refresh `http://localhost:4321/`. Scroll to the footer:
- 3-zone layout on desktop (brand left, links center, meta right); stacks on mobile
- Hairline top border, paper background
- No coral dot anywhere in the footer (spec [03])
- `built {date}` visible on the right in muted-label

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): three-zone slim footer

Wordmark + tagline left, link list center, version + build date right.
Stacks vertically on mobile. Uses paper + hairline; no coral dot in the
footer per spec [03] (quiet coda)."
```

---

## Task 11: index.astro - cut 6 sections

**Files:**
- Rewrite: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro` with**

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
import Features from '../components/Features.astro';
import Screenshots from '../components/Screenshots.astro';
import Download from '../components/Download.astro';
import Footer from '../components/Footer.astro';

// Fetch latest version + star count from GitHub at build time.
let version = '1.26.0'; // fallback, keep in sync with latest release
let stars: number | undefined;
try {
  const [relRes, repoRes] = await Promise.all([
    fetch('https://api.github.com/repos/talayash/claude-terminal/releases/latest', {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
    fetch('https://api.github.com/repos/talayash/claude-terminal', {
      headers: { Accept: 'application/vnd.github.v3+json' },
    }),
  ]);
  if (relRes.ok) {
    const data = await relRes.json();
    version = data.tag_name?.replace(/^v/, '') || version;
  } else {
    console.warn(`GitHub releases API returned ${relRes.status}, using fallback version ${version}`);
  }
  if (repoRes.ok) {
    const repo = await repoRes.json();
    if (typeof repo.stargazers_count === 'number') stars = repo.stargazers_count;
  }
} catch (e) {
  console.warn(`Failed to fetch GitHub metadata: ${e}, using fallback version ${version}`);
}
---

<Layout title="Claude Terminal - run Claude Code in parallel">
  <Navbar version={version} />
  <Hero version={version} stars={stars} />
  <Features />
  <Screenshots />
  <Download version={version} />
  <Footer version={version} />
</Layout>
```

The 6 cut components (`Trust`, `Parallel`, `Compare`, `ChangelogPreview`, `CallToAction`, `TechStack`) are no longer imported. Their files stay on disk for now; Task 14 deletes them.

- [ ] **Step 2: Verify build and dev preview**

Run: `npm run build`
Expected: build succeeds. No warnings about missing components.

Refresh `http://localhost:4321/`. Confirm the homepage renders top-to-bottom as: **Nav, Hero, Features, Screenshots, Download, Footer.** No other sections should appear.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): cut 6 sections, land on 5 + footer

Homepage IA is now Nav, Hero, Features, Screenshots, Download, Footer.
Trust, Parallel, Compare, ChangelogPreview, CallToAction, and TechStack
are no longer imported. Component files remain on disk (deleted in a
follow-up task after the site is verified end-to-end)."
```

---

## Task 12: changelog.astro - manifesto pattern

**Files:**
- Rewrite: `src/pages/changelog.astro`

- [ ] **Step 1: Read `src/data/changelog.json` to confirm shape**

Read the file. Note the top-level structure (typically an array of release objects with `version`, `date`, and either `notes` or `entries` fields).

- [ ] **Step 2: Replace `src/pages/changelog.astro` with the following, adjusting the field access to match the JSON shape from step 1**

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import changelogJson from '../data/changelog.json';

// If changelog.json uses a different shape (e.g. { releases: [...] }),
// update this destructure. Field names below match the current shape
// (top-level array of { version, date, notes: string[] }); tweak if the
// on-disk shape differs.
type Release = {
  version: string;
  date: string;
  notes?: string[];
  entries?: string[];
};
const releases = changelogJson as Release[];
---

<Layout title="Changelog - Claude Terminal" description="Release history for Claude Terminal.">
  <Navbar />
  <main class="changelog section">
    <div class="container-text">
      <p class="label changelog-label">
        <span class="coral-dot" aria-hidden="true"></span>Changelog
      </p>
      <h1 class="h2 changelog-h1">Release history.</h1>

      <ol class="release-list">
        {releases.map(r => (
          <li class="release">
            <div class="release-head">
              <span class="release-version coral-num">v{r.version}</span>
              <span class="release-date">{r.date}</span>
            </div>
            <ul class="release-notes">
              {(r.notes ?? r.entries ?? []).map(note => (
                <li class="release-note">{note}</li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </div>
  </main>
  <Footer />
</Layout>

<style>
  .changelog-label { margin-bottom: 12px; display: inline-flex; align-items: center; }
  .changelog-h1 { margin-bottom: 40px; }

  .release-list {
    border-top: 1px solid var(--hairline);
  }
  .release {
    padding: 24px 0;
    border-bottom: 1px solid var(--hairline);
  }
  .release-head {
    display: flex;
    align-items: baseline;
    gap: 12px;
    margin-bottom: 12px;
  }
  .release-version {
    font-size: 15px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .release-date {
    font-size: 12px;
    color: var(--muted-label);
  }

  .release-notes {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .release-note {
    font-size: 14px;
    line-height: 1.6;
    color: var(--muted-body);
    padding-left: 18px;
    position: relative;
  }
  .release-note::before {
    content: '';
    position: absolute;
    left: 4px;
    top: 10px;
    width: 4px;
    height: 4px;
    border-radius: 999px;
    background: var(--muted-label);
  }
</style>
```

**Important:** If `src/data/changelog.json` has a nested shape (e.g. `{ releases: [...] }` or version objects contain a `features` field with objects like `{ description, area }`), adjust the type + rendering above to match. The intent is: for each release, print `v{version}` in coral + date in muted, then bullet each note underneath. Do not modify the JSON file.

- [ ] **Step 3: Verify build + browser**

Run: `npm run build` - expect success.

Open `http://localhost:4321/changelog`. Confirm:
- Slim nav on top
- `● Changelog` label + `Release history.` heading
- Reverse-chronological list of releases, coral `v1.x.y` + muted date, muted bullet points below each
- Footer at bottom

- [ ] **Step 4: Commit**

```bash
git add src/pages/changelog.astro
git commit -m "feat(changelog): manifesto pattern for release history

Replaces the previous marquee + git-log-style changelog with a quiet
manifesto pattern: coral v-numbers, muted dates, plain bulleted notes,
hairline dividers. Data source (changelog.json) unchanged."
```

---

## Task 13: stat.astro - palette repaint

**Files:**
- Modify: `src/pages/stat.astro`

Scope: repaint colors + type only. Do not change chart data pipelines, KPI logic, or the JS in the script block beyond token references.

- [ ] **Step 1: Read the current `src/pages/stat.astro` in full**

Note every place that uses aurora-era colors (dark navy backgrounds, `#d97757` coral variant, slate greys) and every use of `font-mono`. Also note the existing chart-rendering JS.

- [ ] **Step 2: Global find-and-replace within the file**

Apply these token substitutions everywhere they appear in the file, including within `<style>` blocks, class attributes, and any inline color usages in the script:

| Old (aurora era) | New (Quiet Product) |
|---|---|
| `bg-[#0a0a0f]` / `bg-slate-950` / any dark bg | `bg-paper` or `style="background: var(--paper)"` |
| `text-white` | `text-[var(--ink)]` |
| `text-[#d97757]` or coral variants | `text-[var(--coral)]` |
| `text-slate-200` / `text-slate-300` / `text-slate-400` | `text-[var(--muted-body)]` |
| `text-slate-500` / `text-slate-600` | `text-[var(--muted-label)]` |
| `font-mono` (except on numeric KPI displays where tabular-nums is desired) | Remove; body uses Inter Variable |
| Any purple/cyan/lime/navy accents | Remove or replace with `--coral` if that element carries emphasis |
| Chart stroke: bright neon | Chart stroke: `#252525` (ink) primary, `#c86a4a` (coral) accent |
| Chart fill: neon variant | Chart fill: `rgba(200,106,74,0.12)` |

Keep `font-variant-numeric: tabular-nums` (or the equivalent Tailwind `tabular-nums`) on KPI number displays. That's not `font-mono` - it's a numeric feature of the sans font.

- [ ] **Step 3: Confirm nothing behavioral changed**

Run: `npm run build`
Expected: build succeeds.

Open `http://localhost:4321/stat`. The page should:
- Have a paper background, ink text, coral for the emphasis KPI numbers (e.g. active-now)
- Charts render with ink strokes + coral accent fills; grid lines in `--hairline`
- All KPI cells still populate from the underlying API endpoints (open the network tab, verify `/api/stats*` still hits and JSON parses)

If any KPI shows the placeholder `-` instead of a number, the API call may have failed (not a design issue but note it as pre-existing).

- [ ] **Step 4: Commit**

```bash
git add src/pages/stat.astro
git commit -m "feat(stat): repaint palette + type to Quiet Product

Same telemetry logic, new skin. Aurora backgrounds and slate greys
swap for paper/ink/coral tokens. Chart strokes on ink, accents on
coral. Font drops font-mono (tabular-nums preserved for KPI numerals).
KPI data pipeline and chart rendering unchanged."
```

---

## Task 14: Delete unused component files

**Files:**
- Delete: `src/components/Trust.astro`
- Delete: `src/components/Parallel.astro`
- Delete: `src/components/Compare.astro`
- Delete: `src/components/ChangelogPreview.astro`
- Delete: `src/components/CallToAction.astro`
- Delete: `src/components/TechStack.astro`

- [ ] **Step 1: Confirm no other file imports these six**

Use the Grep tool with the pattern `(Trust|Parallel|Compare|ChangelogPreview|CallToAction|TechStack)` scoped to `src/` and file types astro/ts/tsx/js.

Expected: no matches (or only matches inside these files themselves). If any other file still imports them, that's a bug from an earlier task - fix that file before deleting.

- [ ] **Step 2: Delete the six files**

```bash
rm src/components/Trust.astro
rm src/components/Parallel.astro
rm src/components/Compare.astro
rm src/components/ChangelogPreview.astro
rm src/components/CallToAction.astro
rm src/components/TechStack.astro
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: build succeeds with no missing-import errors.

- [ ] **Step 4: Commit**

```bash
git add -A src/components/
git commit -m "chore(components): remove six components cut from homepage

Trust, Parallel, Compare, ChangelogPreview, CallToAction, and TechStack
are no longer imported anywhere. Removing them from the tree so the
component directory reflects what actually renders."
```

---

## Task 15: Content-lint tests

**Files:**
- Create: `tests/content-lint.test.js`
- Create: `tests/build-smoke.test.js`

These enforce the design conventions from the spec so they can't silently regress.

- [ ] **Step 1: Create `tests/content-lint.test.js` with**

```js
import { describe, it, expect } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';

const ROOT = new URL('../', import.meta.url).pathname;

async function walk(dir, exts) {
  const results = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name.startsWith('.')) continue;
      results.push(...(await walk(full, exts)));
    } else if (exts.includes(extname(e.name))) {
      results.push(full);
    }
  }
  return results;
}

describe('Copy conventions', () => {
  it('no em-dash characters in src/**', async () => {
    const files = await walk(join(ROOT, 'src'), ['.astro', '.ts', '.tsx', '.js', '.jsx', '.css', '.json', '.md']);
    const offenders = [];
    for (const f of files) {
      const content = await readFile(f, 'utf8');
      if (content.includes('—')) offenders.push(f.replace(ROOT, ''));
    }
    expect(offenders, `Em-dash (U+2014) found in: ${offenders.join(', ')}`).toEqual([]);
  });

  it('no em-dash in README.md', async () => {
    const content = await readFile(join(ROOT, 'README.md'), 'utf8');
    expect(content.includes('—')).toBe(false);
  });
});

describe('Palette discipline', () => {
  it('global.css declares the paper/ink/coral tokens', async () => {
    const css = await readFile(join(ROOT, 'src/styles/global.css'), 'utf8');
    expect(css).toMatch(/--paper:\s*#faf9f5/);
    expect(css).toMatch(/--ink:\s*#252525/);
    expect(css).toMatch(/--coral:\s*#c86a4a/);
  });

  it('global.css does not use banned aesthetic tokens', async () => {
    const css = await readFile(join(ROOT, 'src/styles/global.css'), 'utf8');
    const banned = [
      /a3e635/i,           // lime from glitch aesthetic
      /ec4899/i,           // magenta from glitch aesthetic
      /06b6d4/i,           // cyan from glitch aesthetic
      /\baurora\b/i,       // aurora utility class
      /\bglass\b/i,        // glass utility class
      /\bscan-?line\b/i,   // scan-line utility
    ];
    for (const pattern of banned) {
      expect(css, `global.css contains banned token matching ${pattern}`).not.toMatch(pattern);
    }
  });
});

describe('Homepage IA', () => {
  it('index.astro imports exactly the 5 target components + Layout + Nav + Footer', async () => {
    const src = await readFile(join(ROOT, 'src/pages/index.astro'), 'utf8');
    const expectedImports = ['Layout', 'Navbar', 'Hero', 'Features', 'Screenshots', 'Download', 'Footer'];
    for (const name of expectedImports) {
      expect(src, `index.astro missing import: ${name}`).toMatch(new RegExp(`import\\s+${name}\\s+from`));
    }
    const bannedImports = ['Trust', 'Parallel', 'Compare', 'ChangelogPreview', 'CallToAction', 'TechStack'];
    for (const name of bannedImports) {
      expect(src, `index.astro still imports removed component: ${name}`).not.toMatch(new RegExp(`import\\s+${name}\\s+from`));
    }
  });

  it('the six cut components no longer exist on disk', async () => {
    const gone = ['Trust', 'Parallel', 'Compare', 'ChangelogPreview', 'CallToAction', 'TechStack'];
    for (const name of gone) {
      const path = join(ROOT, `src/components/${name}.astro`);
      let exists = false;
      try {
        await readFile(path, 'utf8');
        exists = true;
      } catch {
        exists = false;
      }
      expect(exists, `${name}.astro should have been deleted in Task 14`).toBe(false);
    }
  });
});

describe('Coral signature', () => {
  it('coral-dot class is used in Nav, Features, Screenshots, Download', async () => {
    const files = [
      'src/components/Navbar.astro',
      'src/components/Features.astro',
      'src/components/Screenshots.astro',
      'src/components/Download.astro',
    ];
    for (const rel of files) {
      const content = await readFile(join(ROOT, rel), 'utf8');
      expect(content, `${rel} should include a coral-dot signature`).toMatch(/coral-dot/);
    }
  });

  it('coral-dot is NOT used in Footer (spec [03] - footer is a quiet coda)', async () => {
    const content = await readFile(join(ROOT, 'src/components/Footer.astro'), 'utf8');
    expect(content).not.toMatch(/coral-dot/);
  });
});
```

- [ ] **Step 2: Create `tests/build-smoke.test.js` with**

```js
import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

// Cross-platform npm invocation. On Windows, npm is a .cmd file so
// spawning it directly requires the .cmd suffix; using shell:false with
// npm.cmd on Windows and 'npm' elsewhere avoids shell interpolation
// entirely (no user input flows into the arg list).
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

describe('Astro build', () => {
  it('astro build completes without errors', () => {
    let output;
    try {
      output = execFileSync(npmCmd, ['run', 'build'], {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 120_000,
        shell: false,
      });
    } catch (err) {
      const stdout = err.stdout ? err.stdout.toString() : '';
      const stderr = err.stderr ? err.stderr.toString() : '';
      throw new Error(`astro build failed:\n${stdout}\n${stderr}`);
    }
    expect(output).toMatch(/Complete!|built in|generated/i);
  }, 120_000);
});
```

- [ ] **Step 3: Run the test suite**

Run: `npm run test:run`

Expected output: all describes pass. If any fail:
- Em-dash test failing: find the file it names, replace `—` with `-`, re-run.
- Palette-discipline test failing: `global.css` has a banned token - remove it.
- IA test failing: `index.astro` still imports a cut component - remove the import.
- Coral test failing: check that the named component uses `coral-dot` class.
- Build-smoke failing: read the build output, fix the underlying compile error.

**Do not adjust the tests to make them pass.** They express the spec's rules. If a test flags something, the code is wrong.

- [ ] **Step 4: Commit**

```bash
git add tests/content-lint.test.js tests/build-smoke.test.js
git commit -m "test: enforce Quiet Product design conventions

Content-lint suite:
- No em-dash characters in src/** or README.md
- global.css declares paper/ink/coral and rejects lime/magenta/cyan/
  aurora/glass/scan-line tokens
- index.astro imports exactly the 5-section IA
- The six cut components are gone from disk
- coral-dot signature appears in Nav/Features/Screenshots/Download
  and does NOT appear in Footer

Plus a build-smoke test that spawns 'npm run build' via execFileSync
(shell:false, no user input in argv) and asserts on the completion
output. Slow (~30-60s) but catches template errors that type checking
alone would miss."
```

---

## Task 16: Verification pass

**Files:**
- None modified. Verification only.

- [ ] **Step 1: Clean build**

Run:
```bash
rm -rf dist/
npm run build
```

Expected: build completes cleanly.

- [ ] **Step 2: Full test suite**

Run: `npm run test:run`
Expected: all tests pass.

- [ ] **Step 3: Browser walk-through**

With `npm run dev` running, walk through:

1. `http://localhost:4321/` - confirm 5 sections + footer, no missing content.
2. Hover every link and button - all should show a coral underline or coral border on hover.
3. Tab through the page with the keyboard - every interactive element should show a 2px coral focus ring.
4. Resize the window to <768px width - hamburger appears, sections stack vertically, no horizontal overflow.
5. Click the primary Download - on macOS it should offer the `.dmg`, on Windows the `.exe`.
6. Click through to `http://localhost:4321/changelog` - manifesto-style release list renders.
7. Click through to `http://localhost:4321/stat` - paper background, coral KPI numbers, charts render.

- [ ] **Step 4: Spec acceptance checklist**

Cross-check against `docs/superpowers/specs/2026-07-23-claude-like-ui-makeover-design.md` section [09] Acceptance:

- [x] All target sections render in the new visual language
- [x] All existing links/CTAs still work (GitHub release URLs preserved, /changelog path preserved)
- [ ] Lighthouse a11y >= 95 on `/` and `/changelog` (see step 5)
- [x] Keyboard nav reaches every interactive element with visible coral focus ring
- [x] Mobile <768px renders without horizontal overflow
- [x] No new third-party scripts
- [x] No tokens from prior aesthetics (enforced by tests)
- [x] No em-dashes in app source (enforced by tests)
- [x] Coral appears only in the 4 named places (visual check + coral-dot test)

- [ ] **Step 5: Lighthouse (optional but recommended)**

In Chrome DevTools > Lighthouse, run an audit on `http://localhost:4321/` (Accessibility category, Mobile). Note the score. If <95, investigate and fix (missing alt text, insufficient contrast, missing labels are the usual culprits).

- [ ] **Step 6: No commit** (verification only). If any check failed, go back to the relevant task and fix.

---

## Task 17: Final housekeeping commit + summary

**Files:**
- Modify: `README.md` if it still references removed sections or the old aesthetic

- [ ] **Step 1: Read README.md and update if necessary**

If the README mentions the aurora aesthetic, the removed sections, or lists incorrect tech stack, update it. If it doesn't, skip this step.

- [ ] **Step 2: Final commit if anything changed**

```bash
git add -A
git status  # confirm what's staged
git commit -m "docs: sync README with post-makeover state"  # only if there are staged changes
```

- [ ] **Step 3: Do NOT push**

Do not push. User will review the branch and decide when to push.

- [ ] **Step 4: Final report**

Print a summary of what changed:
- N files touched, M lines added, K lines removed (via `git diff --stat main...HEAD`)
- Homepage went from 11 to 5 sections + footer
- 6 components deleted
- Test suite added: content-lint + build-smoke

---

## Notes for the executor

- **When running Vitest**: the `build-smoke` test runs the actual `astro build`, which takes 30-60 seconds. If iterating on content-lint tests, filter with `npx vitest run tests/content-lint.test.js` to skip the build test.
- **When a task's manual verification finds a bug**: fix it in that task, re-verify, then commit. Do not push the bug into a later task.
- **When you find you need something not in the plan**: stop and ask. Do not scope-creep. The design was locked in the brainstorming session; any change to the shape of a component beyond what's spelled out here is a spec change, not an implementation choice.
- **The em-dash rule is enforced in tests.** If you find yourself typing `—` in commit messages, prose, or code, use `-` instead.
