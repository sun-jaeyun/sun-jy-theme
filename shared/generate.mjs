#!/usr/bin/env node
// Dependency-free theme generator (Node built-ins only).
//
// Reads the named color palette and each editor-specific template, then performs
// PURE TEXT substitution of the palette tokens into the template text. The result
// is emitted VERBATIM — it is never re-serialized via JSON.stringify, so tab/2-space
// indentation, key order, the Zed `themes[]` wrapper, and the trailing newline are
// all preserved byte-for-byte. JSON.parse is used only as a validity gate.
//
// Token syntax in templates:
//   {{name}}      -> palette[name]            (base hex)
//   {{name|AA}}   -> palette[name] + "AA"     (base hex + 2-hex alpha suffix)
//
// Case rule: VSCode output is UPPERCASE hex, Zed output is lowercase hex.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const palette = JSON.parse(readFileSync(join(here, 'palette.json'), 'utf8')).colors;

// One target per editor: which template, where it is written, and the hex case.
const targets = [
  {
    name: 'vscode',
    template: join(here, 'templates', 'vscode.template.json'),
    output: join(root, 'packages', 'vscode', 'themes', 'sunwjy-theme.json'),
    transform: (hex) => hex.toUpperCase(),
  },
  {
    name: 'zed',
    template: join(here, 'templates', 'zed.template.json'),
    output: join(root, 'packages', 'zed', 'themes', 'sunwjy-theme.json'),
    transform: (hex) => hex.toLowerCase(),
  },
];

// Substitute palette tokens into the template text. `transform` sets the hex case.
export function render(templateText, transform) {
  const text = templateText
    .replace(/\{\{(\w+)\|([0-9A-Fa-f]{2})\}\}/g, (_, name, alpha) => {
      const hex = palette[name];
      if (!hex) throw new Error(`Unknown palette token: ${name}`);
      return transform(hex + alpha);
    })
    .replace(/\{\{(\w+)\}\}/g, (_, name) => {
      const hex = palette[name];
      if (!hex) throw new Error(`Unknown palette token: ${name}`);
      return transform(hex);
    });
  // Guard: no `{{` may survive substitution. A residual marker means a malformed
  // token (typo, bad alpha suffix, stray braces) that would otherwise ship silently.
  const residual = text.match(/\{\{[^}]*\}?\}?/);
  if (residual) throw new Error(`Unsubstituted token marker remains: ${residual[0]}`);
  return text;
}

// Render one target's output text (template -> substituted text), validating JSON.
export function renderTarget(target) {
  const templateText = readFileSync(target.template, 'utf8');
  const text = render(templateText, target.transform);
  JSON.parse(text); // validity gate only — never re-serialized
  return text;
}

function main() {
  for (const target of targets) {
    const text = renderTarget(target);
    writeFileSync(target.output, text);
    console.log(`generated ${target.name}: ${target.output}`);
  }
}

export { targets };

// Run main() only when invoked directly as the entry script — robust on paths
// with spaces/non-ASCII. When imported (or via `node -e`) process.argv[1] may be
// undefined, in which case this is not the entry module and main() must not run.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
