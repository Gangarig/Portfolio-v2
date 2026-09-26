# Gangarig Nyamsuren — Portfolio

A responsive portfolio built with semantic HTML, CSS, and vanilla JavaScript.

**[Visit the portfolio](https://gangarig.github.io/Portfolio-v2/)** · **[Try ShiftPlanner](https://gangarig.github.io/shift-planner-demo/)**

## Features

- Project case study with a real ShiftPlanner demo screenshot
- Downloadable English CV
- Responsive layout, keyboard navigation, and reduced-motion support
- Light and dark themes; saved preferences are optional
- No framework, build step, external fonts, tracking, or analytics

## Local preview

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080`. Relative paths also work under GitHub Pages' `/Portfolio-v2/` path.

## Files

- `index.html` — content, metadata, and semantic structure
- `styles/` — design tokens, themes, base styles, and responsive components
- `js/theme.js` — early saved-theme initialization
- `js/site.js` — theme toggle, current year, and email copying
- `assets/resume.pdf` — public, downloadable CV
- `assets/shiftplanner-preview.png` — demo screenshot with fictional sample records

## Deployment

Run `node --test tests/site.test.mjs` to check local links, asset filename case, theme behavior, and email copying before deployment.

GitHub Pages publishes from the `live` branch. Push verified changes to `live` and keep `main` synchronized. Do not add a second deployment workflow on `main`: the existing `github-pages` environment only permits the `live` deployment branch.

## Content updates

Keep the CV and portfolio facts consistent. Refresh the screenshot when the demo interface changes. Do not add confidential workplace data to this public repository; ShiftPlanner's demo is separate from the workplace MVP.
