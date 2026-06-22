# Visual Checklist (pre-release)

Run this checklist before publishing a new version, in **both** editors, after
`npm run generate` and `npm run check` (which must exit 0). It is a manual spot-check that the
generated theme files actually look right — the drift check proves the files match the source,
this proves the source looks correct.

Load the theme via live preview first:

- **VS Code** — press `F5` (launches the Extension Development Host using `packages/vscode`),
  then Command Palette → **Preferences: Color Theme** → **Sunwjy Theme**.
- **Zed** — Command Palette → **zed: install dev extension** → pick `packages/zed/`, then
  **theme selector: toggle** → **Sunwjy Theme**.

Open a project with at least one JS/TS file, one JSON file, and one Markdown file so every
syntax section below has something to inspect.

---

## VS Code

### Editor body
- [ ] Editor background is the deep dark base; foreground text is clearly readable against it.
- [ ] Active line / current-line highlight is visible but subtle.
- [ ] Line numbers: inactive numbers are dim, the active line number is brighter.
- [ ] Selection and find-match highlights are visible without hiding the text underneath.
- [ ] Indent guides and wrap guide are faint, not distracting.

### Sidebar / file tree (Explorer)
- [ ] Sidebar background matches the intended chrome color (distinct from the editor body).
- [ ] File/folder labels are readable; the selected/active item is clearly highlighted.
- [ ] Git status decorations (modified / untracked / ignored) use the expected accent colors.
- [ ] Folder chevrons / icons are visible.

### Status bar
- [ ] Status bar background and foreground are readable.
- [ ] Items (branch, problems, language mode, position) are legible.
- [ ] No item disappears into the background.

### Tab bar
- [ ] Active tab is visually distinct from inactive tabs (background + text).
- [ ] Inactive tab text is readable but clearly de-emphasized.
- [ ] Modified-file dot and the tab close button are visible on hover.

### Syntax highlighting
**JavaScript / TypeScript**
- [ ] Keywords (`const`, `import`, `return`, `function`) — distinct accent.
- [ ] Strings vs numbers vs booleans are each distinguishable.
- [ ] Function names / calls and class/constructor names stand out from plain variables.
- [ ] Comments are clearly de-emphasized (and italic if intended).
- [ ] Types / interfaces (TS) read distinctly from values.

**JSON**
- [ ] Property keys vs string values are distinguishable.
- [ ] Numbers, `true`/`false`, and `null` are colored as expected.
- [ ] Braces/brackets/punctuation are visible but not overpowering.

**Markdown**
- [ ] Headings stand out from body text.
- [ ] **Bold** and *italic* render with the intended emphasis styling.
- [ ] Inline `code` and fenced code blocks are readable against the background.
- [ ] Links and list markers are distinguishable from body text.

### Terminal (bonus)
- [ ] Integrated terminal background/foreground match the theme.
- [ ] The 16 ANSI colors (run e.g. a color test) look correct and readable.

---

## Zed

### Editor body
- [ ] Editor background is the deep dark base; foreground text is clearly readable.
- [ ] Active line highlight is visible but subtle.
- [ ] Line numbers: inactive dim, active line number brighter.
- [ ] Selection and search-match highlights are visible without obscuring text.
- [ ] Indent guides / wrap guides are faint.
- [ ] Multiple cursors / collaborators use the `players` and `accents` colors as expected.

### Sidebar / file tree (Project panel)
- [ ] Panel background matches the intended chrome color (distinct from the editor body).
- [ ] File/folder names are readable; selected entry is clearly highlighted.
- [ ] Git status (created / modified / deleted / ignored) uses the expected accent colors.
- [ ] Indent guides in the panel are visible but subtle.

### Status bar
- [ ] Status bar background and foreground are readable.
- [ ] Items (branch, diagnostics, cursor position) are legible.

### Tab bar
- [ ] Active tab is visually distinct from inactive tabs (background + text).
- [ ] Inactive tab text is readable but de-emphasized.
- [ ] Modified indicator and close affordance are visible.

### Syntax highlighting
**JavaScript / TypeScript**
- [ ] Keywords are a distinct accent (and italic if intended).
- [ ] Strings vs numbers vs booleans/constants are each distinguishable.
- [ ] Functions / methods / constructors stand out from plain variables.
- [ ] Comments are clearly de-emphasized (italic if intended).
- [ ] Types / enums read distinctly from values.
- [ ] Operators and punctuation (brackets/delimiters) are visible.

**JSON**
- [ ] Property keys vs string values are distinguishable.
- [ ] Numbers, booleans, and `null` are colored as expected.
- [ ] Punctuation (braces/brackets) is visible but not overpowering.

**Markdown**
- [ ] Titles/headings stand out (and bold where intended).
- [ ] **Bold** and *italic* (`emphasis` / `emphasis.strong`) render correctly.
- [ ] Inline `code` and fenced blocks (`text.literal`) are readable.
- [ ] Link text / URIs and list markers are distinguishable from body text.

### Terminal (bonus)
- [ ] Integrated terminal background/foreground match the theme.
- [ ] The 16 ANSI colors plus the 8 `dim_*` colors look correct and readable.

---

## Cross-editor consistency
- [ ] The two editors look like the **same** theme — backgrounds, accents, and syntax hues match.
- [ ] Any color changed this release looks correct in **both** editors (a single palette edit
      should propagate identically).
- [ ] No element is unreadable (insufficient contrast) in either editor.
