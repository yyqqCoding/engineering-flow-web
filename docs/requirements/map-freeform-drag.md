# Freeform Workflow Map: Chrome-less Canvas & Draggable Nodes

Status: Implemented

Third real-browser follow-up on `feature/ui-motion-polish`: even after the recessed-canvas rework, the "它们如何衔接" map read as a boxed static illustration. The user asked (analysis-first, then approved "开始执行") for: remove the background box entirely, and make the map nodes draggable.

Also fixed in this batch as a regression (no separate record): ClientRouter page swaps reset `<html>` attributes from the server document, wiping the runtime-set `data-theme` (and `reveal-on`), so dark mode reverted to light on every navigation. Fixed in `SiteLayout.astro` by extracting the theme bootstrap into `applyTheme()` and re-running it on `astro:after-swap` (before the new page renders, no flash).

## Goal

1. Remove the double frame (panel + recessed canvas) around the connection map so the diagram floats on the page with a faint page-level blueprint grid, like the home hero texture.
2. Make the five nodes freely draggable with live edge re-routing, persistent layout, and a one-click reset — while preserving every existing behavior (gradient solid edges, marching dashes, pulse, focus mode, tooltips, draw-on-reveal, click-to-navigate).

## Implementation

- Chrome removal (`src/pages/[locale]/workflows/index.astro`):
  - The middle column dropped `panel`/`data-spot` and the canvas's tinted background, border, radius, dot grid, and glow pseudo-elements; the diagram floats on the page.
  - `.workflow-map` paints a page-level faint blueprint line grid (44px cells, radial-fade mask, ≤18px bleed so no horizontal scrollbar) plus a soft green radial glow behind the hub area; both are non-interactive pseudo-elements at `z-index: -1`.
  - The header row (eyebrow + legend) stays as a light caption row and also hosts the reset button via `.map-tools`; node circles carry a subtle drop shadow for a floating feel.
- Full-height canvas (follow-up correction after user review: "上下长度要和左侧对齐，现在只能在半截区域拖动"):
  - `.workflow-map` stretches to the grid row height (`align-self: stretch` — the list/summary columns keep `align-items: start`), and `.map-canvas`/`svg` fill the section below the header, so the map's top and bottom align with the left workflow list.
  - The viewBox baseline grew to 960×680 and the client fits the viewBox height to the canvas's real aspect (`fitViewHeight(w, h)` in the lib, clamped to [600, 920], driven by ResizeObserver), so the draggable area always fills the section at any viewport width; out-of-range aspects degrade to centered letterboxing while the grid background still covers the full section.
  - Layout state is fraction coordinates (`fx`/`fy` of the viewBox), resolved+clamped against the current view height on every frame; `data-default-layout` ships fractions. Persisted layouts are resolution-independent; old absolute-coordinate saves fail validation and fall back to defaults.
- Hub-centered default composition (second follow-up correction: "开发在中间，其他四个在四个角落，但别贴边", with a reference mockup):
  - develop sits at the exact center (480, 340); the four satellites hold inset corners — diagnose/handoff (118/842, 150), code-design/review (118/842, 578) — so all six edges radiate from/to the hub.
  - Edge constants re-derived for the radial layout: paired edges (proposal/deeper, changed/findings) spread their hub contact points with ∓18° rotations (hub contacts land ≥36° apart) and bow apart with opposite normals at bend ±40 so both the curves and their label chips stay separated (chip anchors verified ≥32px apart pairwise); findings uses a larger −52 bow into the empty lower area; the two single edges (undefined/session) use a gentle −12 bow toward the empty top-center.
  - All geometry verified numerically with the shared lib before build (endpoints on circle borders, contact angles, chip spacing, defaults inside clamps); the hub glow moved back to the canvas center (`50% 54%`).
- Derived edge geometry (`src/lib/map-geometry.mjs`, new, framework-independent):
  - `edgeGeometry(a, b, { offA, offB, bend, gap })` computes an edge purely from the two node circles: endpoints sit on the circle borders (center line rotated by `offA`/`offB` degrees at departure/arrival, radius + 6px gap); the path is a quadratic bow whose control point is the chord midpoint offset along the travel-direction normal by `bend`; the label-chip anchor is the t=0.5 point `(S + 2C + E) / 4`. Returns `{ d, sx, sy, ex, ey, lx, ly }`.
  - `clampNode(pos, r, view)` keeps dragged nodes inside the (dynamic-height) viewBox with room for halos and below-node titles; `fitViewHeight(w, h)` owns the aspect-fit clamp.
  - The six edges' shapes come from per-edge constants (see the hub-centered bullet for the current radial values); earlier iterations verified the constant approach reproduces hand-tuned curves within 2px.
  - SSR (frontmatter) and the client drag handler share this one module, so the first paint and every drag frame use identical geometry.
