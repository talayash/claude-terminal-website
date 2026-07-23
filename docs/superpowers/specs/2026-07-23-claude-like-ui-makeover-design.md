# UI/UX Makeover - "Quiet Product" (Claude-adjacent)

**Date:** 2026-07-23
**Status:** Spec, awaiting implementation plan
**Scope:** `claude-terminal-website` (marketing/landing site)
**Supersedes:** `2026-04-27-ui-makeover-design.md` (aurora + mono direction)

## Problem

The site was just rebuilt under the aurora + mono spec (PR #2, commit `08c1efa`) - dark background, all-monospace, chromatic-aberration H1, ASCII motifs, bracketed section headers, dense IA. The direction reads as bold but also loud, unmistakably "made for developers" in a way that feels performative. The updated goal is a redesign that borrows DNA from Anthropic's own aesthetic: quiet, editorial, product-focused. Simple, abstract, deliberately not-AI-generated.

## Direction

**Quiet Product.** Warm off-white paper background, ink type, coral used only as a disciplined signature accent. Single sans family (Inter Variable). Centered small hero. Manifesto-pattern features list. Editorial screenshot spread. Five sections total on the homepage. No gradients, glassmorphism, drop shadows, purple, cyan, or lime. No chromatic aberration, scan lines, ASCII motifs, or marquee.

The site reads as calm and confident, closer to the tone of claude.ai's product interface than to a dev-tool marketing page.

Directions considered and rejected during brainstorming:

- **Warm Editorial** (cream + coral + serif display, book-like). Anthropic-branded feel; overrepresents Anthropic's identity when the product hosts Claude sessions but is not made by Anthropic.
- **Abstract Paper** (paper white + serif italic + rust hairline, magazine-editorial). More illustrated register than product-marketing register. Tips toward Anthropic-blog rather than product homepage.

## [01] Visual Language

### Palette - 3 primary tokens + neutrals, no gradients

| Token | Hex | Role |
|---|---|---|
| paper | `#faf9f5` | page background, primary CTA text |
| ink | `#252525` | primary type, primary CTA fill |
| coral | `#c86a4a` | signature accent (see below - exactly 4 uses sitewide) |
| muted-label | `#8a8a85` | kicker + label text, secondary UI |
| muted-body | `#4a4a45` | body copy, descriptions, footer content |
| hairline | `#e8e7e1` | row dividers, section rules |
| frame | `#e0dfd9` | screenshot borders |

The primary set is paper, ink, coral. The muted, hairline, and frame tokens are neutral tints of paper (progressively darker), used structurally rather than expressively. Coral is the only chromatic token.

### Type - single sans, Inter Variable

- **H1 (hero):** 48-64px fluid (`clamp(48px, 7vw, 64px)`), weight 500, letter-spacing -0.4px, line-height 1.05. One italic word rendered in coral.
- **H2 (section):** 22-28px, weight 500, sentence case, line-height 1.2. No uppercase, no wide letter-spacing.
- **Kicker / section label:** 12px, weight 500, muted-label color, sentence case, no letter-spacing gimmicks.
- **Body:** 15px, weight 400, line-height 1.6, muted-body color. Max-width 62ch.
- **Small / meta:** 12-13px, weight 400, muted-label color.

Single family, single font file (Inter Variable). Preload weights 400 and 500. `font-display: swap`.

### Signature - the coral thread

Coral appears in exactly 4 named places sitewide. Two are literal 5-6px discs; two are coral-colored type or outline. Discipline on placement is the design.

1. **Nav status dot:** leading coral disc before the version, e.g. `● v1.26.0`.
2. **Section label dots:** leading coral disc before each section H2, e.g. `● Features`, `● The app`, `● Download`.
3. **Feature indices:** the numerals `01`, `02`, ..., `06` in the Features section rendered in coral (no separate dot; the coral colored number is itself the accent).
4. **Focus rings:** 2px coral outline, 2px offset, `:focus-visible` only.

Coral does not appear anywhere else. No coral buttons, no coral underlines, no coral status bars, no coral text inside body copy, no coral in the hero H1 outside the single italic word. This restraint is the load-bearing decision.

The italic H1 word (see below) is a fifth coral usage but is treated as a one-off editorial gesture rather than a repeating signature element - hence the "exactly 4 named places" for the recurring accent.

### One editorial gesture - italic H1

The hero H1 renders one word (typically the phrase's key verb or preposition) as italic in coral. Example: `Run Claude Code *in parallel.*` The italic word does two things: signals that the site has been designed rather than templated, and reinforces the product's central promise. Used exactly once on the site.

## [02] Homepage IA

Five sections total, plus footer:

```
Nav
Hero
Features
Screenshots
Download
Footer
```

**Cut entirely from the current site:** Trust, Parallel, Compare, ChangelogPreview, CallToAction, TechStack. Their component files stay in the tree (candidates for deletion during implementation cleanup) but are removed from `src/pages/index.astro`.

Vertical rhythm between sections: 96px desktop, 64px mobile. Text sections use a 640px max-width column; the Screenshots section uses a 960px max-width column. Side padding: 20px mobile, 32px desktop.

## [03] Section specs

### Nav

- Sticky top, 56px tall, paper background, 1px hairline bottom border.
- Left: `Claude Terminal` wordmark, weight 500.
- Right: `Features · Download · GitHub ↗` as plain text links, 13px, muted-body color, no button chrome.
- No logo mark, no dark-mode toggle, no CTA button in nav.
- Mobile: same wordmark left; links collapse to a hamburger button that toggles an inline dropdown listing the same links stacked directly below the nav. No modal overlay, no backdrop, no full-screen takeover.

### Hero

- Centered, 640px column, ~120px top padding on desktop, 64px on mobile.
- Kicker: `● v1.26.0 · macOS + Windows` (coral dot + fetched version + platforms in muted-label).
- H1: `Run Claude Code in parallel.` with the phrase `in parallel` set in italic coral.
- Sub: single sentence, 17px, muted-body. Example: `A terminal manager for developers who spawn many Claude sessions at once.`
- Buttons: primary filled ink pill `Download` (paper text, 8px border-radius, 10x18px padding, no shadow). Secondary ghost link `GitHub →` in muted-body, coral underline on hover.
- **No hero screenshot.** The Screenshots section below carries product-image weight. Pure-type hero is the intent.

### Features

Manifesto pattern. 640px column.

- Section label: `● Features` (H2 with leading coral dot).
- Sub-label (optional, 12px muted-label): short framing sentence. Example: `What the app does, briefly.`
- 6 features from `src/data/features.json` rendered as numbered rows:

  ```
  01   Multi-terminal management
       Create, manage, and monitor multiple Claude Code instances with a
       tab-based interface and drag-and-drop reordering.
  ```

  - Index column (`01`): 32px wide, coral, 13px, weight 500, top-aligned.
  - Name (top line): 16px, weight 500, ink color.
  - Description: 14px, weight 400, muted-body, line-height 1.55, max-width 56ch.
- 1px hairline dividers between rows and above the first / below the last row.
- No icons, no thumbnails, no cards, no hover backgrounds.
- The `icon` field in `features.json` is unused by this treatment (kept in JSON for possible future use).

### Screenshots

Editorial spread. 960px column (wider than text sections).

- Section label: `● The app`.
- 3-image asymmetric grid on desktop:
  - `main-view.png` - large, spans 2 rows on the left, ~60% width.
  - `grid-view.png` - small, top-right.
  - `settings.png` - small, bottom-right.
- Frames: 1px `#e0dfd9` border, 4px border-radius, no shadow, no glow. Native aspect ratios preserved.
- Below the spread: single caption line, 13px muted-body, comma-separated: `Main view, Grid layout, Settings.`
- Mobile (<768px): all three stack vertically full-width; caption below the last one.
- No lightbox, no carousel, no lazy-fade-in. Static markup.

### Download

640px column.

- Section label: `● Download`.
- Optional sub-label: one-line framing (e.g., `Universal binaries, direct from GitHub Releases.`).
- Two OS blocks stacked, each:
  - Platform name: `macOS` or `Windows`, 18px, weight 500.
  - Requirements line: 12px muted-label. Example: `macOS 11+ · Node.js 18+ · Claude Code via npm`.
  - Download button per artifact: plain outlined button, 12px, weight 500, ink text, 1px ink border, transparent fill, coral border on hover. Buttons list the artifact filename (e.g. `ClaudeTerminal_1.26.0_aarch64.dmg`), not a generic "Download" label.
  - Preserve the exact GitHub release URLs the current `Download.astro` uses. This spec changes the visual treatment only.
- No fake-terminal treatment, no big platform icons, no card backgrounds.

### Footer

3-zone flex row, ~120px tall, 1px top hairline, paper background.

- Left: `Claude Terminal` wordmark + one-line tagline in muted-label.
- Center: link list, comma-separated: `Features, Download, GitHub ↗, Changelog, MIT`. Muted-body, 13px.
- Right: version + build date, 12px muted-label. Example: `v1.26.0, built 23 Jul 2026`.
- No coral dot in the footer. Quiet coda.
- Mobile: stacks vertically, left-aligned, 24px vertical spacing.

## [04] Motion + polish

- **Motion budget:** near-zero.
  - Focus rings on `:focus-visible` only (2px coral outline, 2px offset).
  - Button hovers: 0.08 opacity darken on the fill (150ms ease-out).
  - Text-link hovers: coral underline animates in (`text-underline-offset: 4px`, 150ms).
  - No scroll-triggered animations, no fade-ins, no parallax. Site is static-rendered (Astro), HTML pre-painted.
- **Reduced-motion:** no changes needed - there is nothing to disable.
- **Selection:** `::selection { background: #c86a4a; color: #faf9f5 }`.
- **Cursor:** default; pointer on interactive.
- **Scrollbar:** native, no custom styling.
- **Print:** default browser styles. No print stylesheet.

## [05] Copy conventions

- **Em-dash rule:** the em-dash character (`—`, U+2014) is disallowed in all app content and source code. Use a regular hyphen-minus (`-`, U+002D) instead, even where prose typically wants a longer dash. This is a project-wide convention, not just spec-scoped.
- **Case:** sentence case for all headings, labels, and buttons. No UPPERCASE, no Title Case On Every Word.
- **Voice:** declarative, present tense, active voice. Short sentences. Avoid marketing verbs like "empower", "unlock", "accelerate".
- **Numbers and technicals:** lowercase (`macos 11+`, `node.js 18+`, `github`, `claude code`). Version numbers use lowercase `v` (`v1.26.0`).
- **Punctuation between items:** middle-dot `·` for inline separators (`macOS 11+ · Node.js 18+`). Commas for list items in prose.

Existing copy in the current components should be reviewed against these conventions during implementation, not rewritten wholesale.

## [06] Ancillary pages

### `/changelog`

- Kept. Uses existing `src/data/changelog.json` unchanged.
- Restyled to the manifesto pattern: each release is a numbered row.
  - Row header: `v1.26.0` in coral (14px weight 500) + release date in muted-label (12px).
  - Notes below: one bullet per note as a plain unordered list, muted-body 14px, line-height 1.6. No filter chips, no marquee, no fake commit hashes.
- Reverse chronological, newest first.
- 640px column.

### `/stat`

Hidden telemetry dashboard. Kept functional; palette repainted to match.

- Background: paper. Text: ink. KPI numbers: coral where the current design uses `#d97757` (visually identical; consolidates onto the shared coral token).
- Charts: repaint stroke/fill colors to ink and coral. Keep chart interactions and data behavior unchanged.
- Font: Inter Variable across all page text (drops the mixed `font-mono` treatment).
- Lower priority; can ship as a follow-up commit after the marketing pages land.

## [07] Scope, risks, non-goals

### Out of scope

- Product UI (screenshots are content; the app is dark by design and stays that way).
- Build/deploy stack: Astro + Tailwind v4 + Vercel preserved. No SPA conversion.
- Testimonials, pricing, blog, docs.
- Analytics, telemetry, or third-party scripts changes.
- Dark-mode toggle. Single light theme only.
- Illustrations, custom mascot, favicon redesign.
- Custom fonts beyond Inter Variable.
- Reusable design-system package. Only enough CSS for these pages.
- Substantive copy rewrites (spot-corrections to match the conventions in [05] are in scope; a full editorial pass is not).

### Risks and mitigations

| Risk | Mitigation |
|---|---|
| Dark product screenshots on cream background clash visually | Accept honestly. Thin 1px border, no glow. Precedent: anthropic.com puts dark visuals on cream without apology. |
| Coral contrast on cream fails WCAG for the dot | The coral dot is decorative, not load-bearing. Text is ink `#252525` on paper `#faf9f5`, AAA. The dot never carries text meaning by color alone. |
| "Pure-type hero" reads underdesigned | The italic word in the H1 and the coral dot in the kicker carry the signature. If it still feels flat during implementation, revisit hero H1 scale (bump upper clamp) before adding any ornament. |
| Cutting 6 sections removes content some visitors expected (comparison table, changelog preview on homepage) | `/changelog` remains accessible via nav and footer. Comparison content wasn't load-bearing - most visitors scan features and download. |
| Inter Variable font weight | Preload weights 400 and 500 only; use `font-display: swap`. WOFF2 only. |
| Signature dot appears everywhere and becomes noise | Discipline is enforced by the "exactly 4 named places" rule in [01]. Reviewer should reject any additional coral usages that appear during implementation without a spec update. |
| Screenshot spread's asymmetric layout feels off on tablet widths | Between 768px and 1024px, fall back to a 3-across horizontal strip. All-equal thumbnails, native aspect. |

### Decisions deferred to implementation

- Exact Inter Variable weight preload set (baseline: 400 + 500; italic 500 may be needed for the H1).
- Precise line-heights and letter-spacing at each breakpoint (baseline values here; tune during visual QA).
- Whether the Nav mobile dropdown animates open (baseline: no animation - toggle only).

### Adjacent follow-ups (not in this spec)

- Refreshed OG/social image consistent with the new H1 treatment.
- `/stat` page repaint (deferred to a follow-up commit, per [06]).
- Deletion of unused component files (`Trust`, `Parallel`, `Compare`, `ChangelogPreview`, `CallToAction`, `TechStack`) after a review cycle confirms they are not referenced.

## [08] File touchpoints

Preview, not prescriptive. The implementation plan will decide the exact edit sequence.

Files this spec modifies:

- `src/styles/global.css` - palette tokens, type scale, hairline rules, focus rings, selection color, remove aurora/glass/scan-line utilities from the previous design.
- `src/layouts/Layout.astro` - Inter Variable preload, minimal head shell, remove aurora background layers.
- `src/components/Navbar.astro` - slim status-bar treatment.
- `src/components/Hero.astro` - centered small, italic H1 word, no screenshot.
- `src/components/Features.astro` - manifesto pattern (numbered rows).
- `src/components/Screenshots.astro` - editorial spread (1 large + 2 small).
- `src/components/Download.astro` - two-block platform picker, plain outlined buttons.
- `src/components/Footer.astro` - three-zone slim footer.
- `src/pages/index.astro` - remove imports and instances for `Trust`, `Parallel`, `Compare`, `ChangelogPreview`, `CallToAction`, `TechStack`.
- `src/pages/changelog.astro` - manifesto pattern for release history.
- `src/pages/stat.astro` - palette + type repaint (follow-up commit acceptable).

Files that become unused after this spec lands (candidates for deletion in a follow-up cleanup):

- `src/components/Trust.astro`
- `src/components/Parallel.astro`
- `src/components/Compare.astro`
- `src/components/ChangelogPreview.astro`
- `src/components/CallToAction.astro`
- `src/components/TechStack.astro`

Existing data files (`features.json`, `changelog.json`) are unchanged in shape and content.

## [09] Acceptance

- All target sections render in the new visual language, on desktop and mobile.
- All existing links and CTAs still work: same GitHub release URLs, same GitHub repo link, same `/changelog` path.
- Lighthouse accessibility score >= 95 on both `/` and `/changelog`. Contrast on body text and buttons passes WCAG AAA.
- Keyboard navigation reaches every interactive element with a visible 2px coral focus ring.
- Mobile (<768px) renders without horizontal overflow anywhere.
- No new third-party scripts or analytics.
- No use of tokens from prior aesthetics (no purple, cyan, lime, aurora glow, chromatic aberration, scan lines, ASCII motifs, marquee).
- No em-dash characters (`—`) anywhere in the app source (`src/**`, `.github/**`, `README.md`) or in rendered content. Historical spec/plan documents in `docs/superpowers/` are excluded from this rule.
- The coral accent appears in exactly the 4 named places from [01] and nowhere else.
