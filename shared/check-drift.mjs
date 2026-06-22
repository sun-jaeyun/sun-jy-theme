#!/usr/bin/env node
// Dependency-free drift checker (Node built-ins only).
//
// Regenerates each theme in memory (the exact same text-substitution the generator
// emits) and BYTE-compares it to the committed output file. Any mismatch — including
// whitespace, key order, case, or a missing trailing newline — exits 1. Identical
// output exits 0. This is the byte-level fidelity guarantee (AC3/AC9).

import { readFileSync } from 'node:fs';
import { targets, renderTarget } from './generate.mjs';

let drift = false;

for (const target of targets) {
  const expected = renderTarget(target);
  let actual;
  try {
    actual = readFileSync(target.output, 'utf8');
  } catch (err) {
    console.error(`DRIFT [${target.name}]: cannot read ${target.output} (${err.code})`);
    drift = true;
    continue;
  }
  if (Buffer.from(expected).equals(Buffer.from(actual))) {
    console.log(`ok [${target.name}]: ${target.output}`);
  } else {
    console.error(`DRIFT [${target.name}]: ${target.output} differs from palette+template`);
    drift = true;
  }
}

if (drift) {
  console.error('check-drift: FAIL — run `node shared/generate.mjs` to resync.');
  process.exit(1);
}
console.log('check-drift: PASS — all outputs match palette+templates.');
