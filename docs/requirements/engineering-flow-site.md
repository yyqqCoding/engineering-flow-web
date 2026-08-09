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

- `src/layouts/SiteLayout.astro`, shared components, and `src/styles/global.css` implement the bilingual layout, navigation, visual system, responsive behavior, theme preference, keyboard focus, and reduced-motion handling.
- `src/pages/[locale]/` generates English and Simplified Chinese home, workflow catalog, five workflow detail, evidence, documentation, and Playground routes.
- `src/data/site.ts` owns published product copy, workflow definitions, evidence figures, and source metadata for snapshot `3a70929` / release `1.0.1`.
- `src/data/playground.ts` owns the curated customer CSV export lifecycle. It contains no raw prompts, local paths, thread identifiers, model/provider details, stderr, or source diffs.
- `src/lib/routes.mjs` owns locale path mapping; `src/lib/playground.mjs` owns the deterministic simulation state and approval gate.
- `package.json`, `astro.config.mjs`, `tsconfig.json`, and `scripts/astro.mjs` provide a static Astro build suitable for Vercel without a runtime API or adapter.

## Verification

- `npm test`: 5 focused locale-routing and Playground-state assertions passed.
- `npm run check`: 19 Astro/TypeScript files checked with 0 errors, warnings, or hints.
- `npm run build`: 21 static pages generated successfully.
- Local production-output review covered the Chinese home, workflow catalog, Develop and Diagnose details, Playground, Evidence, and Docs routes; navigation and assets returned successfully.
- User acceptance review confirmed the current functionality is correct.
