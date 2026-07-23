import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

describe('Astro build', () => {
  it('astro build completes without errors', () => {
    let output;
    try {
      output = execFileSync(npmCmd, ['run', 'build'], {
        stdio: 'pipe',
        encoding: 'utf8',
        timeout: 120_000,
        // .cmd files on Windows require a shell to execute; shell:false is
        // used on POSIX where 'npm' is a real binary (no injection risk).
        shell: process.platform === 'win32',
      });
    } catch (err) {
      const stdout = err.stdout ? err.stdout.toString() : '';
      const stderr = err.stderr ? err.stderr.toString() : '';
      throw new Error(`astro build failed:\n${stdout}\n${stderr}`);
    }
    expect(output).toMatch(/Complete!|built in|generated/i);
  }, 120_000);
});
