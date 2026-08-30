# Align the site with the actual v1.0.2 release

Status: Implemented

## Goal

The published snapshot (`v2`, source commit `f74d6f5`) predates the actual `v1.0.2` release
(`eeef0fc`) by five commits. Those commits contain a policy-level inversion — production code is
completed before any feature-test file changes (TEST-01 redefined), with red-before-fix kept only
as the regression exception (TEST-06) and coverage selected for necessity and sensitivity
(TEST-03) — plus restructured workflow guides (Develop five phases, Code Design four sections,
Diagnose four sections) and refreshed figures: `84/84` deterministic tests, `37` scenarios
covering `46` behavior IDs, scenario `B34`, Claude Code `2.1.223`, and a final release cohort of
two testing-policy scenarios (`12` reports, `6/6` for the current release). Bring every page of
the site up to the release snapshot.

In the same pass, remove hint-like small text that merely repeats what the flow visuals already
show: the Playground notice card, the gate turn hint, the controls state line, the home
gate-note, and the results page's coverage-methodology note. The keyboard shortcut hint stays
because it is not derivable from the flow.

Also in the same pass, drop the artificial `max-width` caps on flowing text (page ledes, section
ledes, comparison notes, the workflow idea line): where a line fits within the container, it
renders on one line instead of wrapping early.

The site presents the current release as the stable version. It does not carry a
release-over-release narrative and does not enumerate occasional model non-compliance.

## Acceptance behavior

- `snapshotMeta` records source version `1.0.2`, commit `eeef0fc`, snapshot version `3`, and the
  snapshot date.
- Wherever testing order is described, the policy is production-first: new behavior completes the
  production implementation before any test file changes; only coverage that protects critical
  behavior or an established risk boundary is added; a reproducible regression keeps
  red-before-fix as the sole exception.
- Test silence is neutral (never read as a ban), an ad-hoc probe never substitutes for selected
  coverage, `Test files: None` is a legitimate completion state for non-test tasks, and a
  conversation-sized task gets no fallback requirement record.
- Guide stages mirror the source SKILL.md structure: Develop five phases, Code Design four
  sections, Diagnose four sections.
- Figures read `84/84`, `37` scenarios / `46` behavior IDs, `B01`–`B34`, and `2.1.223`. The
  testing-policy cohort appears as the current release's pass rate (`6/6`) with no control bar;
  the earlier ten-scenario cohort is labeled historical evidence pinned to a superseded
  fingerprint.
- The removed hint text leaves no orphaned copy keys, markup, script references, or styles.
- Flowing text carries no width cap narrower than its container, so a sentence that fits the
  container renders on one line at desktop width.
- English and Simplified Chinese stay behaviorally equivalent.
- No provider, model, endpoint, local path, thread ID, prompt, or raw log appears anywhere on the
  site.

## Out of scope

- Visual/layout redesign beyond removing the hint elements.
- The Playground state machine and its fixed replay data.
- Routing, locale mapping, and build configuration.
- New runtime dependencies.

## Assumptions

- The source snapshot is `engineering-flow-skills` commit `eeef0fc` (v1.0.2 release).
- The two-scenario testing-policy cohort is the final release cohort pinned to the current
  release fingerprint; the earlier ten-scenario cohort is superseded and retained only as
  historical evidence.

## Solution boundary

- `src/data/site.ts` owns `snapshotMeta`, home statistics, results-page cards, the scenario
  table, the workflow summaries/processes/mechanisms, and the removed Playground copy keys.
- `src/data/evidence.ts` owns the results-page figures and case cards, including the sixth case.
- `src/data/docs.ts` owns the documentation copy: quick start, the experiments page with the new
  testing-policy chain, and the Develop / Diagnose / Code Design guides.
- `src/data/engineering.ts` owns the design-principle mapping; only the evidence item changes.
- `src/pages/[locale]/docs/experiments.astro` renders the new chain section.
- `src/pages/[locale]/playground.astro` and `src/pages/[locale]/index.astro` lose the hint
  elements and their styles.
- `test/*.test.mjs` covers whatever new pure logic appears in `src/lib/`; content-only changes
  rely on `npm run check` and `npm run build`.

## Implementation

