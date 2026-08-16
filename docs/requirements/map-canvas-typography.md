# Map Canvas Redesign & Small-Text Typography Floor

Status: Implemented

Follow-up increment on `feature/ui-motion-polish` after the second real-browser review: (1) the workflow connection map panel reads as a white void with large dead space; (2) small text site-wide (`.68`–`.78rem`, e.g. Playground 固定请求 / 待处理) is too small to read, especially CJK at ~11–13px.

## Goal

1. Rework the "它们如何衔接" map panel so the diagram lives in a recessed blueprint-style canvas that fills its card, with no stretch void — the user explicitly authorized deep restructuring ("可以大幅度重构").
2. Establish a site-wide small-text floor so no text renders below `.78rem`, and readable secondary text lands at `.82rem` or above, with CJK letter-tracking normalized on the touched label classes.

## Acceptance behavior

### A. Map canvas redesign (`src/pages/[locale]/workflows/index.astro` only)

- `.workflow-layout` uses `align-items: start` so the map panel hugs its content instead of stretching to the list column's ~640px height (removes the ~150px white band split above/below the diagram).
- The diagram sits in a recessed canvas: `.map-canvas` gets its own tinted surface (green-tinted `panel-soft` via `color-mix`, works in both themes), a 1px border, a radius, and a strengthened dot grid — reads as an instrument panel, not an empty card.
- Node geometry is re-spread to fill the 960×452 viewBox: nodes move outward (diagnose/handoff toward the top corners, code-design/develop/review along a lower row, develop hub slightly right of center) so internal side margins balance; all six edge paths and chip anchors are recomputed from the new node positions (Q/C midpoint math), keeping the same from/to declarations, gradient strokes, dashed marching, focus mode, pulse, and reveal behavior.
- The legend moves out of the footer strip into the map header row (right of the "它们如何衔接" eyebrow), freeing the canvas to be pure diagram; the footer markup/styles are removed. (Deviation from the approved bottom-left overlay: computed positions showed the overlay colliding with the bottom-row node titles at typical render widths; the header row achieves the same goal — no footer strip, designed placement — with zero overlap risk.)
- SVG text scales up with the diagram: edge-chip text 13→15 units, node titles 17→19 units (rendered ≈11px/14px at typical widths — up from ≈9.5/12.4); the chip `getBBox()` sizing auto-adapts.
- The map stays hidden below 840px as today; no changes to list rows, summary cards, tooltips, or the focus-mode script logic.

### B. Small-text floor (global sweep, presentation-only)

- Floor rule: no `font-size` below `.78rem` anywhere in `src/`; the tiniest mono labels (`.68`–`.76rem`) move to `.78`–`.8rem`; readable secondary text (`.78`–`.89rem` prose-like) moves to `.82`–`.92rem` per the inventory below. Base `html { font-size: 106.25% }` and body/lede/heading sizes are unchanged.
- Touched spots (from a full-repo scan): global `.badge`, `.source-stamp small`, `.lifecycle-step small`, `.lifecycle.compact strong`; Playground (step status `em`, kbd hint, turn actor/number, live tag, request-card label, tab/steps `small`, controls message, evidence footer, panel-header counts); workflows index (legend, tooltip, row summary, summary dt, about card); workflow detail (`.gate-pill`, `.meta-card dd`); evidence (`.key`, `.compare-name small`, `.case-tag`, table `th`); DocsShell (sidebar/toc titles, pager label, toc links, repo link, table `th`); docs subpages (`.status`, `.principle-abbr`, `.rule-chips`, `.layer-tag`, `.invoke-label`, `.stage-pill`, `.turn-who`, `.stage-marker`, `.result-cell small`).
- CJK tracking: for the bumped mono-label classes, a grouped `:lang(zh-CN)` rule in `global.css` reduces letter-spacing to ≤`.03em` (Latin-style wide tracking is wrong for Chinese glyphs); `.eyebrow` keeps its wide tracking as a design feature.
- Sized-up labels keep their existing padding/shape; pill-like elements (badges, step status, gate pills) may get 1–2px padding adjustments if the larger text cramps them.

## Out of scope

- Base font-size, body copy, headings, lede sizes; line-length or layout-density changes elsewhere.
- Playground/state logic, data files, copy text, routing; no new dependencies.
- The map's list column and summary column content; mobile (map already hidden <840px).
- Buttons and navigation (already ≥ `.84rem`, bold, readable).

## Assumptions

