# UI Motion & Polish Pass

Status: Implemented

## Goal

Raise the perceived quality of the bilingual Engineering Flow site — visual texture, choreographed motion, and richer micro-interactions — without new runtime dependencies and without regressing accessibility, performance, or bilingual parity.

## Background analysis

Current strengths (kept as-is): tokenized light/dark themes, shared easing curves, IntersectionObserver scroll reveal, `--wf`-driven animated workflow marks, cross-highlighting workflow map, animated Playground state machine, `prefers-reduced-motion` handling.

Gaps vs. reference-class marketing/product sites (Linear, Stripe, Vercel/Geist, Raycast): flat hero with a block-level headline entrance, single-layer shadows and flat borders, instant theme cuts, final-value-only numbers, and no scroll-driven or page-transition choreography.

## Acceptance behavior

Approved scope: all three packages (P0 + P1 + P2).

- P0: grain overlay plus masked grid backdrop behind the hero; hero headline staged per-fragment rise+blur entrance (per word in English, per character in Chinese, with the full sentence exposed via `aria-label`); pointer-tracked spotlight border and inner glow on interactive panels via `--mx/--my`; layered ambient+key shadows and a dark-mode inset top highlight on panels; magnetic pull on the primary home CTA; circular view-transition on theme switch with instant fallback; count-up animation for stat/summary/evidence numbers when revealed; tabular figures for mono counters.
- P1: sliding active-nav indicator in the header (desktop widths); workflow map solid edges draw in on first reveal with labels, arrowheads, and flow highlights fading in afterwards; map node hover shows a positioned summary tooltip that flips below near the canvas top; Playground counters tick on change, demo switches fade out/in, and `←`/`→` step and `Space` toggles autoplay (the approval gate stays clickable-only); thin reading-progress bar on documentation pages.
- P2: Astro ClientRouter cross-page transitions; self-hosted Inter Variable for Latin text with system fonts kept for Chinese.
- Every effect stays behaviorally equivalent in English and Simplified Chinese; motion is gated behind `prefers-reduced-motion` and `pointer: fine`; reveal-type effects render visible content without JavaScript; animations stay on transform/opacity.

## Out of scope

- Animation libraries or a UI framework (the only added dependency is the self-hosted font package).
- Custom cursor, scroll-jacking, horizontal-scroll gimmicks, 3D/WebGL scenes.
- Content, copy, routing, or data-model changes.

## Assumptions

- Existing CSS variables and easing tokens are extended, not replaced; the one-token `--shadow` now resolves to a layered shadow so every consumer upgrades at once.
- Work happened on `feature/ui-motion-polish`; unrelated uncommitted files (`CLAUDE.md`, `AGENTS.md`, `img.png`) were left untouched.
- Web research tooling was unavailable in this environment; reference practices were drawn from established public designs of the named sites.

## Solution boundary

- `src/lib/motion.mjs` owns the shared, framework-independent helpers: easing and count-up math (unit-tested), plus DOM bindings for count-ups, spotlights, magnetic buttons, and the `onPageLife` init/cleanup adapter that keeps every page script idempotent under ClientRouter.
- `src/lib/playground.mjs` owns `retreatPlayground`; stepping back across the approval gate revokes approval so replay still requires an explicit human approval.
- `src/styles/global.css` owns the grain overlay, layered shadow tokens, dark-mode panel inset highlight, `[data-spot]` spotlight, `[data-magnet]` snap-back, nav indicator, and the theme-transition view-transition rules.
- `src/layouts/SiteLayout.astro` owns ClientRouter, the font import, and global count-up/spotlight/magnet wiring; `src/components/Header.astro` owns the theme circle transition and nav indicator measurement; page-level effects (hero fragments, map draw-in and tooltip, Playground ticks and shortcuts, docs progress bar) live in their page/component `<style>` and script blocks.

## Implementation

- `src/lib/motion.mjs`: `easeOutCubic`, `splitCountText`, `countUpFrame` are pure and unit-tested; `onPageLife(init)` runs init on `astro:page-load` and immediately, and runs the returned cleanup on `astro:before-swap`, so timers, observers, and document-level listeners never leak across client-side navigations. `initCountUps` remembers each element's original text so a re-init mid-animation still targets the true value.
- `src/lib/playground.mjs`: `retreatPlayground` steps back one step (never below zero); with a gate, approval survives only while the playhead stays at or past the gate.
- `src/styles/global.css`: `body::after` carries a static feTurbulence grain; `--shadow` is a three-layer shadow in both themes and `--panel-inset` adds the dark-mode glass highlight through both `.panel` and `.panel-flat`; `[data-spot]` renders a masked 1px border ring plus a soft inner radial that follow `--mx/--my`; the nav indicator and theme-circle rules only activate with JS/View-Transition support.
- Home (`src/pages/[locale]/index.astro`): hero headline splits into fragments (words/characters) with staggered rise+blur; masked grid backdrop layer behind the existing drifting glow; stat cards carry `data-spot` and `data-countup`; the primary CTA carries `data-magnet`.
- Workflow catalog (`src/pages/[locale]/workflows/index.astro`): solid edges use `pathLength="100"` for a one-time dash-offset draw-in when the map scrolls into view; node hover positions a summary tooltip from the circle's rendered rect; summary numbers count up; map and sidebar cards are spotlight targets.
- Workflow detail (`src/pages/[locale]/workflows/[slug].astro`): panels are spotlight targets tinted by the workflow's own tone via `--spot-color`.
- Playground (`src/pages/[locale]/playground.astro`): counters re-render through a tick animation; demo selection fades the current groups out before swapping; `←`/`→`/`Space` keyboard control with focus-in-control guards; progress bar carries a soft glow; hint chips document the keys.
- Docs (`src/components/DocsShell.astro`): fixed 2px reading-progress bar driven by a rAF-throttled scroll listener.
- `src/env.d.ts` declares the CSS-only font package for the checker; `@fontsource-variable/inter` is the single added dependency.

## Verification

- `npm test`: 14/14 passed (locale routing, playground state machine including retreat-across-gate revocation, motion helpers).
- `npm run check` (WSL Node 22): 34 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` (WSL Node 22): 43 pages built; 7 self-hosted woff2 assets emitted; `hero-frag`, `nav-indicator`, `data-countup`, and the ClientRouter/motion bundles verified in `dist/`.
- `npm run preview` smoke test: `/en`, `/zh-CN`, `/en/playground`, `/zh-CN/workflows/develop`, `/en/docs`, `/zh-CN/evidence` all return 200; font and motion script assets return 200.
- Not yet covered: manual visual review at desktop and mobile widths (required for presentation changes) — animations, the theme circle transition, and ClientRouter navigation should be eyeballed in a real browser via `npm run dev`.
