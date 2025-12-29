# Guidance for AI coding agents

Purpose: Help an AI contributor become productive quickly in this repository.

**Big Picture**:
- **Static site**: The repository is a small, static campaign website composed of `index.html`, `styles.css`, and images in `assets/`.
- **No build system**: There are no `package.json`, `pyproject.toml`, `Makefile`, or tooling files; changes are applied directly to source files and can be previewed in a browser.

**Key files & directories**:
- `index.html`: Single-page content, navigation anchors (`#events`, `#news`, `#about`, `#connect`), and references to `styles.css` and `assets/` images.
- `styles.css`: All visual styles; uses CSS variables in `:root` and vanilla class selectors.
- `assets/`: Images used by the page (`jillian-headshot.png`, `campaign-sign.png`).
- `README.md`: Short project descriptor. Use it for high-level context only.

**How to run & preview locally**:
- Quick static server (recommended):

  ```bash
  python3 -m http.server 8000
  # then open http://localhost:8000 in your browser
  ```

- You may also open `index.html` directly in the browser, but a local server preserves relative path behavior.

**Project-specific editing patterns**:
- Images: Keep image files inside `assets/`. `index.html` references `assets/<name>.png` directly; renaming an asset requires updating `index.html` and any CSS referencing the image.
- Fonts: The page loads Google Fonts via `<link>` in `index.html`; do not remove without confirming fallback strategy.
- CSS: Styling is centralized in `styles.css`. The project uses CSS variables for color tokens (see `:root`) — prefer these tokens when adding colors.
- Structure: The site uses semantic sections (`<header>`, `<main>`, `<section>`, `<footer>`) and utility-like class names (e.g., `container`, `hero-grid`, `hero-copy`). Follow existing naming patterns rather than introducing a heavy naming scheme.
- Accessibility: `alt` text is present for images and `aria-label` is used on social link. Preserve or improve accessibility attributes when editing.

**Common tasks & examples**:
- Add a new event card: edit the `#events` section in `index.html` and follow the existing `<article>` markup and `meta` classname for date/location.
- Update hero images: replace files in `assets/` and keep the same filenames, or update the `<img src>` paths in `index.html`.
- Change colors: update values in `:root` in `styles.css` so all components inherit the change.

**What to look for when exploring the codebase**:
- Search for references to `assets/` to find where images are used.
- Check `index.html` anchors for navigation; ensure any new sections are linked in the top nav if they should be reachable.
- If adding JavaScript or build tooling, add explicit manifest files (`package.json`, etc.) and document the new workflow in `README.md`.

**Merging with an existing `.github/copilot-instructions.md`**:
- If this file already exists, preserve any project-specific guidance it contains. Merge by keeping unique, actionable lines and combining duplicated sections.

**Limitations & questions to ask the maintainers**:
- Hosting & deployment details are not present. Ask: Where is the site hosted (Netlify/Vercel/static hosting)? Do assets need cache-busting?
- Testing & CI: There are no tests or CI configs. Ask whether a CI pipeline or linting should be added before creating toolchains.

If anything in this guidance is unclear or you want additional examples (commit/PR conventions, deployment steps, or adding a build pipeline), tell me what to add or provide the missing files and I'll iterate.
