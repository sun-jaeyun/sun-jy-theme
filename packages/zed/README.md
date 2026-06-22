# Sunwjy Theme for Zed

A Zed port of [Sunwjy Theme](../../README.md) — a fork of the Community Material Theme (Legacy Version), Darker High Contrast.

## Install

### From the Zed extension registry

Once published: open the command palette (`cmd-shift-p` / `ctrl-shift-p`) → **zed: extensions** → search for **Sunwjy Theme** → Install. Then **theme selector: toggle** and pick **Sunwjy Theme**.

### As a local dev extension (try it before publishing)

1. Open Zed.
2. Command palette → **zed: install dev extension**.
3. Select this `packages/zed/` directory.
4. Command palette → **theme selector: toggle** → choose **Sunwjy Theme**.

### Manual (theme file only)

Copy `themes/sunwjy-theme.json` into your Zed themes directory:

```sh
cp themes/sunwjy-theme.json ~/.config/zed/themes/
```

Then select it via **theme selector: toggle**.

## Structure

```
packages/zed/
├── extension.toml          # Zed extension manifest
└── themes/
    └── sunwjy-theme.json    # Theme definition (Zed schema v0.2.0)
```

## Publishing

Theme extensions are published through the [zed-industries/extensions](https://github.com/zed-industries/extensions) repository. See the [Zed docs on developing themes](https://zed.dev/docs/extensions/themes) for the submission flow.
