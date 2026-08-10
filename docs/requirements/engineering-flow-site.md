# Engineering Flow Website

Status: Implemented

## Goal

Build a bilingual, static product website for the `engineering-flow-skills` project that follows the supplied UI references, explains the five released workflows, presents published evidence, and demonstrates the Develop lifecycle through a safe fixed simulation.

## Acceptance behavior

- Provide equivalent English and Simplified Chinese routes with a language switch that preserves the current page.
- Provide static pages for the home page, workflow catalog, each of the five workflow details, evidence, documentation, and playground.
- Treat `engineering-flow-skills` as the product source of truth without copying the complete repository into this project.
- Store public website content and evidence as committed, traceable snapshots so the deployed site has no dependency on a local sibling directory.
- Use the existing benchmark logs only as offline source material for a curated fixed Playground flow.
- Remove local paths, thread identifiers, providers, model details, stderr, raw prompts, diffs, and other internal log details from the public snapshot.
- Clearly identify the Playground as a simulation. Its controls update browser-local presentation state only and never run an agent or mutate a repository.
- Reflect the five real workflows and real installation commands instead of the illustrative counts and fictional CLI shown in the UI images.
- Deploy as a pure static site suitable for Vercel, with every route directly loadable.
- Preserve responsive layout, keyboard operation, visible focus, reduced-motion preferences, and sufficient color contrast.

## Out of scope

- A backend, database, authentication, user accounts, or server-side session state.
- Running Codex or Claude from the browser.
- Reading live repositories, logs, benchmark results, GitHub APIs, or user data at runtime.
- Automatically updating the website when the source repository changes.
- Copying raw benchmark reports or the complete `engineering-flow-skills` repository into the website.
- Publishing or configuring the Vercel project, committing, or pushing changes.

## Assumptions

- Astro with TypeScript is the static-site boundary and only page-specific interactions ship client-side JavaScript.
- Locale routes use `/en/...` and `/zh-CN/...`; the root route selects the previously chosen or browser-preferred locale and falls back to English.
- Stable route slugs and workflow identifiers remain English in both locales.
- Published product documentation is authoritative when a UI mockup or individual raw benchmark report differs from it.
- The first Playground snapshot uses a sanitized customer CSV export scenario derived from existing Develop lifecycle reports.

## Solution boundary

- Astro layouts and page components own rendering, navigation, responsive behavior, and accessibility.
- Locale dictionaries own shared interface text; shared workflow and snapshot data own language-neutral identifiers and state.
- Curated content modules own localized product descriptions and documentation summaries.
- A committed Playground snapshot owns the fixed lifecycle, evidence list, and activity entries. No runtime adapter to the source repository exists.
- CSS design tokens and a small set of reusable visual components implement the supplied monochrome-and-green visual language without a general-purpose UI framework.

## Implementation

- `src/layouts/SiteLayout.astro`, shared components, and `src/styles/global.css` implement the bilingual layout, navigation, visual system, responsive behavior, theme preference, keyboard focus, and reduced-motion handling. The layout also owns the shared scroll-reveal observer used by the marketing pages; reveal styles apply only when scripting is available.
- `src/pages/[locale]/` generates English and Simplified Chinese home, workflow catalog, five workflow detail, evidence, and Playground routes. Documentation is a multi-page section under `src/pages/[locale]/docs/`: overview, installation, quick start, design philosophy, software engineering practices, one reference page per workflow, experiments, and best practices.
- `src/components/DocsShell.astro` owns the documentation shell — grouped sidebar contents pinned while the article scrolls, on-page anchors, previous/next paging, and the shared documentation typography; `src/components/CodeBlock.astro` owns copyable command blocks. Documentation routes use the wider `page-shell docs` variant so the side columns sit at the edges and the article column carries the extra width.
- `src/components/WorkflowIcon.astro` owns the five workflow marks. Each mark draws that workflow's own action, and its parts animate from a single `--wf` switch that any interactive ancestor can flip, so list rows, tabs, map nodes, and documentation headers all share one behavior.
- `src/data/site.ts` owns published product copy, workflow definitions, evidence figures, and source metadata for snapshot `3a70929` / release `1.0.1`. Workflow entries carry no icon name; the mark is selected by slug.
- `src/data/docs.ts` owns the documentation contents tree and the per-workflow reference content (stage rules, hard rules, worked example, selection guidance, and questions) transcribed from `skills/<slug>/SKILL.md`, `docs/user-guide*.md`, and `docs/product-design.md`.
- `src/data/engineering.ts` owns the design-principles page. Each of the seven classical object-oriented principles carries a status — encoded directly, adopted with a stated condition, or no dedicated rule — and cites the rule identifiers in `docs/behavior-spec.md` that support it. Principles the source repository does not legislate (LSP, ISP) are labelled as such rather than attributed.
- `src/data/evidence.ts` owns the Results-page narrative: comparison method, matched-pair outcomes, the four scenarios that separated the two groups, the measured process cost, and the data source — all summarized from `docs/benchmark-log.md` without provider, model, endpoint, or raw-log details. Deterministic test counts follow the release README of `1.0.1` (49/49) rather than a later log entry, so every published figure describes one release.
- The workflow map on `src/pages/[locale]/workflows/index.astro` draws one edge per documented transition. Solid edges are the normal path and carry a looping highlight; dashed edges are the conditional ones. Hovering either the list or the map highlights the same workflow on the other side.
- `src/data/playground.ts` owns the curated customer CSV export lifecycle. It contains no raw prompts, local paths, thread identifiers, model/provider details, stderr, or source diffs.
- `src/lib/routes.mjs` owns locale path mapping; `src/lib/playground.mjs` owns the deterministic simulation state and approval gate. The Playground page adds browser-local autoplay that always stops at the approval gate and at completion, so approval remains a user action.
- `package.json`, `astro.config.mjs`, `tsconfig.json`, and `scripts/astro.mjs` provide a static Astro build suitable for Vercel without a runtime API or adapter.

## Verification

- `npm test`: 7 focused locale-routing and Playground-state assertions passed.
- `npm run check`: 32 Astro/TypeScript files checked with 0 errors, warnings, or hints.
- `npm run build`: 43 static pages generated successfully.
- Local production-output review covered the Chinese home, workflow catalog, Develop and Diagnose details, Playground, Evidence, and Docs routes; navigation and assets returned successfully.
- Documentation routes were re-checked to contain zero links into the marketing workflow pages.
- User acceptance review confirmed the current functionality is correct.
