#!/usr/bin/env node
// Dependency-free version lockstep (Node built-ins only).
//
// Usage: node shared/bump-version.mjs <version>
//
// Sets the same version in three places:
//   1. packages/vscode/package.json   — JSON `version` field
//   2. packages/zed/extension.toml    — the anchored `^version = "..."` line ONLY
//                                        (never the `schema_version = 1` line)
//   3. packages/vscode/CHANGELOG.md   — a new `## [<version>] - <date>` heading
//                                        inserted above the most recent entry

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

const PKG = join(root, 'packages', 'vscode', 'package.json');
const TOML = join(root, 'packages', 'zed', 'extension.toml');
const CHANGELOG = join(root, 'packages', 'vscode', 'CHANGELOG.md');

// Semver-ish: MAJOR.MINOR.PATCH with an optional pre-release/build tail.
const SEMVER = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

function fail(msg) {
  console.error(`bump-version: ${msg}`);
  console.error('Usage: node shared/bump-version.mjs <version>   (e.g. 1.1.0)');
  process.exit(1);
}

const version = process.argv[2];
if (!version) fail('missing <version> argument.');
if (!SEMVER.test(version)) fail(`invalid version "${version}" — expected semver like 1.1.0.`);

// 1) package.json — preserve the file's own indentation (it uses 2 spaces) and
//    trailing newline by reading the literal text and replacing only the version
//    string value, rather than re-serializing the whole object.
{
  const text = readFileSync(PKG, 'utf8');
  const re = /("version"\s*:\s*")[^"]*(")/;
  if (!re.test(text)) fail(`could not find "version" in ${PKG}.`);
  writeFileSync(PKG, text.replace(re, `$1${version}$2`));
}

// 2) extension.toml — replace ONLY the anchored top-level version line. The
//    `^...$` multiline anchor never matches `schema_version = 1`.
{
  const text = readFileSync(TOML, 'utf8');
  const re = /^version = "[^"]*"/m;
  if (!re.test(text)) fail(`could not find anchored version line in ${TOML}.`);
  writeFileSync(TOML, text.replace(re, `version = "${version}"`));
}

// 3) CHANGELOG.md — insert a new dated heading above the first existing entry.
//    Idempotent: refuse to run if this version's heading already exists, so
//    re-running bump never produces a duplicate section. The new entry carries a
//    minimal `### Changed` placeholder body to match the existing changelog style.
{
  const text = readFileSync(CHANGELOG, 'utf8');
  // Match `## [<version>]` regardless of the date tail, anchored at line start.
  const escaped = version.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (new RegExp(`^## \\[${escaped}\\]`, 'm').test(text)) {
    fail(`CHANGELOG.md already has an entry for [${version}].`);
  }
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const entry = `## [${version}] - ${date}\n\n### Changed\n- \n`;
  const firstEntry = text.search(/^## /m);
  let next;
  if (firstEntry === -1) {
    // No prior entries: append the entry at the end.
    next = `${text.replace(/\s*$/, '')}\n\n${entry}`;
  } else {
    next = text.slice(0, firstEntry) + `${entry}\n` + text.slice(firstEntry);
  }
  writeFileSync(CHANGELOG, next);
}

console.log(`bump-version: set version to ${version} in package.json, extension.toml, and CHANGELOG.md.`);
