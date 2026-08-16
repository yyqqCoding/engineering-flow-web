# Workflow Map Rework & Frontend Polish Pass 2

Status: Implemented

Checkpoint 1 (map rework, list-row stagger, Playground step pulse, copy trim) and the Checkpoint 2 extension (cross-page transition, hover prefetch, hero choreography, Lifecycle auto-advance, process-rail growth, copy-icon morph, bar count-up) were both approved ("开始实施") and are implemented as recorded below.

## Goal

Follow-up increment to `ui-motion-polish` after real-browser review: the workflow connection map reads as stiff wireframe, small redundant copy adds noise, and the user has authorized deeper frontend-only restructuring (including full rework where warranted) to reach top-tier elegance.

## Acceptance behavior

- Map rework (`src/pages/[locale]/workflows/index.astro`):
  - Every edge declares its `from`/`to` node slugs; solid edges render with a source-tone → target-tone gradient stroke instead of a flat gray.
  - Conditional (dashed) edges animate a slow marching-dash flow; solid edges keep the existing traveling pulse.
  - Axis-straight edge segments become gently bowed curves; geometry stays inside the current 960×452 viewBox and node positions.
  - Edge labels render as small pill chips (panel background, hairline border) drawn inside the SVG at the path midpoint, so they scale with the diagram; per-tone arrow markers let a lit edge tint its arrowhead.
  - Focus mode: hovering a node or a workflow list row lights that node's connected edges in its tone and dims unconnected edges/nodes; leaving restores. This extends the existing `wf-live` pairing.
- Motion additions elsewhere (small, high-value only): workflow list rows stagger in on first reveal; the Playground's current step dot gets a soft pulse.
- Copy trim, applied to both locales in parallel:
  - Delete `workflowsPage.mapHint` (the bottom legend already explains solid vs. dashed).
  - Drop the third small-print line on home stat cards (`home.stats[*][2]`).
  - Keep: Playground notice card (demo disclaimer), keyboard hint (shortcut discoverability), evidence control-group lines (data meaning), the "why explicit invocation" paragraph (content), and all detail-page copy.
- All motion stays gated behind `prefers-reduced-motion` / `pointer: fine`; no-JS renders fully visible content; English and zh-CN stay behaviorally equivalent.

### Checkpoint 2 extension (site-wide sweep)

Already present and not repeated: grain, spotlight cards, magnetic CTA, theme circle transition, nav indicator, count-ups, scroll reveals, ClientRouter, self-hosted Inter Variable, layered shadows, `::selection`, `:focus-visible` ring, smooth scrolling, balanced headings, sticky blurred header, button press feedback.

- Global fluency:
  - Gentle cross-page view transition (old fades out ~140ms, new fades in with an 8px rise ~240ms), scoped so the theme-circle transition keeps overriding it; explicitly disabled under reduced motion.
  - Astro prefetch on hover (`prefetch: { prefetchAll: true, defaultStrategy: 'hover' }`) so ClientRouter navigations render from prefetched HTML.
- Home: choreographed hero entrance (eyebrow → title fragments → lede → actions → flow panel, CSS-only delays); the Lifecycle panel auto-advances its active step on an interval (pause on hover / hidden tab / reduced motion, cleanup on page swap).
- Workflow detail: process-rail steps reveal with stagger and the connector line grows from the top as steps enter; copy buttons morph the copy icon into a check while `.copied` (shared with the docs CodeBlock treatment).
- Evidence: the comparison-bar numbers (`45/51` etc.) count up via the existing `data-countup` helper.

## Out of scope

- Routing, data models, the Playground state machine, and main body copy.
- New runtime dependencies, animation libraries, 3D/WebGL, scroll-jacking.
- Restructuring pages whose current structure already works (home, docs, evidence, detail) beyond the listed motion additions.

## Assumptions

- Work continues on `feature/ui-motion-polish` (previous batch is uncommitted there; same UI-polish task line). A separate commit can split the batches later if wanted.
- The map stays hidden below 840px as today; the rework targets desktop/tablet.
- SVG-internal chips scale with the diagram without JS measurement; JS only toggles focus-mode classes.

## Solution boundary

