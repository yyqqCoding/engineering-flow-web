# Repository Guidelines

长期协作规则只放稳定约定；业务口径、接口、字段和验收清单以 `docs/` 为准。

## 工作规则

- 开发前先看 `git status --short`、相关 `docs/` 和现有实现。
- 不在 `master/main` 直接开发；修复用 `fix/*`，功能用 `feature/*`等符合Git开发规范。
- 不回滚他人改动；只改当前需求相关文件。
- 复用现有封装和代码风格；必要注释用中文说明“做什么/为什么”。
- 口径不明时先确认，并同步更新对应 `docs/`。
- 
## Project Structure & Module Organization

This is a bilingual Astro static site. Route entry points live in `src/pages/`; localized pages use `src/pages/[locale]/` with stable English slugs. Shared UI belongs in `src/components/`, page chrome in `src/layouts/`, and global design tokens in `src/styles/global.css`. Product copy, workflow definitions, and curated snapshots are owned by `src/data/`. Keep reusable, framework-independent behavior in `src/lib/` so it can be tested directly. Tests live in `test/`, requirement records in `docs/requirements/`, and UI references in `docs/UiImage/`.

## Build, Test, and Development Commands

- `npm install` installs the locked Astro and TypeScript dependencies. Use Node.js 22.12 or newer.
- `npm run dev` starts the local Astro development server.
- `npm test` runs Node's built-in test runner against `test/*.test.mjs`.
- `npm run check` performs Astro and TypeScript diagnostics.
- `npm run build` generates the production static site in `dist/`.
- `npm run preview` serves the latest production build locally.

Run tests, checks, and a production build before handing off a change.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons in TypeScript/JavaScript, and single quotes in module code. Name Astro components in PascalCase (`Lifecycle.astro`), libraries and data modules in lowercase, and tests as `<subject>.test.mjs`. Prefer explicit, locally understandable code and existing CSS variables over new dependencies or one-off colors. Keep English and Simplified Chinese content behaviorally equivalent. No formatter or linter is currently configured; `npm run check` is the authoritative static check.

## Testing Guidelines

Use `node:test` with `node:assert/strict`. Test stable behavior at the highest practical seam, especially locale-path mapping and Playground state transitions. Any approval-gate change must prove implementation cannot advance without explicit approval. Presentation-only changes require a successful build and manual review at desktop and mobile widths.

## Commit & Pull Request Guidelines

Follow the existing Conventional Commits-style subject, for example `feat: refine bilingual workflow cards`. Develop on `feature/*` or `fix/*`, not directly on `main`. Pull requests should describe user-visible changes, link the applicable requirement record, list verification commands, and include before/after screenshots for visual work. Call out snapshot-source changes and any known deployment limitations.

## Security & Content Snapshots

Never publish raw benchmark logs, local paths, thread IDs, provider/model details, stderr, prompts, or diffs. Curate public data in `src/data/`, record its source version and commit, and keep the deployed site independent of sibling repositories and runtime APIs.
