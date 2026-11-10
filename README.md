# Playable ads portfolio

A buildless portfolio for Alexey Smozhankov. Open it through an HTTP server because the catalogue uses native JavaScript modules. No package installation or build step is required.

## Local preview

```sh
node tools/serve.mjs
```

Open `http://127.0.0.1:8765`. Set `PORT` to select another local port.

## Content ownership

- `js/projects.mjs` is the single catalogue for all supplied playables, localized case copy, genre filters, collaboration credits and PDF exports. Three projects are marked `featured`; their localized `focus`, `role` and `decisions` fields supply the case-study cards and extended descriptions.
- `assets/previews/` contains actual browser captures of the playables. Match each filename to the project's permanent ID.
- `assets/showreel/` contains silent gameplay clips used by the five-phone hero and the three featured case studies. Each page load samples five different games for the hero. When session storage is available, games shown on the previous load in that tab are excluded; changing languages keeps the current hero selection. One visibility observer pauses offscreen previews; opening a case, switching away from the page or either pause control stops playback. Reduced-motion preferences start previews paused. Rebuilding featured copy releases the previous videos and observer targets. The hero scrolls horizontally on smaller screens.
- `assets/decor/playground.webp` is a decorative environment, separate from the actual game captures. Its generation prompt and provenance are recorded in `assets/decor/README.md`.
- `assets/*/index.html` are the supplied, unmodified game exports. Folder names are intentionally preserved.
- `index.html`, `css/style.css` and `js/main.js` own the portfolio interface.
- `assets/portfolio/` contains the two downloadable PDF editions. Each starts with three full-page case studies, followed by the complete 21-project catalogue.

Every supplied playable has its own card, including alternate scenarios for the same game. Cases use `?project=<id>&lang=ru#case` or `lang=en`; these links open an overview without automatically loading the game. Play creates one iframe. Stop, switching projects and closing the dialog unload the previous iframe. Rotation changes the embedded viewport without restarting the game.

The initial collection shows eight projects. The reveal control opens all 21 and moves keyboard focus to the first newly revealed project. Genre filters and search always operate on the complete catalogue. Resetting an empty result shows every project. The expanded state survives language changes until the page is reloaded.

## Presentation references

## Focused checks

```sh
node --test tests/projects.test.mjs
node --check js/main.js
```

To check only hero selection and video availability, run `node --test --test-name-pattern showreel tests/projects.test.mjs`.

The checks cover catalogue completeness against the actual asset folders, preview files, combined genre/search filtering, invalid routes and links under a GitHub Pages subdirectory. For UI changes, inspect the gallery and case dialog at 320, 768, 1024 and 1440 pixels. Exercise play, restart, rotation, expansion, stop, project selection, Escape, browser history and both languages.

## Refresh the PDFs

```sh
python tools/export-portfolio.py
```

Requires Python 3 with ReportLab and Node.js. The exporter reads the same catalogue as the website and uses Segoe UI on Windows or DejaVu Sans on Linux. `PORTFOLIO_FONT_DIR` can point to a directory containing `segoeui.ttf` and `segoeuib.ttf`. Render and visually inspect the resulting PDFs after changing copy or previews.

## Static hosting

Serve this directory as static files with `.mjs` mapped to JavaScript. Keep the relative asset structure. No application server is required for deployment.