- Dragging (client script in the same page, inside the existing `onPageLife`):
  - Left-button pointer drag on a node moves it (pointer capture, screen→viewBox transform via `getScreenCTM().inverse()` + `DOMPoint`, clamped); every connected edge's path, pulse path, gradient endpoints, and chip position update per frame through `applyLayout()`.
  - A 6px movement threshold separates drag from click; after a real drag the following click on the node link is suppressed (capture-phase handler), so click-to-navigate still works for plain clicks.
  - Positions persist to `localStorage` (`engineering-flow-map-layout`, fraction coordinates validated on load); a "复位布局 / Reset layout" ghost button appears in the header row only when the layout differs from the default, and restores defaults + clears storage. (Deviation from the approved "double-click resets": double-click would fire the node's link navigation on the first click — the header button is the safe reset.)
  - Grab/grabbing cursors; `touch-action: none` on nodes; the hover tooltip hides while dragging.
  - Preserved: focus-mode pairing (list rows ↔ nodes ↔ edges), per-tone arrowheads and `--focus-tone`, marching dashes, traveling pulse, draw-on-reveal (`pathLength=100` is length-invariant), chip `getBBox` sizing, tooltips (positioned from live bounding boxes).
- New copy: `workflowsPage.mapReset` ('Reset layout' / '复位布局') in both locales (`src/data/site.ts`).
- Coverage: `test/map-geometry.test.mjs` proves endpoints land on circle borders (r + gap), zero-bend edges are straight with the chip on the chord midpoint, the t=0.5 anchor matches a hand-computed curve, offset angles pick the departure side, clamping respects the viewBox, and `fitViewHeight` passes through in-range aspects while clamping narrow/wide canvases to the limits.
- No new dependencies; EN/zh-CN equivalent; reduced-motion unchanged (drag is user-initiated); map still hidden below 840px.

## Verification (2026-08-17)

- `npm test`: 20/20 pass (14 existing + 6 map-geometry, including `fitViewHeight` limits).
- `npm run check` (WSL Node 22): 0 errors / 0 warnings / 0 hints.
- `npm run build` (WSL Node 22): 43 pages.
- Pre-build numeric proof of the radial layout via the shared lib: all endpoints on circle borders, hub contact angles ≥36° apart, all six chip anchors ≥32px apart pairwise, defaults inside clamps (e.g. proposal `M 146.7 542.1 Q 271.4 432.6 440 390`, chip (282.4,449.3)).
- dist inspection: `viewBox="0 0 960 680"` baseline; `data-default-layout` ships fraction coordinates; hub rendered at `translate(480 340)`; derived paths match the numeric proof; `align-self: stretch` in the shipped CSS; the JS bundle contains the drag logic (`engineering-flow-map-layout`), `ResizeObserver`, and the dynamic `viewBox` write.
- Route smoke ran against a temporary preview of the fresh dist on port 4400 (stopped afterwards): both locales 200 with the new markup (`translate(480 340)` hub, `translate(118 150)` corner). The user's own dev server on :4321 was left untouched — note it runs inside WSL, where file watching on `/mnt/e` does not see Windows-side edits, so it serves stale markup until restarted.
- Manual browser review at desktop and mobile widths is still owed by the user (hub-centered composition, full-height alignment, drag feel, reset button).

## Out of scope

- Physics/force layout, node collision, edge crossing avoidance, keyboard nudging (possible follow-up), mobile dragging (map hidden <840px as today).
- List rows, summary cards, other pages; base layout of the three-column grid.

## Assumptions

- Work stayed on `feature/ui-motion-polish`; the theme-persistence regression fix rode along (regression from the earlier ClientRouter increment, fixed directly per bug protocol).
- Default node positions equal the previously approved layout; stored user layouts survive navigation via localStorage (ClientRouter replaces the DOM, so in-memory state would not).

## Solution boundary (actual)

- `src/lib/map-geometry.mjs` owns all edge/endpoint/clamp math; SSR and client both consume it.
- `src/pages/[locale]/workflows/index.astro` owns markup (chrome removal, reset button), styles (page grid, floating nodes, cursors), and the drag/persist/reset client logic in its existing `onPageLife` script.
- `src/data/site.ts` owns the single new copy key in both locales.
- `test/map-geometry.test.mjs` covers the lib; no changes to existing tests.
