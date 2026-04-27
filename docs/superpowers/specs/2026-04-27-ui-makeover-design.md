# UI/UX Makeover — ClaudeTerminal Marketing Site

**Date:** 2026-04-27
**Status:** Spec, awaiting implementation plan
**Scope:** `claude-terminal-website` (the marketing/landing site, not the product)

## Problem

The current site is the prototypical "AI-generated SaaS landing page": dark navy + purple→cyan gradient text, glassmorphism cards, soft purple radial glows, centered hero with two-button CTAs, a tidy 3-column feature grid with rounded-square Heroicons. It works, but it looks generic and shares zero DNA with the product it sells (a terminal manager). The goal is a distinctive, deliberate visual identity that reads as bold/abstract/post-digital and rejects the AI-landing-page template.

## Direction

**Glitch / post-digital.** Solid black background, monospace typography throughout, chromatic aberration on display type, scan-line texture, ASCII motifs as recurring decoration, lime-green primary CTAs, magenta + cyan as accent/aberration colors. The site reads more like the product's own UI than like a marketing site, and stops the scroll because it doesn't look like anything else in dev tooling.

Two earlier candidates were considered and rejected:
- **Brutalist Mono** (black + caution yellow, all-monospace, hazard stripes) — too disciplined, not abstract enough.
- **Bauhaus / Editorial** (cream + primary shapes, display sans + serif italic) — too analog/print, undercuts the technical product.

## [01] Visual Language

### Palette — 6 tokens, no gradients

| Token | Hex | Role |
|---|---|---|
| background | `#060606` | page background |
| foreground | `#ededed` | primary text |
| primary / exec | `#a3e635` | primary CTAs, success, focus rings, highlights |
| aberration / alert | `#ec4899` | chromatic offset (left), magenta accents, alert |
| aberration / info | `#06b6d4` | chromatic offset (right), cyan accents, info |
| muted | `#1a1a1a` (surface), `#888` (text) | dividers, secondary text |

No gradients anywhere. The previous purple→cyan wordmark gradient is replaced by chromatic aberration on solid white. Lime is reserved for the primary action — every section gets at most one lime element.

### Typography — single family, monospace throughout

- **Family:** JetBrains Mono Variable (default; alternates Berkeley Mono / Departure Mono / IBM Plex Mono — final pick during implementation, no spec change required).
- **H1 (display):** 56–96px, weight 800, letter-spacing -2px, line-height 1.0, white. Chromatic aberration via `text-shadow: 3px 0 0 #ec4899, -3px 0 0 #06b6d4`.
- **H2 (section):** 28px, weight 700, letter-spacing -1px. Bracketed index prefix in lime: `[02] FEATURES`.
- **H3 (sub-section):** 16px, weight 600, uppercase, letter-spacing 2px.
- **Body:** 13px, weight 400, line-height 1.6, color `#888` for secondary / `#aaa` for primary body. Max-width 56ch. Inline accents: `<span class="hl">` (lime highlight), `<span class="strike">` (strikethrough at 0.5 opacity for retired references).

### Texture — three CSS-only layers

1. **Scan lines** — global `body::after`, repeating linear gradient, 4% opacity. Always on.
2. **Noise grain** — radial dot pattern on surfaces (`.glass`-equivalent regions), 6% opacity.
3. **Corner glows** — magenta + cyan radial gradients in opposite corners, only on hero and major sections.

### ASCII motif vocabulary

| Motif | Use |
|---|---|
| `[NN] /SECTION` | Section headers (numbered, slash-prefixed) |
| `░▒▓ 0xFF.NN.N ░▒▓` | Decorative chrome / barcodes |
| `SIG_OK · 200 · UPTIME 99.97% · ████░░ 64%` | Status pills, marquee content |
| `★ V1.18.1` | Version pills |
| `●` | List bullets (in lime) |
| `↗` | External link suffix (in magenta) |
| `⏎` | Action / submit glyph (in primary CTAs) |
| `// comment text` | Tagline and caption prefix |

