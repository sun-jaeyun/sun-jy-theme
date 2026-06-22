# Zed Theme Schema v0.2.0 Audit

Evidence-based completeness audit of `packages/zed/themes/sunwjy-theme.json` against the
Zed **theme** schema declared in the file's `$schema`:
`https://zed.dev/schema/themes/v0.2.0.json`.

> Note: this audits the **theme** schema (`v0.2.0`), **not** the extension manifest schema
> (`extension.toml` `schema_version = 1`). The two are unrelated schemas — do not conflate.

## Method

The schema's `definitions.ThemeStyleContent.properties` enumerates every allowed top-level
key under `themes[].style`. We diffed that set against the keys actually present in the theme.
Each fill was added as a palette token in `shared/templates/zed.template.json` and regenerated
with `node shared/generate.mjs`; `node shared/check-drift.mjs` exits 0 after the change.

## Top-level `style` key coverage

| Metric | Count |
| --- | --- |
| Schema-defined `ThemeStyleContent` keys | 142 |
| Present before audit | 141 |
| Added by this audit | 1 (`accents`) |
| Present after audit | **142 / 142** |
| Missing after audit | 0 |

### Already present (representative — 141 keys, not exhaustive)

These were already in the theme before the audit and were **not** touched:

| Category | Keys (present) |
| --- | --- |
| Borders | `border`, `border.variant`, `border.focused`, `border.selected`, `border.transparent`, `border.disabled` |
| Surfaces / elements | `elevated_surface.background`, `surface.background`, `background`, `element.background`, `element.hover`, `element.active`, `element.selected`, `element.disabled`, `drop_target.background`, `ghost_element.*` |
| Text / icon | `text`, `text.muted`, `text.placeholder`, `text.disabled`, `text.accent`, `icon`, `icon.muted`, `icon.disabled`, `icon.placeholder`, `icon.accent` |
| Chrome | `status_bar.background`, `title_bar.background`, `title_bar.inactive_background`, `toolbar.background`, `tab_bar.background`, `tab.inactive_background`, `tab.active_background`, `panel.*`, `pane.*`, `pane_group.border`, `scrollbar.*` |
| Editor | `editor.foreground`, `editor.background`, `editor.gutter.background`, `editor.line_number`, `editor.active_line_number`, `editor.active_line.background`, `editor.highlighted_line.background`, `editor.invisible`, `editor.wrap_guide`, `editor.active_wrap_guide`, `editor.indent_guide`, `editor.indent_guide_active`, `editor.document_highlight.*`, `editor.subheader.background` |
| Terminal | `terminal.background`, `terminal.foreground`, `terminal.bright_foreground`, `terminal.dim_foreground`, `terminal.ansi.*` — all 16 ANSI colors **plus** the 8 `terminal.ansi.dim_*` colors |
| Status / VCS indicators | `error{,.background,.border}`, `warning{,.background,.border}`, `info{,.background,.border}`, `success{,.background,.border}`, `hint{,.background,.border}`, `conflict{,.background,.border}`, `created{,.background,.border}`, `deleted{,.background,.border}`, `modified{,.background,.border}`, `renamed{,.background,.border}`, `hidden{,.background,.border}`, `ignored{,.background,.border}`, `predictive{,.background,.border}`, `unreachable{,.background,.border}` |
| Misc | `background.appearance`, `link_text.hover`, `search.match_background` |
| Players | `players` (8 entries — `cursor`/`background`/`selection`) |
| Syntax | `syntax` (41 token categories — see below) |

### Added by this audit

| Key | Why added | Value (palette tokens → generated hex) |
| --- | --- | --- |
| `accents` | The **only** schema-defined top-level `style` key that was absent. It is the array Zed uses to rotate UI accent colors. We populate it from the theme's existing accent hues (same palette colors already used by `players`/syntax), so no new colors were invented. Per the Zed convention (cf. the bundled `gruvbox` theme) accent entries are **opaque** `#rrggbbff`. | `accentTeal,blue,green,magenta,orange,red,yellow` each with `\|ff` → `#80cbc4ff #82aaffff #c3e88dff #c792eaff #f78c6cff #ff5370ff #ffcb6bff` |

## `syntax` token coverage

`syntax` is an open map (`additionalProperties` in the schema), so the schema does not enumerate
a fixed token list. The theme already defines **41** categories:

```
attribute, boolean, comment, comment.doc, constant, constructor, embedded,
emphasis, emphasis.strong, enum, function, function.method, function.decorator,
hint, keyword, label, link_text, link_uri, number, operator, predictive,
preproc, primary, property, punctuation, punctuation.bracket, punctuation.delimiter,
punctuation.list_marker, punctuation.special, string, string.escape, string.regex,
string.special, string.special.symbol, tag, text.literal, title, type, variable,
variable.special, variant
```

This already covers the categories used by Zed's own bundled themes (One, Gruvbox, Ayu).

### Intentionally skipped

| Item | Reason for skipping |
| --- | --- |
| Finer syntax sub-tokens (`keyword.import`, `keyword.operator`, `keyword.type`, `variable.member`, `variable.parameter`, `function.builtin`, `type.builtin`, `comment.block`, `string.doc`, `namespace`, …) | **Not schema-enumerated** (the `syntax` map allows arbitrary keys), and Zed **falls back gracefully** to the parent token (`keyword.import` → `keyword`, `variable.member` → `variable`, etc.). Adding them would mean inventing color assignments with no schema basis and would not change rendering versus the existing parent tokens — i.e., not a *meaningful* gap. Following P5 (evidence-first) and DD4, we fill only the schema-defined gap (`accents`). These remain easy future additions if a concrete fidelity need appears. |

## Verification

- `node shared/generate.mjs` regenerates both themes from `shared/palette.json` + templates.
- `node shared/check-drift.mjs` → exit **0** (committed Zed/VSCode outputs match palette+templates byte-for-byte).
- VSCode theme output is **unchanged** by this audit (only the Zed template/output were touched).
- Post-audit top-level `style` coverage: **142 / 142** schema keys present, 0 missing.
