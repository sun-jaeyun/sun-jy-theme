# Contributing to Sunwjy Theme

Thanks for your interest in contributing! This is a small VS Code color theme, so contributing is straightforward — no build step, no dependencies. This guide walks you through everything you need.

## Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)
- (Optional) [`@vscode/vsce`](https://github.com/microsoft/vscode-vsce) if you want to package the extension locally:
  ```bash
  npm install -g @vscode/vsce
  ```

## Project structure

```
sunwjy-theme/
├── package.json              # Extension manifest (registers the theme)
├── themes/
│   └── sunwjy-theme.json      # The theme definition — colors live here
├── public/
│   └── icon.png               # Extension icon
├── .vscode/launch.json        # "Extension" debug configuration
├── CHANGELOG.md               # Notable changes per version
└── README.md
```

Almost all changes happen in **`themes/sunwjy-theme.json`**.

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

## Development workflow

This extension has no compile step, so you can preview changes live:

1. Open the project folder in VS Code.
2. Press `F5` (or run the **Extension** configuration from the **Run and Debug** view). This launches an **Extension Development Host** window with the theme loaded.
3. In that window, open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **Preferences: Color Theme** → **Sunwjy Theme**.
4. Edit `themes/sunwjy-theme.json`, save, and the host window updates so you can see your changes immediately.

## Editing the theme

The theme is a standard VS Code color theme JSON file:

- **`colors`** — UI element colors (editor background, sidebar, status bar, tabs, etc.). Keys follow the [VS Code theme color reference](https://code.visualstudio.com/api/references/theme-color).
- **`tokenColors`** — syntax highlighting. Each entry targets one or more TextMate `scope`s and sets `foreground` and/or `fontStyle`.

Tips:
- Use hex colors in the existing `#RRGGBB` / `#RRGGBBAA` format and keep them **uppercase** to match the current style.
- To find the scope you need to color, run **Developer: Inspect Editor Tokens and Scopes** from the Command Palette in the Extension Development Host.
- Keep changes minimal and consistent with the surrounding palette — this theme aims to stay close to the original Darker High Contrast look.

## Testing your changes

Before opening a pull request:

- Confirm the theme still loads without errors (check the Extension Development Host).
- Verify your change across a few languages (e.g. JS/TS, JSON, Markdown, a markup language).
- Make sure text stays readable — keep adequate contrast against the dark background.

## Submitting a pull request

1. Commit your changes with a clear message.
2. Push your branch to your fork.
3. Open a pull request against `main` with:
   - A short description of **what** changed and **why**.
   - Before/after screenshots if the change is visual (highly encouraged).
4. If your change is user-facing, add an entry to [`CHANGELOG.md`](CHANGELOG.md) under a new version heading.

## Packaging (optional)

To produce a `.vsix` for local testing:

```bash
vsce package
```

Then install it via the Extensions view → **⋯** menu → **Install from VSIX…**.

---

All contributions are welcome — bug fixes, enhancements, or documentation improvements. Together, we can keep this theme alive and polished!
