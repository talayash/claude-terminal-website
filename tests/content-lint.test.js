import { describe, it, expect } from 'vitest';
import { readFile, readdir } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));

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
      /a3e635/i,
      /ec4899/i,
      /06b6d4/i,
      /\baurora\b/i,
      /\bglass\b/i,
      /\bscan-?line\b/i,
    ];
    for (const pattern of banned) {
      expect(css, `global.css contains banned token matching ${pattern}`).not.toMatch(pattern);
    }
  });

  it('global.css defines the .surface utility used by /stat', async () => {
    // /stat still relies on `.surface` for its card treatment. If this
    // rule disappears, every KPI/chart card renders as flat with no
    // border and no background.
    const css = await readFile(join(ROOT, 'src/styles/global.css'), 'utf8');
    expect(css).toMatch(/\.surface\s*\{[^}]*(background|border)/);
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

describe('Feature titles', () => {
  it('are sentence case (spec [05])', async () => {
    // Sentence case = first word capitalized, subsequent words lowercase
    // (except proper nouns). This is a heuristic: we reject titles that
    // contain more than one capitalized word past the first, unless the
    // extra caps are known proper nouns.
    const features = JSON.parse(
      await readFile(join(ROOT, 'src/data/features.json'), 'utf8')
    );
    const properNouns = new Set(['Claude', 'GitHub', 'Windows', 'macOS', 'CLI', 'F1', 'F2']);
    const offenders = [];
    for (const f of features) {
      // Skip the first word; check words 2+. A word starting with an
      // uppercase letter that isn't in properNouns and isn't part of a
      // hyphenated compound (Multi-Terminal) is a violation.
      const words = f.title.split(/\s+/).slice(1);
      for (const w of words) {
        // Ignore parenthetical annotations like "(F1)".
        const stripped = w.replace(/^[\(\-]|[\)\.,;:]$/g, '');
        if (/^[A-Z]/.test(stripped) && !properNouns.has(stripped)) {
          offenders.push(`"${f.title}" contains capitalized word "${stripped}"`);
        }
      }
    }
    expect(offenders, offenders.join('\n')).toEqual([]);
  });
});

describe('Layout head', () => {
  it('Layout.astro exposes a <slot name="head" /> for per-page meta', async () => {
    // Required so /stat can inject its noindex robots meta. Without this,
    // the /stat page becomes indexable.
    const src = await readFile(join(ROOT, 'src/layouts/Layout.astro'), 'utf8');
    expect(src).toMatch(/<slot\s+name=["']head["']\s*\/?>/);
  });

  it('Layout.astro declares social preview meta tags', async () => {
    const src = await readFile(join(ROOT, 'src/layouts/Layout.astro'), 'utf8');
    expect(src).toMatch(/property=["']og:image["']/);
    expect(src).toMatch(/name=["']twitter:card["']/);
    expect(src).toMatch(/name=["']twitter:image["']/);
  });

  it('Layout.astro declares a favicon', async () => {
    const src = await readFile(join(ROOT, 'src/layouts/Layout.astro'), 'utf8');
    expect(src).toMatch(/rel=["']icon["'][^>]+href=/);
  });
});
