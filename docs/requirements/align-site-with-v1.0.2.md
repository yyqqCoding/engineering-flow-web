# Align the site with engineering-flow-skills v1.0.2

Status: Implemented

## Goal

The published snapshot is pinned to source `v1.0.1, commit 3a70929`. The source repository has since
released `v1.0.2` (commit `f74d6f5`), which adds a durable requirement-record mechanism with a bundled
validator, a scope-alignment rule, a canonical-verification-command rule, a Diagnose no-reproduction
rule, and a substantially larger evaluation corpus. Bring every page of the site up to that snapshot.

One accuracy defect in the current site must be corrected in the same pass: the results page labels
three comparisons as "without workflows" versus "with workflows", but only the seventeen-scenario
cohort (`45/51` versus `51/51`) actually used a no-plugin baseline. The `0/12` continuity control ran
with the then-current *release* of the plugin installed, and the `0/3` handoff control ran with `1.0.0`
installed. Neither control was an empty one, so neither may keep the "without workflows" label.

The site presents the current release as the stable version. It does not carry a release-over-release
narrative and does not enumerate occasional model non-compliance.

## Acceptance behavior

- `snapshotMeta` records source version `1.0.2`, the source commit, and the snapshot date.
- The results page carries exactly one two-bar comparison, and it is the only cohort with a genuinely
  empty control: seventeen everyday scenarios, `45/51` without the workflows versus `51/51` with them.
- Every other measured figure appears as a pass rate for the current release, with no control bar and no
  claim about what an unequipped or older configuration would have scored.
- Case cards read as "situation → what this release does", in a single column, with the current
  release's pass rate. No card implies a control it did not have.
- The scenario table covers the current behavior corpus (`B01`–`B33`) rather than the first seventeen,
  and the page states the corpus/coverage figures separately from completed model trials.
- Develop's documentation covers the durable requirement record, both validator modes, the persisted
  finalization command, the canonical verification command, and the scope-alignment rule.
- Diagnose's documentation covers the explicit "cannot reproduce" conclusion.
- The experiments documentation page records the five-round durable experiment chain with its
  preregistered gate, and the verification limits reflect the current release.
- English and Simplified Chinese stay behaviorally equivalent.
- No provider, model, endpoint, local path, thread ID, prompt, or raw log appears anywhere on the site.

## Out of scope

- Visual/layout redesign beyond what the new content structure requires.
- The Playground state machine and its fixed replay data.
- Routing, locale mapping, and build configuration.
- New runtime dependencies.

## Assumptions

- The source snapshot is `engineering-flow-skills` commit `f74d6f5` (v1.0.2).
- The v1.0.2 release cohort is republished from a refreshed evidence manifest; the numbers on this site
  come from that refreshed manifest, not from the pre-refresh manifest recorded in `docs/benchmark-log.md`.

## Solution boundary

- `src/data/site.ts` owns `snapshotMeta`, home statistics, results-page card copy, and the scenario table.
- `src/data/evidence.ts` owns the results-page structure, including the two comparison classes and the
  residual-failure list.
- `src/data/docs.ts` owns the documentation copy: experiments page, Develop and Diagnose workflow guides,
  quick start, and FAQ.
- `src/data/engineering.ts` owns the design-principle mapping; only the approval item gains the
  scope-alignment sentence.
- `src/pages/[locale]/evidence.astro` renders the new sections; styles stay in its existing `<style>` block.
- `test/*.test.mjs` covers whatever new pure logic appears in `src/lib/`; content-only changes rely on
  `npm run check` and `npm run build`.

## Implementation

- `src/data/site.ts`: `snapshotMeta` moved to snapshot `version: 2`, source `1.0.2`, commit `f74d6f5`,
  date `2026-08-22`. Home statistics now end in `77/77` static tests. Results-page cards keep four
  entries; the continuity card's subtitle changed from the mislabelled "Control: 0/12" to the neutral
  "4 task-level scenarios × 3 runs". `scenarioSnapshot` extended from `B01`–`B17` to `B01`–`B33`.
  Develop gained the scope-alignment and verified-completion-record mechanisms; Diagnose gained the
  failed-reproduction mechanism.
- `src/data/evidence.ts`: rewritten around one comparison plus current-release pass rates. The `PluginRow`
  type marks the only data allowed to render the "no workflows installed" legend. Added `facts` (the four
  pass-rate tiles) and `coverageNote`; case entries became `situation` + `behavior` + `score`.
- `src/pages/[locale]/evidence.astro`: one `#results` section holding the single comparison plus the fact
  grid; case cards render in a single column via `.case-outcome`. New styles: `.compare-note`,
  `.case-outcome`; removed the two-column `.case-side` styles.
- `src/data/docs.ts`: source pin updated. Experiments page gained the five-round durable experiment chain
  (`chain*`) and refreshed `limits`. Develop guide gained the timeless-Draft, persisted-command,
  draft-validator, scope-alignment, canonical-verification-command, and atomic-finalize rules, two hard
  rules, and one FAQ entry. Diagnose gained the explicit no-reproduction rule and hard rule. Overview
  gained a fifth session step; quick start and best-practices copy updated.
- `src/pages/[locale]/docs/experiments.astro`: renders the `#chain` section and adds it to the page TOC;
  new `.chain-*` styles.
- `src/data/engineering.ts`: the approval principle now states that approval bundled with a material scope
  increase does not authorize implementation.

## Verification

- `npm test` (WSL Node 22): 20/20 passed.
- `npm run check` (WSL Node 22): 35 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` (WSL Node 22): 43 pages built.
- Build-output audit: no provider, model, endpoint, plugin fingerprint, or local path appears anywhere in
  `dist/`; no stale `50/50` figure remains; the snapshot stamp reads `v2 · f74d6f5`.
- Build-output audit for the removed framing: `previous release`, `上一个版本`, `本次版本`, `case-kind`,
  `residual`, `22/30`, and `27/30` each occur zero times across `dist/`.
- Build-output audit for the new content, both locales: one comparison row renders at 88.2% versus 100%
  (`45/51`, `51/51`); four fact tiles render `12/12`, `3/3`, `51/51`, `77/77`; five single-column case
  cards render scores `3/3`, `3/3`, `12/12`, `3/3`, `6/6`; five experiment-chain rounds render.
- Source figures re-derived rather than copied: the source repository's deterministic suite was run
  (`77/77`), its coverage report was run (36 scenarios, 45/45 behavior IDs, 9 holdouts), and its release
  cohort was regenerated from a refreshed evidence manifest.

## Deviations

- The ten-scenario release cohort regenerated during this work is not published. It is inherently a
  paired `1.0.1` versus `1.0.2` measurement, and the site does not carry a release-over-release narrative.
  Its candidate arm still supplies the `6/6` figure on the fresh-context case card and the invocation and
  cleanliness statements in the documentation limits.
- Refreshing the source repository's evidence manifest was authorized separately and is recorded in that
  repository's benchmark log. Its working tree carries that change uncommitted.
- No new automated test was added. This is a content and presentation change with no new logic in
  `src/lib/`, which matches the project's stated policy of relying on `npm run check` and `npm run build`
  for presentation-only work.