### CTA specimens — three roles

- **Primary** (`./INSTALL ⏎`) — lime block, black text, 800-weight, letter-spacing 2px. Max one per section.
- **Secondary** (`$ git clone`) — cyan outline, cyan text. Inverts to filled cyan on hover.
- **Ghost** (`view source ↗`) — `#888` text, magenta arrow suffix. No border, no background.

## [02] Layout & Component Structure

### Navbar — slim status bar

- Solid `#060606` background, 1px lime divider underneath. No glassmorphism.
- 40px tall.
- Left: brand wrapped in `[ ]` — `[ CLAUDE-TERMINAL ]`.
- Center: nav links as `/features /screenshots /download /changelog` (slash-prefix, mono small caps, 11px, letter-spacing 2px).
- Right: `v1.18.1` (magenta) · `github ↗` (cyan).
- Mobile: same brand left, hamburger right opens an overlay with the same links stacked.

### Hero `[00] HOME` — left-aligned, two-column

- **Layout:** 2-column grid on desktop (`grid-cols-2`, gap 40px). Stacks on mobile (text first, then framed screenshot).
- **Left column** (text):
  - Crumb: `~/index · ● ● ●`
  - Tag: `▶ EXEC // V1.18.1 — LATEST` (lime, left-bordered)
  - H1: `CLAUDE-T̷E̷RM<span class="strike">INAL</span>` with chromatic aberration
  - Tagline (2 lines, `//` prefix): `// a multi-instance terminal manager for claude-code.\n// n parallel sessions, one operator, zero context-switching.`
  - CTAs: `./INSTALL ⏎` (primary) · `$ git clone` (secondary) · `view source ↗` (ghost)
- **Right column** (terminal-window frame around `main-view.png`):
  - 1px `#222` border on `#0a0a0a`
  - Box-shadow with magenta-on-left + cyan-on-right offset (chromatic aberration on the frame, not the image)
  - Title bar: 3-dot indicator + `main-view.png · 1280×800 · loaded`
- **Status marquee** (between hero and features):
  - Continuous left-scroll, 40s linear loop, pauses on hover
  - Content: `SIG_OK · 200 · UPTIME 99.97% · BUILD #341 · MEM 64% · LATENCY 12ms · ▓▒░ 0xFF.18.1 ░▒▓`
  - Single track, ~32px tall, top + bottom `#1a1a1a` rules.

### Features — row entries, not card grid

The current 3×2 icon-card grid is replaced entirely.

- Section header: `[02] FEATURES` with `// six things, no card-grid, no rounded purple icon-squares.` subtitle.
- Vertical gutter label: `[02] /FEATURES` rotated -90° down the left margin.
- Each feature as a row with 4 columns:
  - `02.NN` index (`#555`, letter-spacing 2px)
  - Feature name (white, uppercase, weight 700, letter-spacing 2px)
  - Description (`#888`, 11px, line-height 1.6)
  - Status pill: `[ OK ]` (lime) / `[ LIVE ]` (magenta) / `[ READY ]` (cyan), right-aligned
- Rows alternate flush-left and indented +60px for asymmetry.
- 1px magenta hairline divider between rows; 1px lime divider above the first row.
- Existing 6 features in `src/data/features.json` are preserved as-is.

### Screenshots — terminal-window frames, off-grid

- Section header: `[03] CAPTURES // last sync 0xFF.18.1`
- Layout: irregular grid — 1 large screenshot left (1.4 width units), 2 small stacked right (1 width unit each). Not symmetric.
- Each screenshot framed as a terminal window:
  - 1px `#222` border on `#0a0a0a` background
  - Title bar: 3-dot indicator + `{filename}.png · 1280×800 · loaded`
  - Magenta-on-left + cyan-on-right offset shadow (1px borders, small offsets — restrained so the screenshot stays the focal point)