- `src/data/site.ts`: `snapshotMeta` moved to snapshot `version: 3`, source `1.0.2`, commit
  `eeef0fc`, date `2026-08-30`. Home statistics and results-page cards now end in `84/84`.
  Develop's summary, process, and mechanisms describe production-before-tests; the former
  "Harden" step became "Select tests". Diagnose's process is four steps; Code Design's is four
  sections. `scenarioSnapshot` extended to `B34`. Removed keys: `home.humanGate`;
  `playgroundPage.notice`, `.start`, `.gateHint`, `.waiting`, `.completed`.
- `src/data/evidence.ts`: coverage figures now `37` scenarios / `46` behavior IDs; the
  deterministic-tests fact reads `84/84`; a sixth case card covers the clear-feature-that-never-
  mentions-tests scenario (production code first, sensitive coverage after, silence neutral, no
  probe substitution, no unnecessary requirement record). The `coverageNote` disclaimer under the
  scenario table was removed.
- `src/styles/global.css`, `src/pages/[locale]/index.astro`, `playground.astro`,
  `evidence.astro`, `workflows/[slug].astro`: removed the `max-width` caps on `.lede`,
  `.section-lede`, `.compare-note`, and `.idea-text` so single-line-capable copy stops wrapping
  early. The lifecycle diagram labels and the map tooltip keep their caps — those are diagram
  layout, not flowing text.
- `src/data/engineering.ts`: "Evidence precedes the claim" rewritten to production-first wording;
  rule list gained `TEST-06`.
- `src/data/docs.ts`: source pin updated. Quick start's test step now reads "protect critical
  behavior with necessary evidence". Experiments limits reflect the current release (`84/84`,
  `37/46`, `9` holdouts, Claude Code `2.1.223`, the final two-scenario release cohort with the
  earlier ten-scenario cohort labeled historical), and the page gained a three-round
  testing-policy chain (`policy*`). Develop's guide stages were rewritten to the five-phase
  structure (including "no fallback record for a conversation-sized task" and "test silence is
  neutral"), its completion rule gained the `Test files: None` nuance, its hard rules gained
  production-first, its example prompt and final turn were reworded, and its FAQ gained "Will it
  write the tests first?". Diagnose's stages became four (symptom and signal, locate the root
  cause, repair when authorized, harden and complete). Code Design's stages became four (choose
  the mode, establish context, design from demonstrated pressure, produce the proposal).
- `src/pages/[locale]/docs/experiments.astro`: renders the `#policy` chain section and adds it to
  the page TOC, reusing the `.chain-*` styles.
- `src/pages/[locale]/playground.astro`: removed the notice card, the gate turn hint, the
  controls state message, and their `data-*` attributes, script references, and styles; the page
  description now uses the lede; the keyboard hint remains.
- `src/pages/[locale]/index.astro`: removed the gate-note element and its styles.

## Verification

- `npm test` (Windows): 20/20 passed.
- `npm run check` (WSL Node 22): 35 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` (WSL Node 22): 43 pages built.
- Build-output audit for stale figures and removed markup — each occurs zero times across
  `dist/`: `77/77`, `36 configured`, `45 behavior`, `2.1.197`, `red-green-refactor`, `f74d6f5`,
  `gate-note`, `notice-card`, `turn-hint`, `data-state-message`, `previous release`, `上一个版本`,
  and the removed coverage-methodology note. No `coverageNote` reference remains in `src/`.
- Build-output audit for the new content, both locales: `84/84` (8 occurrences), `B34` (2),
  `2.1.223` (2), `eeef0fc` (6), the `v3` snapshot stamp (2); the testing-policy chain titles
  render in English and Chinese; `生产代码先行`, `加固并完成`, `从设计压力出发`,
  `一次性发现与对齐`, and the production-first FAQ render.
- Security audit of `dist/`: provider, model, endpoint, local path, and thread identifiers each
  occur zero times.
- No orphaned references: a repository-wide search for the removed copy keys and CSS classes
  (`humanGate`, `gateHint`, `notice-card`, `turn-hint`, `data-state-message`, `gate-note`,
  `playgroundPage.notice|start|waiting|completed`) returns zero matches.

## Deviations

- The v1.0.2 testing-policy cohort is presented as the current release's pass rate with no
  control bar, and the earlier ten-scenario cohort is labeled historical. The site does not carry
  a release-over-release narrative, so neither cohort is drawn as a comparison.
- The keyboard shortcut hint on the Playground was retained deliberately: the shortcuts are not
  derivable from the flow visuals, unlike every removed hint.
- No new automated test was added. This is a content and presentation change with no new logic in
  `src/lib/`, which matches the project's stated policy of relying on `npm run check` and
  `npm run build` for presentation-only work.
