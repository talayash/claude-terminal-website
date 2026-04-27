# UI/UX Makeover Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current AI-template marketing site (purple gradients, glassmorphism, centered hero, icon-card grid) with the glitch / post-digital direction defined in `docs/superpowers/specs/2026-04-27-ui-makeover-design.md`.

**Architecture:** Astro 4 static site with Tailwind v4. The new visual language lives in `src/styles/global.css` as CSS custom properties + utility classes; each existing component is rewritten in place to consume those tokens. No new dependencies, no SPA conversion, no build-pipeline changes.

**Verification model:** This is a static UI project with no unit-test harness. Verification per task is **browser-driven** — run `npm run dev`, open the page, look at the section that just changed, confirm it matches the spec/mockup. The plan calls these out as explicit steps.

**Tech Stack:** Astro · Tailwind CSS v4 · JetBrains Mono Variable (Google Fonts CDN) · Vercel.

**Spec correction noted during planning:** The spec's example TechStack listing (`electron · vite · ...`) is wrong — the product is Tauri 2 / Rust based. The implementation preserves the existing data in `TechStack.astro` (Tauri 2.x, Rust, React 18, TypeScript, xterm.js, Tailwind CSS, Zustand, SQLite) and only changes the visual treatment.

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `src/styles/global.css` | Rewrite | Palette tokens, typography base, scan-line/noise/glow textures, glitch + marquee + flash keyframes, focus rings, scrollbar, reduced-motion + print stylesheet |
| `src/layouts/Layout.astro` | Modify | Google Fonts preconnect + JetBrains Mono import, theme-color update, body class for global mono + texture |
| `src/components/Navbar.astro` | Rewrite | Slim status-bar nav with bracketed brand and lime divider |
| `src/components/Hero.astro` | Rewrite | Two-column hero, terminal-window-framed screenshot, glitch H1, scrolling status marquee |
| `src/components/Features.astro` | Rewrite | Stacked row entries with index/name/description/status columns and gutter label (replaces card grid) |
| `src/components/Screenshots.astro` | Rewrite | Off-grid layout (1 large + 2 small), each in a terminal-window frame |
| `src/components/Download.astro` | Rewrite | Two-tab `[ windows ] [ macos ]` picker rendering existing release URLs as `ls`-style output |
| `src/components/TechStack.astro` | Rewrite | Single horizontal mono line listing the real stack |
| `src/components/Footer.astro` | Rewrite | Three-column terminal sign-off |
| `src/pages/changelog.astro` | Rewrite | Git-log style rendering with filter chips and marquee |
| `.gitignore` | (already done) | `.superpowers/` excluded — no further change |

**Implementation order:** foundation (global.css + Layout) → components top-to-bottom → final polish + a11y. Old classes (`.glass`, `.glass-light`, `.gradient-text`, `.hero-glow`, `.screenshot-shadow`, `.animate-float`) stay in `global.css` until all components are migrated, then are stripped in the final task. This keeps every intermediate commit shippable.

---

## Task 0: Branch and dev server

**Files:** none modified — environment setup only.

- [ ] **Step 1: Create a feature branch off main**

```bash
git checkout -b ui-makeover-glitch-postdigital
```

- [ ] **Step 2: Install dependencies (idempotent)**

```bash
npm install
```

Expected: completes without errors. `node_modules/` populated.

- [ ] **Step 3: Start the dev server in the background**

```bash
npm run dev
```

Expected: `Local: http://localhost:4321/` printed. Leave running for the rest of the session — every subsequent task verifies against this.

- [ ] **Step 4: Visit `http://localhost:4321/` and confirm the current site loads**

Expected: existing purple/glassmorphism site renders. Hero, Features, Screenshots, Download, TechStack, Footer all visible. This is the "before" state — no changes yet.

---

## Task 1: Foundation — rewrite `global.css`

**Files:**
- Modify (full rewrite): `src/styles/global.css`

- [ ] **Step 1: Replace the entire contents of `src/styles/global.css`**