- Captions below each frame: `// description` in `#888`.
- Mobile: all stack vertically.
- No lightbox, no carousel, no soft glow underneath.

### Download — terminal-style installer picker

- Section header: `[04] INSTALL`
- Two OS tabs: `[ windows ]  [ macos ]` — active tab in lime, inactive in `#888`. (Linux is not currently shipped; the existing `Download.astro` only serves `.exe` / `.msi` / `.dmg` artifacts.)
- Each tab reveals a "fake terminal output" listing the available artifacts. Layout mimics `ls` output:
  ```
  $ ls releases/v1.18.1/windows
  → ClaudeTerminal_1.18.1_x64-setup.exe   [NSIS]
  → ClaudeTerminal_1.18.1_x64_en-US.msi   [MSI]
  ```
  Each `→ filename` is the actual download link (existing GitHub-release URL pattern preserved from `Download.astro`). Hovering an entry reveals a lime download arrow on the right.
- Below the tabs: system requirements line as a `//` comment — `// requires windows 10+ / macos 11+ · node.js 18+ · claude code via npm`.
- No giant icons, no card backgrounds, no logos.

The "looks-like-a-CLI" treatment is purely visual — the underlying anchors point to the same release URLs the current site uses. No new distribution channels are added.

### Tech Stack — single mono line

- Section header: `[05] STACK`
- Single horizontal line: `STACK ─── electron · vite · typescript · react · tailwind · sqlite ───`
- Scrolls horizontally on mobile, no wrap.
- ~40px tall total. No badges, no icons.

### Footer — terminal-style sign-off

- 3 columns:
  - Left: 4-line ASCII brand block + tagline
  - Center: link list (no headers, just lines): `/features` `/screenshots` `/download` `/changelog` `github ↗` `mit ↗`
  - Right: status block: `built by @talayash · MIT · build {ISO date}` (date computed at build time from git, e.g. `27.04.26`)
- Bottom rule centered: `░▒▓ thanks for stopping by ▓▒░` in `#555`.
- ~140px tall total.

### Changelog page — git log style

- Top marquee: `LATEST · v1.18.1 · 27.04.26 · {n} commits` (same scroll behavior as the homepage marquee).
- Filter chips: `[ all ]` `[ feat ]` `[ fix ]` `[ chore ]` — active in lime, others in cyan outline.
- Each release rendered as a row: `* {hash} · {date} · v{version}` with the hash in magenta, date in cyan, version in lime.
- Notes indented below as `●` bullets (lime bullet, `#aaa` text).
- Existing data source (`src/data/changelog.json`) is preserved unchanged.

## [03] Motion & Polish

### Animations

| Element | Behavior | Duration | Cadence | Disabled by `prefers-reduced-motion` |
|---|---|---|---|---|
| Hero H1 micro-glitch | 3-frame jitter on x/y + text-shadow offset, `steps(1)` timing | 280ms | every 9s | yes |
| CTA primary hover | translateY(-1px) + magenta/cyan offset shadow | 120ms ease-out | on hover | translate only (shadow stays) |
| CTA secondary hover | invert (cyan fill, black text) | 120ms ease-out | on hover | no |
| Status marquee | continuous left-scroll | 40s linear loop, paused on hover | always | yes (frozen at start) |
| Feature row hover | faint lime bg-tint (6%) + status pill flash (3px x-shift, white color) | 280ms | on hover | bg only (flash disabled) |
| Hero scan-line load sweep | single sweep down the hero | 250ms ease-out | on first paint | yes |

Glitch is constrained to under WCAG 2.3.1's 3-flashes-per-second threshold.

### Polish details

