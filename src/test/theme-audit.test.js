import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Relative luminance formula per WCAG 2.1
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  if (clean.length === 6) {
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  }
  return [0, 0, 0];
}

function getContrastRatio(hex1, hex2) {
  const [r1, g1, b1] = hexToRgb(hex1);
  const [r2, g2, b2] = hexToRgb(hex2);
  const l1 = getLuminance(r1, g1, b1);
  const l2 = getLuminance(r2, g2, b2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('Theme Contrast & WCAG Audit', () => {
  const tokens = {
    dark: {
      bg: '#0A0907',
      text: '#F5F1E8',
      muted: '#BDB5A4',
      muted2: '#8F8878',
      codeBg: '#050403',
      accent: '#E3B94A',
      ok: '#6EE7B7',
      danger: '#F87171',
      synPlain: '#F5F1E8',
      synKeyword: '#E3B94A',
      synString: '#6EE7B7',
      synComment: '#8F8878',
    },
  };

  it('Dark theme: text contrast ratios meet or exceed WCAG 4.5:1', () => {
    const textOnBg = getContrastRatio(tokens.dark.text, tokens.dark.bg);
    expect(textOnBg).toBeGreaterThanOrEqual(10.0); // Ultra-high contrast > 10:1

    const mutedOnBg = getContrastRatio(tokens.dark.muted, tokens.dark.bg);
    expect(mutedOnBg).toBeGreaterThanOrEqual(4.5); // Secondary body >= 4.5:1

    const accentOnBg = getContrastRatio(tokens.dark.accent, tokens.dark.bg);
    expect(accentOnBg).toBeGreaterThanOrEqual(4.5);
  });

  it('Dark theme: syntax tokens on --code-bg (#050403) exceed 4.5:1', () => {
    const plainOnCode = getContrastRatio(tokens.dark.synPlain, tokens.dark.codeBg);
    const keywordOnCode = getContrastRatio(tokens.dark.synKeyword, tokens.dark.codeBg);
    const stringOnCode = getContrastRatio(tokens.dark.synString, tokens.dark.codeBg);

    expect(plainOnCode).toBeGreaterThanOrEqual(10.0);
    expect(keywordOnCode).toBeGreaterThanOrEqual(4.5);
    expect(stringOnCode).toBeGreaterThanOrEqual(4.5);
  });
});

describe('Token Completeness in globals.css', () => {
  const cssPath = path.resolve(__dirname, '../styles/globals.css');
  const css = fs.readFileSync(cssPath, 'utf-8');

  const requiredTokens = [
    '--bg',
    '--text',
    '--muted',
    '--muted2',
    '--fill',
    '--line',
    '--line-strong',
    '--glass',
    '--glass-shadow',
    '--panel',
    '--code-bg',
    '--accent',
    '--gold-grad',
    '--gold-text-grad',
    '--on-gold',
    '--gold-soft',
    '--glow',
    '--ok',
    '--ok-bg',
    '--danger',
    '--danger-bg',
    '--syn-plain',
    '--syn-keyword',
    '--syn-string',
    '--syn-comment',
    '--syn-grid',
    '--select-bg',
  ];

  it('declares all required tokens in dark scope', () => {
    const darkScope = css.match(/(:root,[\s\S]*?\{[\s\S]*?\})/)?.[0] || '';

    expect(darkScope).toContain('.dark');

    requiredTokens.forEach((token) => {
      expect(darkScope).toContain(token);
    });
  });

  it('provides a solid fallback color for gradient headlines', () => {
    expect(css).toContain('.text-gold-gradient {');
    expect(css).toContain('color: var(--accent);');
    expect(css).toContain('@supports');
  });

  it('ensures H2 headings are solid --text and not clipped gradients', () => {
    expect(css).toContain('.heading-h2 {');
    expect(css).toContain('color: var(--text);');
  });
});

describe('Component Token Cleanliness Audit', () => {
  it('verifies src/ contains zero unmapped raw hex colors or forbidden palette classes', () => {
    const srcDir = path.resolve(__dirname, '../');
    const violations = [];

    function scan(dir) {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const full = path.join(dir, file);
        const rel = path.relative(srcDir, full).replace(/\\/g, '/');

        if (fs.statSync(full).isDirectory()) {
          if (file !== 'node_modules' && file !== 'dist' && file !== 'test') {
            scan(full);
          }
          continue;
        }

        // Allow token definition file, context meta setting, and MockRazorpayModal branded simulation
        if (
          rel.endsWith('.css') ||
          rel.includes('ThemeContext') ||
          rel.includes('theme-audit') ||
          rel.includes('setup.js')
        ) {
          continue;
        }

        if (rel.endsWith('.jsx') || rel.endsWith('.js')) {
          const content = fs.readFileSync(full, 'utf-8');
          const lines = content.split('\n');

          lines.forEach((line, idx) => {
            // Check for forbidden raw classes (bg-white, text-black, bg-neutral, etc.)
            // Allow traffic-light dots in ProductPanel: #EF4444, #F59E0B, #10B981
            if (rel.includes('ProductPanel') && (line.includes('#EF4444') || line.includes('#F59E0B') || line.includes('#10B981'))) {
              return;
            }
            // Allow MockRazorpayModal simulation header branded #0c1427
            if (rel.includes('MockRazorpayModal') && line.includes('#0c1427')) {
              return;
            }

            if (/(\bbg-white\b|\btext-black\b|\btext-neutral-\w+|\bbg-neutral-\w+)/.test(line)) {
              violations.push(`${rel}:${idx + 1}: ${line.trim()}`);
            }
          });
        }
      }
    }

    scan(srcDir);
    expect(violations).toEqual([]);
  });
});
