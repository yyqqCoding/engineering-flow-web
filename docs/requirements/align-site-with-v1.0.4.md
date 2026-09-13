# Align the site with engineering-flow-skills v1.0.4

Status: Implemented

## Goal

The published snapshot (`v3`, source commit `eeef0fc`) predates the `v1.0.4` release (`a647b73`).
That release shortens all five workflows and, most importantly, **reverses the testing policy** the
site currently describes: `TEST-01` is now "Risk-based implementation and verification", which
explicitly replaces "complete all production behavior before authoring tests" with a sequence that
"follows task risk". Several pages therefore assert the opposite of the shipped rule.

Alongside the policy work, the release moves the corpus to `45` configured scenarios covering all
`47` behavior rules (`9` holdouts) and the deterministic suite to `219` checks, and simplifies the
workflow guides the site mirrors (Develop three sections, Diagnose two, Code Design two, Review
three, Handoff four groups).

In the same pass, remove the site's note-type small text. The user's instruction was explicit:
"网站中很多小字全部去掉，不需要这种备注型，非常丑" — every gray section lede and every
`doc-note` callout is removed, not restyled. Where a callout carried a functional instruction
rather than annotation, it is re-rendered as ordinary body text instead of being deleted.

The site presents the current release as the stable version. It does not carry a
release-over-release narrative and does not enumerate occasional model non-compliance.

## Acceptance behavior

- `snapshotMeta` records source version `1.0.4`, commit `a647b73`, snapshot version `4`, and the
  snapshot date `2026-09-13`.
- Wherever testing order is described, the policy is risk-based: implementation and tests advance
  in independently verifiable slices in whichever order the risk calls for. No site copy asserts
  production-first or test-first as a rule.
- Test silence stays neutral, an ad-hoc probe still never substitutes for selected coverage, a
  reproducible regression still goes red before the fix, and a conversation-sized task still gets
  no requirement record.
- Guide stages mirror the source `SKILL.md` structure: Develop three, Diagnose two, Code Design
  two, Review three, Handoff four. The homepage lifecycle diagram keeps its own seven-node grain
  (Discover, Clarify, Checkpoint, Approval, Implement, Verify, Complete) and highlights Approval.
- Figures read `47/47` behavior rules across `45` scenarios with `9` holdouts, `219/219`
  deterministic tests, and `18/18` for the six-scenario release cohort. The 17-scenario
  no-workflows comparison keeps both arms (`45/51` versus `51/51`).
- No section lede, `doc-note` callout, or cost block renders on any page; no orphaned copy key,
  markup, or style remains.
- English and Simplified Chinese stay behaviorally equivalent.
- No provider, model, endpoint, local path, thread ID, prompt, or raw log appears anywhere on the
  site.

## Out of scope

- Visual/layout redesign beyond removing the note elements.
- The Playground state machine beyond the index shift required by the shorter Develop flow.
- Routing, locale mapping, and build configuration.
- New runtime dependencies.

## Assumptions

- The source snapshot is `engineering-flow-skills` commit `a647b73` (v1.0.4 release).
- Source-side verification is already complete; this task updates the website only.
- The latest published release cohort is the six-scenario, three-run-per-arm cohort whose
  candidate arm is `18/18`. The v1.0.4 release basis carries that evidence forward rather than
  sampling anew, so the site presents it as the release pass rate without a version-specific
  claim.

## Solution boundary

- `src/data/site.ts` owns `snapshotMeta`, home statistics, the results-page cards, the workflow
  summaries/processes/mechanisms, `developSteps`, and the `B01`–`B42` scenario table.
- `src/data/playground.ts` owns the Develop replay trace, which is index-paired with
  `developSteps`, and the gate position derived from the `approval` step.
- `src/components/Lifecycle.astro` owns the homepage lifecycle diagram and highlights the
  `approval` step.
- `src/data/evidence.ts` owns the results-page figures and case cards, including the sixth case.
- `src/data/docs.ts` owns the documentation copy: the overview decision table, the philosophy
  page, the experiments page chains and limits, and all five workflow guides.
- `src/data/engineering.ts` owns the design-principle mapping.
- Page components lose their section ledes and `doc-note` callouts, plus the styles those used.
- `test/*.test.mjs` covers whatever new pure logic appears in `src/lib/`; content-only changes
  rely on `npm run check` and `npm run build`.

## Implementation

- `src/data/site.ts`: `snapshotMeta` moved to snapshot `version: 4`, source `1.0.4`, commit
  `a647b73`, date `2026-09-13`. Home statistics and results-page cards now read `47/47`, `18/18`,
  and `219/219`. Develop's summary, process (7 → 5 steps), and mechanisms were rewritten to the
  risk-based policy — `Production before tests` became `Risk-based verification`, and
  `Regression still goes red first` was added. `developSteps` went 7 → 6 (Approval merged into the
  Checkpoint that precedes it). `scenarioSnapshot`'s `B34` row was rewritten to the current policy
  and `B35`–`B42` were appended.
- `src/components/Lifecycle.astro`: the highlighted node is now located by step id
  (`step.id === 'approval'`) instead of a hard-coded `activeIndex` default. The homepage hero and
  the philosophy page both rely on that default to spotlight the human gate.
- `src/data/playground.ts`: Develop's gate position is derived from the `approval` step rather than
  written as a numeric literal, so the two cannot drift apart again. The `trace` array stays
  index-paired with the imported `developSteps`.