- `workflows/index.astro` owns edge data (from/to/curve), gradient/marker defs, chip labels, and focus-mode class toggling in its existing `onPageLife` script.
- `src/data/site.ts` owns the copy deletions in both locales; `index.astro` drops the stat card `<p>` line accordingly.
- `src/styles/global.css` owns the cross-page view-transition rules and any shared additions; page-level effects stay in page `<style>` blocks.
- `astro.config.mjs` owns the one-line prefetch option; no other config changes.
- Home hero choreography and Lifecycle auto-advance live in `src/pages/[locale]/index.astro` (CSS) plus a small `onPageLife` interval in its script.
- `src/components/CodeBlock.astro` and `workflows/[slug].astro` share the copy→check icon morph; `evidence.astro` only adds `data-countup` to bar numbers.
- Playground step-dot pulse lives in `playground.astro`; list-row stagger uses the existing reveal mechanism.

## Implementation

- `astro.config.mjs`: `prefetch: { prefetchAll: true, defaultStrategy: 'hover' }`; the build emits `prefetch.*.js` plus a per-page `page.*.js` init bundle.
- `src/styles/global.css`: `page-out`/`page-in` root view-transition rules (the theme-circle keeps precedence via its class selector); the reduced-motion block now explicitly disables view-transition pseudo animations; shared copy-icon morph (`.copy-ic` stack, `.copied` swaps copy → check).
- `src/data/site.ts`: `mapHint` deleted in both locales; home stats trimmed to number+label pairs in both locales.
- Home (`src/pages/[locale]/index.astro`): hero choreography (`hero-in` staged delays on eyebrow/lede/actions, reduced-motion override); Lifecycle auto-advance on a 2.2s `onPageLife` interval (pauses on hover, hidden tab, reduced motion; cleaned up on swap); stat card `<p>` line and its rule removed.
- Workflow catalog (`src/pages/[locale]/workflows/index.astro`): edges declare `from`/`to` and use gently bowed curves; solid edges stroke with per-edge `userSpaceOnUse` gradients (source tone → target tone) and per-tone arrow markers; dashed edges march (`edge-dash-flow`); labels are SVG pill chips whose `rect` is sized from the text `getBBox()` at init (no-JS falls back to haloed text); focus mode lights connected edges/nodes in the hovered node's tone (`--focus-tone`, `map-arrow-lit` marker) and dims the rest, driven from both list rows and map nodes; list rows stagger in via `row-in`; the `map-hint` paragraph is gone.
- Workflow detail (`src/pages/[locale]/workflows/[slug].astro`): process steps use the shared reveal with stagger; connector lines grow from the top when their step reveals; both invocation copy buttons morph copy → check.
- `src/components/CodeBlock.astro`: same copy → check morph for documentation code blocks.
- Evidence (`src/pages/[locale]/evidence.astro`): comparison-bar numbers (`45/51` etc.) count up via the existing `data-countup` helper, with tabular figures.
- Playground (`src/pages/[locale]/playground.astro`): the running step dot pulses softly (`run-pulse`).

## Verification

- `npm test` (Windows): 14/14 passed.
- `npm run check` (WSL Node 22): 34 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` (WSL Node 22): 43 pages built.
- Build-output inspection: `dist/zh-CN/workflows/index.html` contains 6 edge chips, both edge gradients, and the `map-arrow-lit` marker, and no `map-hint`; the CSS bundle contains `page-in`, `edge-dash-flow`, `row-in`, `copy-ic`, and `hero-in`; `dist/en/evidence/index.html` has 10 `data-countup` targets; the prefetch bundle is emitted and initialized by the shared page script on every page.
- Preview smoke test: `/en`, `/zh-CN`, `/en/playground`, `/zh-CN/workflows`, `/zh-CN/workflows/develop`, `/en/docs`, `/zh-CN/evidence` all return 200; the preview server was stopped afterwards.
- Not covered: manual visual review of the new motion (hero sequence, Lifecycle autoplay, map focus mode and chips, page transitions) in a real browser at desktop and mobile widths — to be eyeballed via `npm run dev`. Chip anchor positions and animation timings were computed from path geometry and should be confirmed visually.
