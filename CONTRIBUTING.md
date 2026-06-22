# Contributing to Sunwjy Theme

Thanks for your interest in contributing! This repository is a small **monorepo** that ships
the theme for two editors — **VS Code** and **Zed** — from a single shared color palette.
There is still no compile step and no runtime dependencies: a tiny set of dependency-free Node
scripts (Node built-ins only) generate the two theme files from one source of truth.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/) and/or [Zed](https://zed.dev)
- [Node.js](https://nodejs.org/) (any recent LTS — used only to run the generator/checker scripts)
- [Git](https://git-scm.com/)
- (Optional) [`@vscode/vsce`](https://github.com/microsoft/vscode-vsce) to package the VS Code extension locally:
  ```bash
  npm install -g @vscode/vsce
  ```

## Project structure

```
sunwjy-theme/
├── package.json                       # Root DEV tooling only (private, no deps) — generate/check/bump scripts
├── shared/
│   ├── palette.json                   # ★ Single source of truth — every color lives here, by name
│   ├── templates/
│   │   ├── vscode.template.json        # VS Code theme with colors tokenized as {{name}} / {{name|AA}}
│   │   └── zed.template.json           # Zed theme with colors tokenized as {{name}} / {{name|AA}}
│   ├── generate.mjs                   # Renders templates + palette → the two committed theme files
│   ├── check-drift.mjs                # Byte-compares regenerated output vs committed files (CI gate)
│   └── bump-version.mjs               # Lock-steps the version across both packages + CHANGELOG
├── packages/
│   ├── vscode/
│   │   ├── package.json                # VS Code extension manifest (publisher, contributes.themes)
│   │   ├── themes/sunwjy-theme.json     # GENERATED — do not edit by hand
│   │   ├── public/icon.png
│   │   ├── CHANGELOG.md
│   │   ├── LICENSE.md
│   │   └── README.md
│   └── zed/
│       ├── extension.toml              # Zed extension manifest (schema_version = 1)
│       ├── themes/sunwjy-theme.json     # GENERATED — do not edit by hand
│       └── README.md
├── docs/
│   ├── visual-checklist.md            # Pre-release visual QA checklist (both editors)
│   └── zed-schema-audit.md            # Zed theme schema v0.2.0 coverage audit
├── .vscode/launch.json                # "Extension" debug config → packages/vscode
└── README.md
```

> **The two `packages/*/themes/sunwjy-theme.json` files are generated.** Never edit them
> directly — your change would be overwritten on the next `npm run generate`, and the drift
> check would fail. Edit the **palette** and the **templates** instead (see below).

## The single-source workflow

All colors live once in `shared/palette.json` as named entries (e.g. `accentTeal`, `textPrimary`,
`bg`). The two templates are byte-for-byte copies of the editors' theme files with **only** the
hex literals replaced by palette tokens:

- `{{name}}` → the base color (e.g. `{{accentTeal}}` → `#80CBC4`)
- `{{name|AA}}` → the base color plus a 2-hex alpha suffix (e.g. `{{black|60}}` → `#00000060`)

The generator performs pure text substitution and writes the result verbatim, so indentation,
key order, and the trailing newline are preserved exactly. VS Code output is **uppercase** hex;
Zed output is **lowercase** hex — the generator handles the casing, so you always write the same
token name in both templates.

Typical change (e.g. tweaking a color):

```bash
# 1. Edit the color once, in the palette:
#    shared/palette.json  →  change the hex for the named color

# 2. Regenerate both theme files from palette + templates:
npm run generate

# 3. Verify the committed outputs match palette + templates (byte-for-byte):
npm run check        # exits 0 on success, 1 on drift

# 4. Commit BOTH the source change (palette/template) AND the regenerated theme files.
```

Adding a **new** color: add a named entry to `shared/palette.json`, then reference it from the
relevant template(s) as `{{name}}` / `{{name|AA}}`, then `npm run generate` && `npm run check`.

Changing **which** color a UI element / scope uses: edit the token in the template(s) (the
scope-to-color mapping is held in the templates, not the palette), then regenerate and check.

## Getting started

1. **Fork** the repository to your own GitHub account.
2. **Clone** your fork:
   ```bash
   git clone https://github.com/<your-username>/sunwjy-theme.git
   cd sunwjy-theme
   ```
3. **Create a branch** for your change:
   ```bash
   git checkout -b fix/comment-color
   ```

## Live preview (VS Code)

There is no compile step, so you can preview changes live:

1. Open the project folder in VS Code.
2. Press `F5` (or run the **Extension** configuration from the **Run and Debug** view). The
   debug config points at `packages/vscode`, so this launches an **Extension Development Host**
   with the theme loaded.
3. In that window: Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **Preferences: Color Theme** → **Sunwjy Theme**.
4. Edit `shared/palette.json` / `shared/templates/vscode.template.json`, run `npm run generate`,
   save, and the host window picks up the regenerated `packages/vscode/themes/sunwjy-theme.json`.

## Live preview (Zed)

1. Open Zed → Command Palette → **zed: install dev extension** → select the `packages/zed/` directory.
2. Command Palette → **theme selector: toggle** → choose **Sunwjy Theme**.
3. After editing the palette/template and running `npm run generate`, reload the dev extension to
   see the regenerated `packages/zed/themes/sunwjy-theme.json`.

## Editing tips

- Keep hex in the existing `#RRGGBB` / `#RRGGBBAA` format and **uppercase** in `shared/palette.json`
  (the generator lowercases Zed output automatically).
- To find a VS Code scope, run **Developer: Inspect Editor Tokens and Scopes** in the dev host.
- Keep changes minimal and consistent with the surrounding palette — this theme aims to stay
  close to the original Darker High Contrast look.
- Zed theme key coverage is tracked in [`docs/zed-schema-audit.md`](docs/zed-schema-audit.md).

## Testing your changes

Before opening a pull request:

- Run `npm run generate` and `npm run check` — **`npm run check` must exit 0** (no drift).
- Confirm both themes still load: VS Code Extension Development Host and the Zed dev extension.
- Walk the [`docs/visual-checklist.md`](docs/visual-checklist.md) for the surfaces and languages you touched.
- Make sure text stays readable — keep adequate contrast against the dark background.

## Submitting a pull request

1. Commit your changes — include **both** the source edit (palette/template) and the regenerated
   `packages/*/themes/*.json` files in the same PR.
2. Push your branch to your fork.
3. Open a pull request against `main` with:
   - A short description of **what** changed and **why**.
   - Before/after screenshots if the change is visual (highly encouraged).
4. If your change is user-facing, bump the version (see below) — `npm run bump` adds the
   `packages/vscode/CHANGELOG.md` entry for you.

### Moving / renaming files

When relocating files, keep the move and any content edits in **separate commits** (commit 1:
pure `git mv` with no content change; commit 2: the edits). This preserves `git log --follow`
history across the move.

## Versioning

`npm run bump <version>` lock-steps the version across both packages and the changelog:

```bash
npm run bump 1.1.0
```

It updates `packages/vscode/package.json`, `packages/zed/extension.toml` (the `version` field —
not `schema_version`), and adds a `packages/vscode/CHANGELOG.md` heading. After running it, all
three locations report the same version.

## Packaging & publishing (optional / maintainers)

Publishing to either marketplace is a **manual** step.

**VS Code** — produce a `.vsix` from the package directory:

```bash
cd packages/vscode
vsce package
```

Then install it via the Extensions view → **⋯** menu → **Install from VSIX…**, or publish with
`vsce publish`. The package includes `themes/`, `public/icon.png`, and `LICENSE.md`.

**Zed** — theme extensions are published through the
[zed-industries/extensions](https://github.com/zed-industries/extensions) repository; the
submission points at the `packages/zed` subpath. See the
[Zed docs on developing themes](https://zed.dev/docs/extensions/themes) for the flow.

---

All contributions are welcome — bug fixes, enhancements, or documentation improvements. Together,
we can keep this theme alive and polished!