```css
@import "tailwindcss";

/* ============================================================
   [01] PALETTE — 6 tokens, no gradients
   ============================================================ */
@theme {
  --color-bg: #060606;
  --color-fg: #ededed;
  --color-lime: #a3e635;       /* primary / exec / focus */
  --color-mag: #ec4899;        /* aberration / alert */
  --color-cy: #06b6d4;         /* aberration / info */
  --color-surface: #0a0a0a;
  --color-divider: #1a1a1a;
  --color-muted: #888888;
  --color-muted-dim: #555555;

  --font-mono: "JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace;
}

/* ============================================================
   BASE
   ============================================================ */
html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.6;
  position: relative;
}

/* Global scan-line texture */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.04),
    rgba(255, 255, 255, 0.04) 1px,
    transparent 1px,
    transparent 3px
  );
}

/* Selection */
::selection {
  background: var(--color-lime);
  color: var(--color-bg);
}

/* Scrollbar — WebKit */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--color-surface); }
::-webkit-scrollbar-thumb { background: #333; }
::-webkit-scrollbar-thumb:hover { background: var(--color-lime); }

/* Scrollbar — Firefox */
* { scrollbar-color: #333 var(--color-surface); scrollbar-width: thin; }

/* Focus ring (keyboard only) */
:focus-visible {
  outline: 2px solid var(--color-lime);
  outline-offset: 2px;
}

/* ============================================================
   [02] UTILITY CLASSES — the new visual vocabulary
   ============================================================ */

/* Surface block (replaces .glass / .glass-light) */
.surface {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
}

/* Chromatic aberration on display type */
.aberration {
  text-shadow: 3px 0 0 var(--color-mag), -3px 0 0 var(--color-cy);
}

/* Inline lime highlight in body copy */
.hl {
  color: var(--color-lime);
  background: rgba(163, 230, 53, 0.1);
  padding: 0 3px;
}

/* Strikethrough for retired / cut concepts */
.strike {
  text-decoration: line-through;
  opacity: 0.5;
}

/* Section corner glows */
.glow-section {
  position: relative;
}
.glow-section::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    radial-gradient(circle at 90% 10%, rgba(236, 72, 153, 0.10), transparent 50%),
    radial-gradient(circle at 0% 90%, rgba(6, 182, 212, 0.08), transparent 50%);
  z-index: 0;
}
.glow-section > * { position: relative; z-index: 1; }

/* Terminal-window frame for screenshots */
.twin {
  background: var(--color-surface);
  border: 1px solid var(--color-divider);
  box-shadow: 4px 0 0 -2px rgba(236, 72, 153, 0.6),
              -4px 0 0 -2px rgba(6, 182, 212, 0.6);
}
.twin-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 10px;
  border-bottom: 1px solid var(--color-divider);
  font-size: 10px;
  color: var(--color-muted-dim);
  letter-spacing: 1px;
}
.twin-dots span {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 4px;
  background: #333;
}

/* CTA primary (lime) */
.cta-primary {
  background: var(--color-lime);
  color: var(--color-bg);
  padding: 10px 18px;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 2px;
  font-family: var(--font-mono);
  border: none;
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  transition: transform 120ms ease-out, box-shadow 120ms ease-out;
}
.cta-primary:hover {
  transform: translateY(-1px);
  box-shadow: 4px 0 0 var(--color-mag), -4px 0 0 var(--color-cy);
}

/* CTA secondary (cyan outline) */
.cta-secondary {
  background: transparent;
  border: 1px solid var(--color-cy);
  color: var(--color-cy);
  padding: 9px 18px;
  font-size: 12px;
  letter-spacing: 2px;
  font-family: var(--font-mono);
  display: inline-block;
  text-decoration: none;
  cursor: pointer;
  transition: background 120ms ease-out, color 120ms ease-out;
}
.cta-secondary:hover {
  background: var(--color-cy);
  color: var(--color-bg);
}

/* CTA ghost (gray with magenta arrow) */
.cta-ghost {
  color: var(--color-muted);
  padding: 10px 4px;
  font-size: 12px;
  letter-spacing: 2px;
  font-family: var(--font-mono);
  text-decoration: none;
  cursor: pointer;
}
.cta-ghost::after { content: " ↗"; color: var(--color-mag); }
.cta-ghost:hover { color: var(--color-fg); }

/* ============================================================
   [03] ANIMATIONS
   ============================================================ */

/* Hero H1 micro-glitch — fires every 9s, 280ms */
@keyframes glitch {
  0%, 92%, 96%, 100% {
    transform: translate(0);
    text-shadow: 3px 0 0 var(--color-mag), -3px 0 0 var(--color-cy);
  }
  93% { transform: translate(-2px, 1px); text-shadow: 6px 0 0 var(--color-mag), -6px 0 0 var(--color-cy); }
  94% { transform: translate(2px, -1px); text-shadow: -4px 0 0 var(--color-mag), 4px 0 0 var(--color-cy); }
  95% { transform: translate(0, 2px); text-shadow: 3px 2px 0 var(--color-mag), -3px -2px 0 var(--color-cy); }
}
.glitch {
  animation: glitch 9s infinite steps(1);
}

/* Status marquee — 40s linear loop */
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
.marquee-track {
  display: inline-flex;
  gap: 24px;
  white-space: nowrap;
  animation: marquee 40s linear infinite;
}
.marquee-track:hover { animation-play-state: paused; }

/* Feature row hover flash */
@keyframes flash {
  0% { transform: translateX(0); }
  50% { transform: translateX(-3px); color: var(--color-fg); }
  100% { transform: translateX(0); }
}
.row-flash:hover .row-status { animation: flash 280ms ease-out 1; }

/* Hero load sweep */
@keyframes sweep {
  from { transform: translateY(-100%); opacity: 1; }
  to   { transform: translateY(100%); opacity: 0; }
}
.load-sweep::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent, rgba(163, 230, 53, 0.15), transparent);
  animation: sweep 250ms ease-out 1;
}

/* ============================================================
   [04] REDUCED MOTION + PRINT
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .glitch, .marquee-track, .row-flash:hover .row-status, .load-sweep::before {
    animation: none !important;
  }
  .cta-primary:hover { transform: none; }
}

@media print {
  body::after, .glow-section::before { display: none; }
  body { background: white; color: black; }
  .marquee-track { animation: none; }
}
```

- [ ] **Step 2: Verify the dev server still compiles**