- Work continues on `feature/ui-motion-polish` (previous increments uncommitted there).
- Pure CSS/geometry change: EN and zh-CN stay behaviorally equivalent; reduced-motion and no-JS behavior unchanged.
- New node coordinates/edge paths are recomputed at implementation time; chip anchors derive from path midpoints as before.

## Solution boundary

- `src/pages/[locale]/workflows/index.astro` owns the whole map rework: layout alignment, canvas surface, node/edge geometry, legend placement, SVG text sizes.
- `src/styles/global.css` owns the shared floor bumps (`.badge`, `.source-stamp`, lifecycle sizes) and the one grouped `:lang(zh-CN)` tracking rule; page-local sizes live in each page's `<style>` block.
- No other files change.

## Implementation

- `src/pages/[locale]/workflows/index.astro`: nodes re-spread to fill the viewBox (left column x=118, right column x=842, develop hub at 480/322); all six edge paths recomputed with gentle bows and chip anchors from Q/C midpoint math; `.workflow-layout` uses `align-items: start` so the map panel hugs its content; `.map-canvas` is now a recessed blueprint canvas (4% green-tinted `panel-soft`, 1px border, 12px radius, strengthened 20px dot grid, soft radial glow behind the hub); the legend lives in the map header row (`.map-legend`, `.86rem`); edge-chip text 13→15 SVG units, node titles 17→19; tooltip, row summary, summary dt and about-card sizes bumped.
- `src/styles/global.css`: `.badge` .76→.8, `.source-stamp small` .74→.8, `.lifecycle-step small` .8→.84, compact lifecycle strong .76→.8; one grouped `html[lang='zh-CN'] :is(...)` rule tightens letter-spacing to .03em on the Latin-style mono label classes (specificity 0-2-2 beats Astro scoped rules; `.eyebrow`/`.docs-eyebrow` keep wide tracking by design).
- Playground: step status `em` .68→.78, request-card label .73→.8, turn actor/number .72→.78, live tag .75→.8, kbd hint .72→.78 (kbd .68→.78), tab/steps small .78→.82, header counts .78→.82, controls message .82→.86, evidence footer .72→.78.
- Evidence: `.key` .78→.8, compare-name small .76→.8, `.case-tag` .68→.78, scenario th .74→.8.
- Workflow detail: `.gate-pill` .68→.78 (padding 3px 10px), `.meta-card dd` .78→.82.
- DocsShell: sidebar title .76→.8, docs-eyebrow .78→.8, pager label .72→.8, toc title .72→.8, toc links .84→.88, repo link .84→.88, tree links .89→.92, tree label .84→.86, doc-table th .76→.8.
- Docs subpages: `.status`/`.rule-chips` .72→.78, `.principle-abbr` .76→.8, `.layer-tag` .72→.78, `.result-cell small` .76→.82, `.invoke-label` .74→.8, `.stage-pill` .68→.78 (padding 3px 10px), `.turn-who` .72→.78, mobile `.stage-marker` .7→.78.
- Floor audit: a full-repo grep for `font-size: .0x–.7x rem` now returns nothing below .78rem.

## Verification

- `npm test` (Windows): 14/14 passed.
- `npm run check` (WSL Node 22): 34 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` (WSL Node 22): 43 pages built.
- Build-output inspection: `dist/zh-CN/workflows/index.html` contains the new geometry (`M 164 306`, `translate(118 92)`, `translate(480 322)`), no old paths, no `<footer class="map-legend">`, and exactly one header-row `.map-legend`; the workflows CSS bundle contains the recessed canvas surface, `font-size:15px` chip text, `19px` node titles, and the header legend rule; the global bundle contains the `html[lang=zh-CN]` tracking rule; `.78rem` floor values appear in the playground/evidence/slug bundles.
- Route smoke: `/en`, `/zh-CN`, `/en/playground`, `/zh-CN/workflows`, `/zh-CN/workflows/develop`, `/en/docs`, `/zh-CN/evidence` all returned 200 (served by the user's own dev server already on :4321 — it HMR-reloads the edited source; the production artifacts were verified directly from `dist/`, so no separate preview run was needed and the dev server was left running).
- Not covered: manual visual review in a real browser — map composition and balance in light/dark themes at desktop widths, legend/chip/edge-label legibility, and small-text readability across Playground, docs, evidence, and workflows. Edge curves and chip anchors were recomputed from path geometry and should be eyeballed via the running dev server.
