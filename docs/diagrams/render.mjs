#!/usr/bin/env node
//
// Render the committed .dot sources under docs/diagrams/ to the .svg files
// that ARCHITECTURE.md embeds.
//
// Graphviz runs here as WebAssembly (@viz-js/viz, pinned exactly in
// package.json), not as the `dot` binary, so a checkout needs only Node and the
// repository's own npm dependencies to reproduce the diagrams byte for byte.
// The version is pinned rather than caret-ranged on purpose: the rendered SVG
// is committed evidence, and a different Graphviz would lay the graph out
// differently and show as drift.
//
//   node docs/diagrams/render.mjs           # write the SVGs
//   node docs/diagrams/render.mjs --check   # fail if they are out of date
//
// The sources set bgcolor="white" so the diagrams stay readable in both GitHub
// themes; see the header comment in each .dot.

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { instance } from "@viz-js/viz";

const here = path.dirname(fileURLToPath(import.meta.url));
const diagrams = ["signing-flow", "delegate-tree"];
const checkOnly = process.argv.includes("--check");

const viz = await instance();

let drifted = false;
for (const name of diagrams) {
  const source = await readFile(path.join(here, `${name}.dot`), "utf8");
  // engine "dot" and format "svg" are explicit so a change to a default cannot
  // silently change the committed files.
  const svg = viz.renderString(source, { engine: "dot", format: "svg" });
  const target = path.join(here, `${name}.svg`);

  if (checkOnly) {
    let committed = "";
    try {
      committed = await readFile(target, "utf8");
    } catch {
      committed = "";
    }
    if (committed !== svg) {
      drifted = true;
      console.error(
        `docs/diagrams/${name}.svg is out of date with ${name}.dot. ` +
          `Regenerate it with: node docs/diagrams/render.mjs`,
      );
    }
    continue;
  }

  await writeFile(target, svg);
  console.log(`wrote docs/diagrams/${name}.svg`);
}

if (checkOnly && drifted) {
  process.exit(1);
}
if (checkOnly) {
  console.log("diagrams are up to date");
}