- **Page load:** static-rendered Astro = HTML pre-painted. No skeleton, no fade-in.
- **Selection color:** `::selection { background: #a3e635; color: #060606 }`.
- **Scrollbar:** WebKit gets thin (8px) custom: dark track `#0a0a0a`, thumb `#333`, lime thumb on hover. Firefox uses `scrollbar-color`/`scrollbar-width` (lower fidelity, accepted).
- **Cursor:** default arrow, pointer on links/buttons. No body text-cursor.
- **Smooth-scroll:** `scroll-behavior: smooth` on `<html>` (already present, kept).
- **Focus rings:** 2px solid lime outline, 2px offset, only on `:focus-visible` (keyboard nav).
- **Print stylesheet:** strips backgrounds, scan lines, glow, marquee. Black-on-white.

## [04] Scope, Risks, Non-Goals

### Out of scope

- The product's own UI (screenshots are content, not subject to change).
- Build/deploy stack — Astro + Tailwind v4 + Vercel is preserved.
- New sections (no testimonials/pricing/blog). IA stays: Nav, Hero, Features, Screenshots, Download, TechStack, Footer + Changelog page.
- Substantive copy rewrites — taglines may shift to fit `//` comment style; claims/content unchanged.
- New analytics, telemetry, or third-party scripts.
- A reusable design system or component library — only enough CSS for these pages.
- SPA conversion — stays static.

### Risks and mitigations

| Risk | Mitigation |
|---|---|
| All-mono body type slows reading | Paragraphs ≤3 lines, line length ≤56ch, `//` breaks between thoughts |
| Lime CTAs unfamiliar in dev tooling | Clear button shape + verb phrasing (`./INSTALL`) + `⏎` glyph |
| Chromatic aberration vs WCAG contrast | Real text underneath is solid white on near-black (passes AAA); colored offsets are decorative, not load-bearing |
| Photosensitive viewers + glitch animation | `prefers-reduced-motion` strict override; even when active, 3 frames in 280ms = under WCAG 2.3.1 threshold |
| Purple-themed product screenshots inside lime/magenta/cyan frames | Frames restrained (1px borders, small shadow offsets); palette clash reads as "another app in a window" |
| Webfont weight (~80KB for JetBrains Mono) | Subset to Latin + symbols, preload critical weights, `font-display: swap` |
| Firefox scrollbar styling limited | Accept lower-fidelity fallback; WebKit gets full custom |

### Decisions deferred to implementation (not blocking)

- Specific monospace font (default JetBrains Mono Variable; trivial to swap).
- Whether to ship a `<canvas>` boot-sequence intro on cold load — **no**, evaluate after launch.
- Whether to keep a soft glow under screenshot frames — start without, add only if frames feel flat.

### Adjacent follow-ups (not in this spec)

- Custom OG/social-preview image matching the new H1 treatment.
- Favicon update (current works; not blocking).

## File touchpoints (preview, not prescriptive)

The implementation plan will decide structure. For orientation only, the existing files this spec touches:

- `src/styles/global.css` — palette tokens, scan-line layer, glitch keyframes, marquee, focus rings, scrollbar, reduced-motion
- `src/layouts/Layout.astro` — webfont preload, body texture
- `src/components/Navbar.astro` — slim status-bar layout
- `src/components/Hero.astro` — two-column, terminal-window frame, marquee
- `src/components/Features.astro` — row entries, gutter label, status pills
- `src/components/Screenshots.astro` — terminal-window frames, off-grid layout
- `src/components/Download.astro` — CLI install picker, manual download list
- `src/components/TechStack.astro` — single mono line
- `src/components/Footer.astro` — three-column terminal sign-off
- `src/pages/changelog.astro` — git-log style rendering
- Existing data files (`features.json`, `changelog.json`) untouched

## Acceptance

- All current sections render in the new visual language.
- All existing links and CTAs still work and point to the same URLs.
- Lighthouse a11y ≥ 95.
- `prefers-reduced-motion` disables glitch, marquee, hover-translate, and load sweep.
- Tab navigation reaches every interactive element with a visible lime focus ring.
- Mobile (<768px) renders without horizontal overflow except the deliberately-scrolling Tech Stack line.
- No new third-party scripts or analytics.