In your browser, refresh `http://localhost:4321/`.
Expected: page renders, possibly looks broken (mono font everywhere, scan lines overlay, but old purple components still using old classes — that's fine). No build errors in the terminal running `npm run dev`.

- [ ] **Step 3: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(styles): add glitch/post-digital design tokens and animations"
```

---

## Task 2: Layout.astro — font preload + texture

**Files:**
- Modify: `src/layouts/Layout.astro`

- [ ] **Step 1: Replace `src/layouts/Layout.astro` with this exact content**

```astro
---
import '../styles/global.css'
import SpeedInsights from '@vercel/speed-insights/astro'

interface Props {
  title: string;
  description?: string;
}

const { title, description = 'A Modern Multi-Instance Terminal Manager for Claude Code. Manage multiple Claude Code CLI sessions from one unified interface.' } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <meta name="theme-color" content="#060606" />
    <link rel="icon" type="image/png" sizes="128x128" href="/icons/icon.png" />

    <!-- JetBrains Mono Variable from Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap"
    />

    <!-- Open Graph -->
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="/screenshots/main-view.png" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="/screenshots/main-view.png" />

    <title>{title}</title>
    <slot name="head" />
  </head>
  <body class="min-h-screen antialiased">
    <slot />
    <SpeedInsights />
    <script>
      import { inject } from '@vercel/analytics';
      inject();
    </script>
  </body>
</html>
```

Changes vs the existing file:
- `theme-color` updated `#020617` → `#060606`
- Added 3 lines for Google Fonts preconnect + JetBrains Mono stylesheet (weights 400/600/700/800)
- Vercel SpeedInsights and analytics inject preserved unchanged

- [ ] **Step 2: Refresh `http://localhost:4321/` and verify**

Expected: page now renders in JetBrains Mono. DevTools Network tab shows `fonts.googleapis.com/css2?...` loaded. View Source shows the new theme-color and font links.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/Layout.astro
git commit -m "feat(layout): load JetBrains Mono and update theme-color"
```

---

## Task 3: Navbar.astro — slim status-bar

**Files:**
- Modify (full rewrite): `src/components/Navbar.astro`

- [ ] **Step 1: Replace `src/components/Navbar.astro` with this exact content**

```astro
---
const navLinks = [
  { href: '#features', label: '/features' },
  { href: '#screenshots', label: '/screenshots' },
  { href: '#download', label: '/download' },
  { href: '/changelog', label: '/changelog' },
];
---

<nav class="fixed top-0 left-0 right-0 z-50 border-b nav-bar" id="navbar">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-10">
      <a href="/" class="flex items-center gap-2 nav-brand">
        <span class="bracket">[</span>
        <span class="brand-text">CLAUDE-TERMINAL</span>
        <span class="bracket">]</span>
      </a>

      <div class="hidden md:flex items-center gap-5 nav-links">
        {navLinks.map(link => (
          <a href={link.href}>{link.label}</a>
        ))}
      </div>

      <div class="hidden md:flex items-center gap-3 nav-meta">
        <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer" class="gh">github ↗</a>
      </div>

      <button id="mobile-menu-btn" class="md:hidden mobile-toggle" aria-label="Toggle menu">
        <span>≡</span>
      </button>
    </div>

    <div id="mobile-menu" class="hidden md:hidden pb-3 nav-links">
      {navLinks.map(link => (
        <a href={link.href} class="block py-2">{link.label}</a>
      ))}
      <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer" class="block py-2">github ↗</a>
    </div>
  </div>
</nav>

<style>
  .nav-bar {
    background: #060606;
    border-color: #a3e635;
    font-size: 11px;
    letter-spacing: 2px;
  }
  .nav-brand { text-decoration: none; }
  .nav-brand .bracket { color: #a3e635; font-weight: 700; }
  .nav-brand .brand-text { color: #fff; font-weight: 700; }
  .nav-links a { color: #888; text-decoration: none; transition: color 120ms; }
  .nav-links a:hover { color: #ededed; }
  .nav-meta .gh { color: #06b6d4; text-decoration: none; }
  .nav-meta .gh:hover { color: #fff; }
  .mobile-toggle {
    background: transparent; border: none; color: #888;
    font-size: 18px; cursor: pointer; padding: 0 6px;
  }
  .mobile-toggle:hover { color: #ededed; }
</style>

<script>
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  btn?.addEventListener('click', () => menu?.classList.toggle('hidden'));
  menu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => menu?.classList.add('hidden'));
  });
</script>
```

Note: the version pill lives in the hero (where the version is fetched at build time) — the nav doesn't display it. This keeps the nav single-purpose and avoids threading the version prop through `Layout.astro`.

- [ ] **Step 2: Refresh `http://localhost:4321/` and verify**

Expected:
- Navbar is 40px tall, solid black, with a 1px lime divider underneath
- Brand reads `[ CLAUDE-TERMINAL ]` with lime brackets and white text
- Nav links are `/features /screenshots /download /changelog` in muted gray, hover to white
- `github ↗` link in cyan on the right
- Mobile (resize <768px): hamburger `≡` shows, expands the menu

- [ ] **Step 3: Commit**

```bash
git add src/components/Navbar.astro
git commit -m "feat(navbar): slim status-bar nav with bracketed brand and lime divider"
```

---

## Task 4: Hero.astro — two-column, framed screenshot, glitch H1, marquee

**Files:**
- Modify (full rewrite): `src/components/Hero.astro`

- [ ] **Step 1: Replace `src/components/Hero.astro` with this exact content**

```astro
---
interface Props {
  version: string;
}
const { version } = Astro.props;
---

<section class="hero-section glow-section load-sweep">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
      <!-- LEFT: copy -->
      <div>
        <div class="crumb">~/index · ● ● ●</div>
        <span class="hero-tag">▶ EXEC // V{version} — LATEST</span>
        <h1 class="hero-h1 aberration glitch">
          CLAUDE-T̷E̷RM<span class="strike">INAL</span>
        </h1>
        <p class="hero-sub">
          // a multi-instance terminal manager for <span style="color:#06b6d4">claude-code</span>.<br/>
          // <span class="hl">n parallel sessions</span>, one operator, zero context-switching.
        </p>
        <div class="hero-ctas">
          <a href="#download" class="cta-primary">./INSTALL ⏎</a>
          <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer" class="cta-secondary">$ git clone</a>
          <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer" class="cta-ghost">view source</a>
        </div>
      </div>

      <!-- RIGHT: framed screenshot -->
      <div class="twin">
        <div class="twin-bar">
          <span><span class="twin-dots"><span></span><span></span><span></span></span></span>
          <span>main-view.png · loaded</span>
        </div>
        <img src="/screenshots/main-view.png" alt="ClaudeTerminal main view" class="block w-full" loading="eager" />
      </div>
    </div>
  </div>

  <!-- Status marquee -->
  <div class="marquee">
    <div class="marquee-track">
      {Array.from({ length: 2 }).map(() => (
        <span class="m-row">
          <span class="m-ok">SIG_OK</span>
          <span class="m-sep">·</span>
          <span class="m-ok">200</span>
          <span class="m-sep">·</span>
          <span class="m-mag">UPTIME 99.97%</span>
          <span class="m-sep">·</span>
          <span class="m-ok">BUILD #341</span>
          <span class="m-sep">·</span>
          <span class="m-cy">MEM 64%</span>
          <span class="m-sep">·</span>
          <span class="m-ok">LATENCY 12ms</span>
          <span class="m-sep">·</span>
          <span class="m-mag">▓▒░ 0xFF.{version} ░▒▓</span>
          <span class="m-sep">·</span>
        </span>
      ))}
    </div>
  </div>
</section>

<style>
  .hero-section { position: relative; overflow: hidden; }
  .crumb {
    font-size: 10px;
    color: #555;
    letter-spacing: 2px;
    margin-bottom: 18px;
  }
  .hero-tag {
    color: #a3e635;
    font-size: 10px;
    letter-spacing: 2px;
    border-left: 2px solid #a3e635;
    padding-left: 8px;
    display: inline-block;
  }
  .hero-h1 {
    font-size: clamp(40px, 8vw, 88px);
    font-weight: 800;
    letter-spacing: -2px;
    line-height: 1;
    color: #fff;
    margin: 16px 0 18px;
  }
  .hero-sub {
    font-size: 13px;
    color: #aaa;
    line-height: 1.7;
    max-width: 460px;
  }
  .hero-ctas {
    margin-top: 26px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
  }
  .marquee {
    border-top: 1px solid #1a1a1a;
    border-bottom: 1px solid #1a1a1a;
    background: #060606;
    overflow: hidden;
    padding: 6px 0;
    font-size: 10px;
    letter-spacing: 2px;
  }
  .m-row { display: inline-flex; gap: 24px; padding-right: 24px; }
  .m-ok { color: #a3e635; }
  .m-sep { color: #333; }
  .m-mag { color: #ec4899; }
  .m-cy { color: #06b6d4; }
</style>
```

Note on `marquee-track` width: the duplicated content (2x) means the `translateX(-50%)` keyframe lands exactly one copy left, creating a seamless loop. The track is `display: inline-flex` so it can exceed parent width.

- [ ] **Step 2: Refresh `http://localhost:4321/` and verify**

Expected:
- Hero is left-aligned, two-column on desktop
- Crumb `~/index · ● ● ●` in dim gray
- Lime tag `▶ EXEC // V1.18.1 — LATEST` (or current version)
- Big `CLAUDE-T̷E̷RM` H1 with magenta+cyan chromatic aberration
- Tagline with cyan `claude-code` and lime-highlighted `n parallel sessions`
- Three CTAs: `./INSTALL ⏎` (lime), `$ git clone` (cyan outline), `view source ↗` (gray with magenta arrow)
- Right side: terminal-window-framed `main-view.png` with chromatic offset shadow
- After ~9 seconds: H1 jitters for 280ms (a real glitch, not a smooth tween)
- Status marquee scrolls right-to-left below the hero
- Hover the marquee → it pauses

- [ ] **Step 3: Test reduced motion**

Open DevTools → Rendering tab → Emulate CSS media feature `prefers-reduced-motion: reduce`. Verify:
- H1 no longer glitches
- Marquee freezes
- CTA hover doesn't translate (shadow still appears)

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat(hero): two-column layout with glitch H1, framed screenshot, status marquee"
```

---

## Task 5: Features.astro — row entries

**Files:**
- Modify (full rewrite): `src/components/Features.astro`

- [ ] **Step 1: Replace `src/components/Features.astro` with this exact content**

```astro
---
import features from '../data/features.json';

// status pill rotates through OK / LIVE / READY for visual variety
const statuses = ['OK', 'LIVE', 'OK', 'READY', 'OK', 'LIVE'];
const statusColors: Record<string, string> = {
  OK: '#a3e635',
  LIVE: '#ec4899',
  READY: '#06b6d4',
};
---

<section id="features" class="feat-section">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <div class="gut">[02] /FEATURES</div>
    <h2 class="feat-h2"><span class="num">[02]</span>FEATURES</h2>
    <p class="feat-sub">// six things, no card-grid, no rounded purple icon-squares.</p>

    <div class="feat-list">
      {features.map((feature, i) => {
        const status = statuses[i] ?? 'OK';
        const indent = i % 2 === 1; // 02.02, 02.04, 02.06 indented
        return (
          <div class={`feat-row row-flash${indent ? ' indent' : ''}`}>
            <div class="idx">02.{String(i + 1).padStart(2, '0')}</div>
            <div class="name">{feature.title}</div>
            <div class="desc">{feature.description}</div>
            <div class="row-status" style={`color:${statusColors[status]}`}>[ {status} ]</div>
          </div>
        );
      })}
    </div>
  </div>
</section>

<style>
  .feat-section { position: relative; }
  .gut {
    position: absolute;
    left: -8px;
    top: 80px;
    font-size: 10px;
    letter-spacing: 4px;
    color: #555;
    writing-mode: vertical-rl;
    transform: rotate(180deg);
  }
  @media (max-width: 768px) {
    .gut { display: none; }
  }
  .feat-h2 {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #fff;
    margin-bottom: 6px;
  }
  .feat-h2 .num { color: #a3e635; margin-right: 10px; }
  .feat-sub {
    font-size: 12px;
    color: #888;
    margin-bottom: 28px;
  }
  .feat-list { margin-top: 20px; }
  .feat-row {
    display: grid;
    grid-template-columns: 70px 1fr 2fr 90px;
    gap: 18px;
    align-items: start;
    padding: 18px 0;
    border-top: 1px solid rgba(236, 72, 153, 0.25);
    transition: background 120ms ease-out;
    cursor: default;
  }
  .feat-row:first-child {
    border-top: 1px solid #a3e635;
  }
  .feat-row.indent {
    padding-left: 60px;
  }
  .feat-row:hover {
    background: rgba(163, 230, 53, 0.06);
  }
  .feat-row .idx {
    font-size: 10px;
    color: #555;
    letter-spacing: 2px;
    padding-top: 2px;
  }
  .feat-row .name {
    font-size: 13px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  .feat-row .desc {
    font-size: 12px;
    color: #888;
    line-height: 1.6;
  }
  .feat-row .row-status {
    font-size: 10px;
    letter-spacing: 2px;
    text-align: right;
    padding-top: 2px;
  }
  @media (max-width: 768px) {
    .feat-row {
      grid-template-columns: 1fr;
      gap: 6px;
    }
    .feat-row.indent { padding-left: 0; }
    .feat-row .idx { font-size: 9px; }
    .feat-row .row-status { text-align: left; }
  }
</style>
```

- [ ] **Step 2: Refresh `http://localhost:4321/#features` and verify**

Expected:
- Old 3×2 icon card grid is gone
- Section header reads `[02] FEATURES` with lime number prefix
- Subhead `// six things, no card-grid, no rounded purple icon-squares.`
- Six rows total, each with: `02.NN` index | UPPERCASE feature name | description | colored `[ STATUS ]` pill
- Rows alternate flush-left and indented (rows 2, 4, 6 indented +60px)
- First row has lime divider above; others have magenta hairlines
- Hover any row: faint lime tint appears + status pill flashes (small x-shift, color → white) once
- Vertical rotated `[02] /FEATURES` gutter visible on the left margin (desktop only; hidden on mobile)
- Mobile (<768px): rows stack into single column, gutter hides

- [ ] **Step 3: Commit**

```bash
git add src/components/Features.astro
git commit -m "feat(features): replace card grid with row entries and gutter label"
```

---

## Task 6: Screenshots.astro — terminal-window frames, off-grid

**Files:**
- Modify (full rewrite): `src/components/Screenshots.astro`

- [ ] **Step 1: Replace `src/components/Screenshots.astro` with this exact content**

```astro
---
const screenshots = [
  { src: '/screenshots/main-view.png', title: 'main-view.png', description: 'Tabbed terminal interface with sidebar' },
  { src: '/screenshots/grid-view.png', title: 'grid-view.png', description: 'Up to 8 terminals simultaneously' },
  { src: '/screenshots/new-terminal.png', title: 'new-terminal.png', description: 'Create terminals with custom configurations' },
  { src: '/screenshots/profiles.png', title: 'profiles.png', description: 'Save and load configuration profiles' },
  { src: '/screenshots/settings.png', title: 'settings.png', description: 'Customize your experience' },
  { src: '/screenshots/welcome.png', title: 'welcome.png', description: 'Guided first-run setup' },
];

// Layout: alternate large+small pairs. Slot 0 large, 1 small, 2 small, then repeat.
const big = (i: number) => i % 3 === 0;
---

<section id="screenshots" class="shots-section glow-section">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
    <h2 class="shots-h2"><span class="num">[03]</span>CAPTURES <span class="meta">// last sync 0xFF</span></h2>

    <div class="shots-grid">
      {screenshots.map((shot, i) => (
        <div class={`twin shot${big(i) ? ' shot-big' : ''}`}>
          <div class="twin-bar">
            <span><span class="twin-dots"><span></span><span></span><span></span></span></span>
            <span class="filename">{shot.title}</span>
          </div>
          <img src={shot.src} alt={shot.description} class="block w-full" loading="lazy" />
          <div class="caption">// {shot.description}</div>
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .shots-h2 {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #fff;
    margin-bottom: 28px;
  }
  .shots-h2 .num { color: #a3e635; margin-right: 10px; }
  .shots-h2 .meta {
    color: #555;
    font-size: 11px;
    margin-left: 10px;
    letter-spacing: 2px;
  }
  .shots-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .shot.shot-big {
    grid-column: span 2;
    grid-row: span 2;
  }
  .shot .filename { color: #888; }
  .shot .caption {
    padding: 10px 12px;
    font-size: 11px;
    color: #888;
    border-top: 1px solid #1a1a1a;
  }
  @media (max-width: 1024px) {
    .shots-grid { grid-template-columns: 1fr 1fr; }
    .shot.shot-big { grid-column: span 2; grid-row: auto; }
  }
  @media (max-width: 640px) {
    .shots-grid { grid-template-columns: 1fr; }
    .shot.shot-big { grid-column: auto; }
  }
</style>
```

Notes:
- The `big()` helper assigns slots 0, 3 to span 2 columns × 2 rows — creates the irregular grid
- `.twin` (defined globally in Task 1) provides the terminal-window frame with chromatic shadow
- Each frame has title bar (dots + filename) and bottom caption (`// description`)

- [ ] **Step 2: Refresh `http://localhost:4321/#screenshots` and verify**

Expected:
- Header: `[03] CAPTURES // last sync 0xFF` with lime `[03]` prefix
- 6 screenshots framed as terminal windows
- Layout is irregular: slot 1 large (spans 2×2), slots 2–3 small to its right, slot 4 large again, etc.
- Each frame: 1px gray border, title bar with 3 dots + filename in muted color, screenshot, then `// description` caption
- Magenta-on-left + cyan-on-right offset shadow visible around each frame
- Tablet (~1024px): collapses to 2 columns, all frames same size
- Mobile (<640px): stacks to 1 column

- [ ] **Step 3: Commit**

```bash
git add src/components/Screenshots.astro
git commit -m "feat(screenshots): terminal-window frames with off-grid layout"
```

---

## Task 7: Download.astro — terminal-style installer picker

**Files:**
- Modify (full rewrite): `src/components/Download.astro`

- [ ] **Step 1: Replace `src/components/Download.astro` with this exact content**

```astro
---
interface Props {
  version: string;
}
const { version } = Astro.props;

const windowsArtifacts = [
  { label: 'NSIS', file: `ClaudeTerminal_${version}_x64-setup.exe` },
  { label: 'MSI',  file: `ClaudeTerminal_${version}_x64_en-US.msi` },
];
const macosArtifacts = [
  { label: 'ARM64', file: `ClaudeTerminal_${version}_aarch64.dmg` },
  { label: 'INTEL', file: `ClaudeTerminal_${version}_x64.dmg` },
];

const releaseBase = 'https://github.com/talayash/claude-terminal/releases/latest/download';
---

<section id="download" class="dl-section">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <h2 class="dl-h2"><span class="num">[04]</span>INSTALL</h2>
    <p class="dl-sub">// requires windows 10+ / macos 11+ · node.js 18+ · claude code via npm</p>

    <div class="dl-tabs" role="tablist">
      <button class="dl-tab active" data-tab="windows" role="tab" aria-selected="true">[ windows ]</button>
      <button class="dl-tab" data-tab="macos" role="tab" aria-selected="false">[ macos ]</button>
    </div>

    <div class="dl-panel" data-panel="windows">
      <pre class="dl-cmd">$ ls releases/v{version}/windows</pre>
      <ul class="dl-list">
        {windowsArtifacts.map(a => (
          <li>
            <a href={`${releaseBase}/${a.file}`}>
              <span class="arrow">→</span>
              <span class="filename">{a.file}</span>
              <span class="tag">[{a.label}]</span>
              <span class="dl">↓</span>
            </a>
          </li>
        ))}
      </ul>
    </div>

    <div class="dl-panel hidden" data-panel="macos">
      <pre class="dl-cmd">$ ls releases/v{version}/macos</pre>
      <ul class="dl-list">
        {macosArtifacts.map(a => (
          <li>
            <a href={`${releaseBase}/${a.file}`}>
              <span class="arrow">→</span>
              <span class="filename">{a.file}</span>
              <span class="tag">[{a.label}]</span>
              <span class="dl">↓</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  </div>
</section>

<style>
  .dl-h2 {
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -1px;
    color: #fff;
    margin-bottom: 6px;
  }
  .dl-h2 .num { color: #a3e635; margin-right: 10px; }
  .dl-sub {
    font-size: 12px;
    color: #888;
    margin-bottom: 28px;
  }
  .dl-tabs {
    display: flex;
    gap: 12px;
    border-bottom: 1px solid #1a1a1a;
    margin-bottom: 16px;
  }
  .dl-tab {
    background: transparent;
    border: none;
    color: #888;
    font-family: inherit;
    font-size: 12px;
    letter-spacing: 2px;
    padding: 8px 12px;
    cursor: pointer;
    transition: color 120ms;
  }
  .dl-tab:hover { color: #ededed; }
  .dl-tab.active { color: #a3e635; border-bottom: 2px solid #a3e635; margin-bottom: -1px; }
  .dl-cmd {
    color: #555;
    font-size: 12px;
    margin: 6px 0 12px;
    letter-spacing: 1px;
  }
  .dl-list { list-style: none; padding: 0; margin: 0; }
  .dl-list li { padding: 0; margin-bottom: 6px; }
  .dl-list a {
    display: grid;
    grid-template-columns: 24px 1fr 80px 24px;
    gap: 12px;
    align-items: center;
    text-decoration: none;
    padding: 10px 14px;
    border: 1px solid transparent;
    transition: background 120ms, border-color 120ms;
    font-size: 12px;
  }
  .dl-list a:hover {
    background: rgba(163, 230, 53, 0.06);
    border-color: rgba(163, 230, 53, 0.3);
  }
  .dl-list .arrow { color: #555; }
  .dl-list .filename { color: #ededed; letter-spacing: 1px; }
  .dl-list .tag { color: #06b6d4; font-size: 10px; letter-spacing: 2px; }
  .dl-list .dl { color: #555; text-align: right; }
  .dl-list a:hover .dl, .dl-list a:hover .arrow { color: #a3e635; }
</style>

<script>
  const tabs = document.querySelectorAll<HTMLButtonElement>('.dl-tab');
  const panels = document.querySelectorAll<HTMLDivElement>('.dl-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => {
        const active = t === tab;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach(p => p.classList.toggle('hidden', p.dataset.panel !== target));
    });
  });
</script>
```

Notes:
- The 4 artifact files match the URL patterns already used in the existing `Download.astro`: `ClaudeTerminal_${version}_x64-setup.exe`, `ClaudeTerminal_${version}_x64_en-US.msi`, `ClaudeTerminal_${version}_aarch64.dmg`, `ClaudeTerminal_${version}_x64.dmg`. They link to GitHub releases — no new distribution channels.
- The page receives `version` as a prop already (passed from `index.astro`).
- Tab switching is vanilla JS (no framework) — toggles `.hidden` on panels and `.active` on tabs.

- [ ] **Step 2: Refresh `http://localhost:4321/#download` and verify**

Expected:
- Header `[04] INSTALL` with lime `[04]` prefix
- Subhead requirements line
- Two tabs: `[ windows ]` (active, lime, lime underline) and `[ macos ]` (inactive, muted)
- Below tabs: `$ ls releases/v1.18.1/windows` (or current version) in dim gray
- Two artifact rows for Windows: `→ ClaudeTerminal_1.18.1_x64-setup.exe [NSIS] ↓` and the MSI variant
- Click `[ macos ]` tab: panel switches to macOS artifacts (ARM64 + Intel `.dmg`)
- Hover any artifact row: faint lime bg, lime border, arrow + ↓ go lime
- Click any artifact: navigates to the correct GitHub releases URL

- [ ] **Step 3: Commit**

```bash
git add src/components/Download.astro
git commit -m "feat(download): terminal-style installer picker over existing release URLs"
```

---

## Task 8: TechStack.astro — single mono line

**Files:**
- Modify (full rewrite): `src/components/TechStack.astro`

- [ ] **Step 1: Replace `src/components/TechStack.astro` with this exact content**

```astro
---
const stack = ['tauri 2', 'rust', 'react 18', 'typescript', 'xterm.js', 'tailwind', 'zustand', 'sqlite'];
---

<section class="stack-section">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="stack-line">
      <span class="num">[05]</span>
      <span class="label">STACK</span>
      <span class="rule">───</span>
      {stack.map((t, i) => (
        <>
          <span class="tech">{t}</span>
          {i < stack.length - 1 && <span class="sep">·</span>}
        </>
      ))}
      <span class="rule">───</span>
    </div>
  </div>
</section>

<style>
  .stack-section { border-top: 1px solid #1a1a1a; border-bottom: 1px solid #1a1a1a; }
  .stack-line {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    letter-spacing: 2px;
    color: #888;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 4px;
  }
  .stack-line .num { color: #a3e635; }
  .stack-line .label { color: #ededed; font-weight: 700; }
  .stack-line .rule { color: #333; letter-spacing: 0; }
  .stack-line .tech { color: #aaa; }
  .stack-line .sep { color: #333; }
  .stack-line::-webkit-scrollbar { height: 4px; }
</style>
```

- [ ] **Step 2: Refresh `http://localhost:4321/` and scroll to the tech stack section. Verify:**

- Single horizontal line: `[05] STACK ─── tauri 2 · rust · react 18 · typescript · xterm.js · tailwind · zustand · sqlite ───`
- `[05]` lime, `STACK` white-bold, rules muted, technologies in light gray with dim separators
- ~50px tall total
- Mobile: scrolls horizontally rather than wrapping

- [ ] **Step 3: Commit**

```bash
git add src/components/TechStack.astro
git commit -m "feat(stack): replace badges with single mono line"
```

---

## Task 9: Footer.astro — three-column terminal sign-off

**Files:**
- Modify (full rewrite): `src/components/Footer.astro`

- [ ] **Step 1: Replace `src/components/Footer.astro` with this exact content**

```astro
---
const year = new Date().getFullYear();
// build date — formatted as DD.MM.YY
const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yy = String(today.getFullYear()).slice(-2);
const buildDate = `${dd}.${mm}.${yy}`;
---

<footer class="ft">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="ft-grid">
      <div class="ft-brand">
        <pre class="ascii">{`
  ┌──────────────────────┐
  │  CLAUDE-TERMINAL     │
  │  > one operator,     │
  │    n parallel ses.   │
  └──────────────────────┘
`}</pre>
      </div>

      <div class="ft-links">
        <a href="#features">/features</a>
        <a href="#screenshots">/screenshots</a>
        <a href="#download">/download</a>
        <a href="/changelog">/changelog</a>
        <a href="https://github.com/talayash/claude-terminal" target="_blank" rel="noopener noreferrer">github ↗</a>
        <a href="https://github.com/talayash/claude-terminal/blob/master/LICENSE" target="_blank" rel="noopener noreferrer">mit ↗</a>
      </div>

      <div class="ft-meta">
        <div>built by <span class="acc">@talayash</span></div>
        <div>license · <span class="acc-cy">MIT</span></div>
        <div>build · <span class="acc-mag">{buildDate}</span></div>
        <div class="copy">© {year}</div>
      </div>
    </div>

    <div class="ft-rule">░▒▓ thanks for stopping by ▓▒░</div>
  </div>
</footer>

<style>
  .ft { border-top: 1px solid #1a1a1a; }
  .ft-grid {
    display: grid;
    grid-template-columns: 1.2fr 1fr 1fr;
    gap: 30px;
    align-items: start;
  }
  .ft-brand .ascii {
    font-size: 10px;
    color: #555;
    line-height: 1.3;
    margin: 0;
    white-space: pre;
    font-family: inherit;
  }
  .ft-links {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    letter-spacing: 1px;
  }
  .ft-links a {
    color: #888;
    text-decoration: none;
    transition: color 120ms;
  }
  .ft-links a:hover { color: #ededed; }
  .ft-meta {
    font-size: 11px;
    color: #888;
    letter-spacing: 1px;
    line-height: 1.7;
  }
  .ft-meta .acc { color: #a3e635; }
  .ft-meta .acc-cy { color: #06b6d4; }
  .ft-meta .acc-mag { color: #ec4899; }
  .ft-meta .copy { margin-top: 10px; color: #555; }
  .ft-rule {
    margin-top: 30px;
    text-align: center;
    font-size: 10px;
    color: #555;
    letter-spacing: 4px;
  }
  @media (max-width: 768px) {
    .ft-grid { grid-template-columns: 1fr; }
  }
</style>
```

- [ ] **Step 2: Refresh `http://localhost:4321/` and scroll to the footer. Verify:**

- 3 columns: ASCII brand block (left), 6-link list (center), status meta block (right)
- ASCII block renders as literal box-drawing characters (preserved monospace)
- Links: `/features /screenshots /download /changelog github ↗ mit ↗` — muted, hover to white
- Meta: `built by @talayash` (lime), `license · MIT` (cyan), `build · DD.MM.YY` (magenta), `© YYYY` (dim)
- Bottom rule centered: `░▒▓ thanks for stopping by ▓▒░`
- Mobile: 3 columns collapse to a single stacked column

- [ ] **Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(footer): three-column terminal sign-off with ASCII brand"
```

---

## Task 10: changelog.astro — git-log style

**Files:**
- Modify (full rewrite): `src/pages/changelog.astro`

- [ ] **Step 1: Replace `src/pages/changelog.astro` with this exact content**

```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Footer from '../components/Footer.astro';
import changelog from '../data/changelog.json';

// fake commit hashes for visual flavor — derived from version string
function fakeHash(version: string): string {
  let h = 0;
  for (const c of version) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h).toString(16).padStart(7, '0').slice(0, 7);
}

const totalCommits = changelog.reduce((acc, r) => acc + r.features.length, 0);
const latest = changelog[0];
---

<Layout title="Changelog — ClaudeTerminal" description="Release history and changelog for ClaudeTerminal.">
  <Navbar />

  <main class="cl-main">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
      <!-- Top marquee -->
      <div class="cl-marquee">
        <div class="marquee-track">
          {Array.from({ length: 2 }).map(() => (
            <span class="m-row">
              <span class="m-ok">LATEST</span>
              <span class="m-sep">·</span>
              <span class="m-mag">v{latest.version}</span>
              <span class="m-sep">·</span>
              <span class="m-cy">{latest.date}</span>
              <span class="m-sep">·</span>
              <span class="m-ok">{totalCommits} commits</span>
              <span class="m-sep">·</span>
              <span class="m-mag">▓▒░</span>
              <span class="m-sep">·</span>
            </span>
          ))}
        </div>
      </div>

      <h1 class="cl-h1"><span class="num">$</span> git log --oneline</h1>
      <p class="cl-sub">// release history · {changelog.length} versions · {totalCommits} entries</p>

      <div class="cl-list">
        {changelog.map(release => (
          <div class="cl-release">
            <div class="cl-row">
              <span class="cl-star">*</span>
              <span class="cl-hash">{fakeHash(release.version)}</span>
              <span class="cl-sep">·</span>
              <span class="cl-date">{release.date}</span>
              <span class="cl-sep">·</span>
              <span class="cl-ver">v{release.version}</span>
            </div>
            <ul class="cl-features">
              {release.features.map(f => (
                <li>
                  <span class="bullet">●</span>
                  <span class="cl-title">{f.title}</span>
                  {f.description && <span class="cl-desc"> — {f.description}</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  </main>

  <Footer />
</Layout>

<style>
  .cl-main { min-height: 100vh; }
  .cl-marquee {
    border-top: 1px solid #1a1a1a;
    border-bottom: 1px solid #1a1a1a;
    background: #060606;
    overflow: hidden;
    padding: 6px 0;
    font-size: 10px;
    letter-spacing: 2px;
    margin-bottom: 30px;
  }
  .m-row { display: inline-flex; gap: 24px; padding-right: 24px; }
  .m-ok { color: #a3e635; }
  .m-sep { color: #333; }
  .m-mag { color: #ec4899; }
  .m-cy { color: #06b6d4; }

  .cl-h1 {
    font-size: 32px;
    font-weight: 800;
    letter-spacing: -1px;
    color: #fff;
    margin-bottom: 6px;
  }
  .cl-h1 .num { color: #a3e635; margin-right: 10px; }
  .cl-sub {
    font-size: 12px;
    color: #888;
    margin-bottom: 36px;
  }
  .cl-release {
    margin-bottom: 28px;
    padding-bottom: 18px;
    border-bottom: 1px solid #1a1a1a;
  }
  .cl-row {
    font-size: 13px;
    letter-spacing: 1px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .cl-star { color: #a3e635; font-weight: 700; }
  .cl-hash { color: #ec4899; font-weight: 700; }
  .cl-sep { color: #333; }
  .cl-date { color: #06b6d4; }
  .cl-ver { color: #a3e635; font-weight: 700; }

  .cl-features { list-style: none; padding-left: 16px; margin: 0; }
  .cl-features li {
    font-size: 12px;
    color: #aaa;
    line-height: 1.7;
    padding: 4px 0;
  }
  .cl-features .bullet { color: #a3e635; margin-right: 8px; }
  .cl-features .cl-title { color: #ededed; }
  .cl-features .cl-desc { color: #888; }
</style>
```

Note: filter chips described in the spec are deliberately omitted from this version — the existing `changelog.json` doesn't carry feature-type tags (no `feat`/`fix`/`chore` field), so filtering would be useless without a data-shape change. Out of scope here. Recorded in the spec as a deferred enhancement.

- [ ] **Step 2: Visit `http://localhost:4321/changelog` and verify:**

- Top marquee scrolls: `LATEST · v{version} · {date} · {n} commits · ▓▒░ · ...`
- Heading: `$ git log --oneline` with lime `$`
- Subhead: `// release history · {N} versions · {M} entries`
- Each release renders as: `* {hash} · {date} · v{version}` then bullet-listed features below
- Hash is magenta (constant pseudo-hash per version), date is cyan, version is lime, `*` is lime, `●` bullets are lime
- Feature title in white, description in muted gray
- Releases separated by hairline divider
- Navbar at top, footer at bottom

- [ ] **Step 3: Commit**

```bash
git add src/pages/changelog.astro
git commit -m "feat(changelog): git log --oneline rendering with marquee"
```

---

## Task 11: Verify no dead-class references remain

**Files:** none — verification only.

The Task 1 rewrite of `global.css` already replaced all old tokens (`--color-primary*`, `--color-accent`, `--color-glass*`) and stripped legacy classes (`.glass`, `.glass-light`, `.gradient-text`, `.hero-glow`, `.screenshot-shadow`, `.animate-float`). This task confirms nothing in the rest of the codebase still references them.

- [ ] **Step 1: Search for any remaining references in source files**

```bash
grep -rnE "(\.glass|\.gradient-text|\.hero-glow|\.screenshot-shadow|\.animate-float|color-primary|color-accent|color-glass)" src/ --include="*.astro" --include="*.ts" --include="*.tsx" --include="*.css"
```

Expected: **no matches**. Empty output.

If any matches surface in `.astro` files, that component was missed in earlier tasks — go back to the relevant task (4–10) and update it. Repeat until grep is empty.

- [ ] **Step 2: Walk every page once more in the browser**

Visit and visually confirm — no broken styling, no console errors:
- `http://localhost:4321/` (homepage — every section)
- `http://localhost:4321/changelog`

- [ ] **Step 3: Commit any cleanup fixes**

If Step 1 surfaced a missed component and you fixed it, commit:

```bash
git add <files>
git commit -m "chore: remove leftover legacy class references"
```

If grep was already empty, no commit needed.

---

## Task 12: A11y + reduced-motion verification

**Files:** none — verification only.

- [ ] **Step 1: Tab through the homepage**

Open `http://localhost:4321/`. Click anywhere on the page, then press `Tab` repeatedly until you've cycled through every interactive element. Confirm:

- Each focused element shows a 2px solid lime outline with a 2px gap
- Order is logical (top-to-bottom, left-to-right)
- Focus is never trapped, never invisible, never landing on a non-interactive element

- [ ] **Step 2: Test reduced motion**

In Chrome DevTools → Rendering tab → "Emulate CSS media feature `prefers-reduced-motion`" → set to `reduce`. Refresh the homepage. Confirm:

- Hero H1 no longer glitches
- Status marquee is frozen
- CTA buttons don't translate on hover (shadow still appears — that's correct)
- Feature row hover still highlights bg but status pill no longer flashes

Reset emulation when done.

- [ ] **Step 3: Run a Lighthouse a11y audit**

In Chrome DevTools → Lighthouse → check only "Accessibility" → "Analyze page load".

Expected: score ≥ 95. Common issues to watch for:
- Color contrast on `#888` body text against `#060606` background — should pass AA at 13px (contrast ratio ~4.6:1)
- Color contrast on `#555` muted-dim text — fails AA on small text. Use `#555` only for decorative crumb/meta lines, never for real content. If audit flags any, raise that specific use to `#888`
- Missing `alt` attributes on screenshot `<img>` tags — already handled in Tasks 4 + 6

- [ ] **Step 4: Fix any issues found and commit**

If contrast issues or missing labels surface, fix them in the offending component and commit:

```bash
git add <files>
git commit -m "fix(a11y): <specific issue>"
```

If clean, skip the commit.

---

## Task 13: Mobile responsive verification

**Files:** none unless fixes needed.

- [ ] **Step 1: Resize the browser to 375px wide (or use DevTools device emulation: iPhone SE)**

Visit each section in turn and verify:

- **Navbar:** brand left, hamburger right, menu opens with nav links stacked
- **Hero:** stacks vertically — text first, then framed screenshot. H1 wraps but stays legible. CTAs stack or wrap, all visible.
- **Marquee:** still scrolls horizontally, no overflow of the viewport
- **Features:** rows collapse to single-column, idx + status now appear above the description. Indented rows lose their indent
- **Screenshots:** 1 column, all 6 frames stack
- **Download:** tabs still side-by-side, artifact rows compress (filename may wrap)
- **Tech Stack:** scrolls horizontally (this is intentional — that's the spec)
- **Footer:** 3 columns collapse to 1, ASCII block sits above link list above meta block
- **Changelog page:** marquee + entries scale down. `* hash · date · v1.18.1` row may wrap on narrow widths — acceptable
- **No horizontal scroll** on the page itself except the deliberate Tech Stack line

- [ ] **Step 2: Fix any horizontal-overflow issues**

If a section forces the page to scroll horizontally (other than Tech Stack), open the offending component and add `overflow-x: hidden` on the section container or shrink padding. Commit:

```bash
git add <files>
git commit -m "fix(mobile): prevent horizontal overflow in <section>"
```

- [ ] **Step 3: Test at tablet width (~768–1024px)**

- Hero may stay 2-column or switch to 1-column at this width — both are acceptable, depends on Tailwind breakpoints used
- Screenshots collapse to 2 columns
- Features stay multi-column

---

## Task 14: Production build + final acceptance

**Files:** none unless build errors surface.

- [ ] **Step 1: Stop the dev server**

`Ctrl+C` in the terminal running `npm run dev`.

- [ ] **Step 2: Run a production build**

```bash
npm run build
```

Expected: completes without errors. `dist/` populated. No TypeScript errors. No CSS warnings about undefined variables.

- [ ] **Step 3: Preview the production build**

```bash
npm run preview
```

Visit `http://localhost:4321/` (or whatever port preview prints). Verify the production output matches the dev output — same fonts, animations, layout, links work.

- [ ] **Step 4: Walk through the spec acceptance checklist**

Open `docs/superpowers/specs/2026-04-27-ui-makeover-design.md` and confirm each acceptance item:

- [x] All current sections render in the new visual language
- [x] All existing links and CTAs still work and point to the same URLs (downloads → GitHub releases, changelog, github links)
- [x] Lighthouse a11y ≥ 95 (verified Task 12)
- [x] `prefers-reduced-motion` disables glitch, marquee, hover-translate, load sweep (verified Task 12)
- [x] Tab navigation reaches every interactive element with a visible lime focus ring (verified Task 12)
- [x] Mobile (<768px) renders without horizontal overflow except Tech Stack (verified Task 13)
- [x] No new third-party scripts or analytics

- [ ] **Step 5: Final cleanup commit if needed**

If any acceptance item required a fix in Step 4, commit it:

```bash
git add <files>
git commit -m "fix: final acceptance fixes"
```

- [ ] **Step 6: Push the branch**

```bash
git push -u origin ui-makeover-glitch-postdigital
```

Implementation complete. Ready for PR review and merge.

---

## Summary

**Tasks:** 15 (Task 0 setup + 14 implementation tasks).
**Files touched:** 10 source files + `.gitignore` (already done) + 2 docs files.
**Commits:** ~10–12 (one per major component, plus fixes).
**No new dependencies added.**

The legacy purple/glassmorphism aesthetic is fully replaced with the glitch / post-digital direction defined in the spec. Every existing route, link, and CTA continues to work; only the visual treatment has changed.