- `src/data/evidence.ts`: rewritten. The `lede` now attributes the figures to the project's own
  published test records and explains the external scorer. Method step 2 carries `45` scenarios /
  `47` rules / `9` holdouts. Removed entirely: `methodIntro`, `compareIntro`, `compareNote`,
  `factsIntro`, `casesIntro`, `scenariosIntro`, the whole cost section (`costTitle`, `costIntro`,
  `costs`, `costNote`), and `sourceNote`. Case 6 was rewritten to the risk-based policy.
- `src/data/engineering.ts`: removed the `readingTitle`/`readingBody`/`readingNote` block and the
  `principlesIntro`, `budgetIntro`, `processIntro`, `ownerIntro`, `measuredNote` ledes. The
  `TEST-01`-backed principle "Evidence precedes the claim" was rewritten to risk-based wording,
  and `measuredBody` lost its `+1/3` cost claim.
- `src/data/docs.ts`: `chooseIntro`, `layerIntro`, `explicitIntro`, `lessonsConclusion`,
  `standardIntro`, `stagesIntro`, `exampleIntro`, and the experiments ledes/notes (`resultsNote`,
  `lessonsIntro`, `chainIntro`, `chainConclusion`, `policyIntro`, `policyConclusion`,
  `limitsWarning`) were removed. `policyTitle` was retitled from "teaching production-before-tests"
  to "how the testing rule was written", and its third round no longer claims production-before-
  test ordering — it now records only the two corrections that survived. The `limits` list was
  refreshed to `219/219`, `45`/`47`, and `18/18`, and the stale lines naming a client version and
  comparing clients were dropped. All five `workflowGuides` were restructured to the source
  sections listed above, and Develop's hard rule "Production before tests" became "Risk sets the
  order" (both locales), with its FAQ and example turns reworded to match.
- Pages `[locale]/evidence.astro`, `docs/engineering.astro`, `docs/experiments.astro`,
  `docs/philosophy.astro`, `docs/index.astro`, `docs/install.astro`, `docs/quickstart.astro`, and
  `docs/workflows/[slug].astro` lost their section ledes and callouts. Dead CSS was removed with
  them: `.section-lede`, `.compare-note`, the `.cost-*` block, `.limits-layout`, and the
  `DocsShell` `.doc-note` rules. Unused imports (`Icon` in `install.astro` and `quickstart.astro`,
  `inlineCode`/`localizePath` in `docs/engineering.astro`) were dropped.
- `src/pages/[locale]/docs/install.astro` and `quickstart.astro`: their `doc-note` callouts carried
  functional instructions (where to type a workflow token; how approval continues). Those were
  re-rendered as ordinary paragraphs rather than removed.

## Verification

- `npm test` (Windows): 20/20 passed.
- `npm run check` (WSL Node 22): 35 files, 0 errors, 0 warnings, 0 hints.
- `npm run build` (WSL Node 22): 43 pages built.
- Build-output audit — each occurs zero times across `dist/`: `doc-note`, `section-lede`,
  `compare-note`, `84/84`, `2.1.223`, `17.6%`, `16.5%`, `eeef0fc`, `f74d6f5`,
  `37 configured`, `all 46 behavior`, `production-before`, `生产代码先行`.
- Security audit of `dist/`: model, provider, reasoning-effort, thread, home-path, and
  `C:\Users` identifiers each occur zero times.
- Structure audit of `dist/en/docs/workflows/*`: rendered stage counts are Develop 3 (1 gate),
  Diagnose 2 (1 gate), Code Design 2, Review 3 (1 gate), Handoff 4 — matching the source
  `SKILL.md` sections. No page renders an empty paragraph.
- Lifecycle audit: `dist/{en,zh-CN}/index.html` each render seven `lifecycle-step` nodes in
  order (discover, clarify, checkpoint, approval, implement, verify, complete) with `approval`
  carrying `active`. The Develop playground demo renders all seven turns.
- New-figure audit: `47/47` renders on the home page, the evidence page, and the experiments page
  in both locales.

## Deviations

- The six-scenario release cohort is presented as a single-arm pass rate (`18/18`) with no control
  bar. Only the 17-scenario no-workflows comparison has a genuinely empty control arm, so it is
  the only figure drawn as a comparison.
- Case 6's `3/3` score was retained while its description was rewritten to the current risk-based
  policy. The score belongs to the scenario's published record; only the copy describing the
  expected behavior changed.
- The five-round `#chain` (requirement-record durability) and the three-round `#policy` chain were
  kept, but their section ledes and concluding callouts were removed per the "no small print"
  instruction. The round rows carry the substance on their own.
- The `install.astro` and `quickstart.astro` callouts were converted to body text rather than
  deleted, because they carry functional instructions that are not derivable from the surrounding
  prose.
- The homepage lifecycle diagram keeps seven nodes rather than the three the new Develop guide
  has. The diagram is the site's own model of the flow and its job is to show the human gate as a
  distinct node; a three-node version would fold Approval into "Align and pause". The
  Discover/Clarify split is also still real in v1.0.4 — reusing evidence and batching material
  questions remain separate rules in the first section.
- A first pass of this work changed the diagram to six nodes (merging Discover and Clarify into
  "Align") without updating `Lifecycle.astro`'s hard-coded `activeIndex` default, which left the
  hero highlighting Implement instead of Approval. Both were corrected: the node count was
  restored to seven, and the highlight and the playground gate now resolve from the `approval`
  step id rather than a numeric index.
- No new automated test was added. This is a content and presentation change with no new logic in
  `src/lib/`, which matches the project's stated policy of relying on `npm run check` and
  `npm run build` for presentation-only work.
