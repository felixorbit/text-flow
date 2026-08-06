# Repository Guidelines

## Project Structure & Module Organization

Text Flow is a React 19 and TypeScript single-page application built with Vite. Application code lives in `src/`: `components/nodes/` contains text-processing node UIs, `components/layout/` contains page layout, and `components/ui/` contains reusable controls. Shared state is in `contexts/`, while node definitions and processing logic belong in `lib/`. Global styles are in `src/index.css` and `src/App.css`; static files go in `public/`, and imported assets go in `src/assets/`. Production output is generated in `dist/` and should not be edited.

When adding a processor, define its behavior in `src/lib/nodes.ts`, add the corresponding component under `src/components/nodes/`, and update shared node types where required.

## Build, Test, and Development Commands

- `npm ci`: install the exact dependency versions recorded in `package-lock.json`.
- `npm run dev`: start the Vite development server with hot reload.
- `npm run build`: type-check with `tsc -b`, then create the production bundle in `dist/`.
- `npm run lint`: run ESLint across the repository.
- `npm run preview`: serve the built application locally for final verification.

Run `npm run lint` and `npm run build` before submitting changes.

## Coding Style & Naming Conventions

Use TypeScript and functional React components. Follow the existing style: two-space indentation, single quotes, and no semicolons. Name components and their files in PascalCase (`RegexNode.tsx`), hooks with a `use` prefix, and utilities in camelCase. Prefer Tailwind utility classes for styling and keep processing logic separate from presentation. ESLint enforces TypeScript, React Hooks, and Vite refresh rules; do not suppress warnings without a documented reason.

## Testing Guidelines

No automated test framework or coverage threshold is currently configured. For every change, lint and build the project, then exercise affected flows through `npm run dev`. Verify node input, output, connection propagation, and error states. If tests are introduced, place them beside the implementation as `*.test.ts` or `*.test.tsx` and add the runner command to `package.json`.

## Commit & Pull Request Guidelines

Recent history uses short Conventional Commit-style subjects such as `feat: add LICENSE` and `docs: add project README`. Continue with an imperative `type: summary`; use `feat`, `fix`, `docs`, `refactor`, or `chore` as appropriate.

Pull requests should explain the user-visible effect, summarize implementation choices, and list verification performed. Link related issues and include screenshots or a short recording for UI changes. Keep changes focused and call out new dependencies or configuration changes explicitly.
<!-- TRELLIS:START -->
# Trellis Instructions

These instructions are for AI assistants working in this project.

This project is managed by Trellis. The working knowledge you need lives under `.trellis/`:

- `.trellis/workflow.md` — development phases, when to create tasks, skill routing
- `.trellis/spec/` — package- and layer-scoped coding guidelines (read before writing code in a given layer)
- `.trellis/workspace/` — per-developer journals and session traces
- `.trellis/tasks/` — active and archived tasks (PRDs, research, jsonl context)

If a Trellis command is available on your platform (e.g. `/trellis:finish-work`, `/trellis:continue`), prefer it over manual steps. Not every platform exposes every command.

If you're using Codex or another agent-capable tool, additional project-scoped helpers may live in:
- `.agents/skills/` — reusable Trellis skills
- `.codex/agents/` — optional custom subagents

Managed by Trellis. Edits outside this block are preserved; edits inside may be overwritten by a future `trellis update`.

<!-- TRELLIS:END -->
