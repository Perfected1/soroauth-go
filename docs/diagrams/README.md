# Diagrams

The two diagrams [ARCHITECTURE.md](../../ARCHITECTURE.md) embeds — the signing
flow and the CAP-71-01 delegate tree — live here. Each one is committed twice:
its Graphviz source (`*.dot`) and its rendered output (`*.svg`).

| Source                                 | Rendered                               | Shown in                                         |
| -------------------------------------- | -------------------------------------- | ------------------------------------------------ |
| [signing-flow.dot](signing-flow.dot)   | [signing-flow.svg](signing-flow.svg)   | The "Signing flow" section of ARCHITECTURE.md.   |
| [delegate-tree.dot](delegate-tree.dot) | [delegate-tree.svg](delegate-tree.svg) | The "Delegate model" section of ARCHITECTURE.md. |

## Regenerating

Render both SVGs from their sources:

```sh
make diagrams        # or: node docs/diagrams/render.mjs
```

Check that the committed SVGs match their sources, without writing anything:

```sh
make diagrams-check  # or: node docs/diagrams/render.mjs --check
```

The check runs in CI, so a `.dot` edited without re-rendering fails the build.

## Never edit an SVG by hand

The `.svg` files are generated output. Editing one by hand makes it disagree
with the `.dot` next to it, and the CI drift check fails — the same rule the
golden vectors are held to. Change the `.dot` and re-render.

## Why WebAssembly Graphviz, and why a white background

`render.mjs` uses [@viz-js/viz](https://github.com/mdaines/viz-js), Graphviz
compiled to WebAssembly, rather than the `dot` binary. That means a checkout
needs only Node and this repository's own npm dependencies to reproduce the
diagrams, and no system Graphviz to install. The dependency is pinned exactly in
`package.json`, because a different Graphviz lays the graph out differently and
a rendered file is committed evidence.

Both sources set `bgcolor="white"`. A rendered SVG carries its own colors and
does not inherit the page's, so a transparent or black-background diagram would
become unreadable in one of GitHub's themes. A white page with dark text is
legible in both.

## Text fallback

A rendered image is not readable in a terminal or to a screen reader that does
not fetch it, so each diagram also stays in ARCHITECTURE.md as a plain-text
block inside a `<details>` element, next to the image it mirrors.
