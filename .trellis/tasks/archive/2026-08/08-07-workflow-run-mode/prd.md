# Focused workflow run mode

## Goal

Let users build and debug a text-processing graph on the existing canvas, then switch to a spacious, focused interface for repeated text processing without seeing intermediate nodes.

## Background

- Text can currently be edited only inside `Text Input` node cards and viewed only inside `Text Display` node cards, which leaves too little room for long-form editing and reading.
- The application is a single in-memory React Flow page with no router, persistence, or server state (`src/App.tsx:51-56`, `src/App.tsx:305-339`; `.trellis/spec/frontend/state-management.md:73-75`).
- `Text Input` is the dedicated zero-input source and stores editable text in node state; `Text Display` is the dedicated zero-output sink and renders its resolved incoming value (`src/lib/nodes.ts:157-176`, `src/components/nodes/TextInputNode.tsx:5-20`, `src/components/nodes/TextDisplayNode.tsx:4-16`).
- A graph may contain multiple dedicated inputs and outputs. Text Diff, for example, can be driven by two separate `Text Input` nodes (`src/lib/nodes.ts:227-237`).
- Graph evaluation, target-port input resolution, processor execution, and result propagation currently live in the canvas component (`src/App.tsx:200-268`). Project rules require declared target-port ordering and prohibit duplicating processor execution in presentation components (`.trellis/spec/frontend/state-management.md:24-61`, `.trellis/spec/frontend/state-management.md:79-84`).

## Requirements

- R1. Preserve the existing canvas as the workflow build and debug mode.
- R2. Add a same-page `Build` / `Use` mode switch. Both modes must share the same in-memory nodes, edges, input values, and derived results; no route transition is introduced.
- R3. In Use mode, automatically expose every `Text Input` node as a public input and every `Text Display` node as a public output. MVP has no explicit publish or port-selection step.
- R4. Support multiple public inputs and outputs. Each dedicated I/O node may have an optional public name editable in Build mode. Use mode shows that name when present and otherwise uses a deterministic, unique fallback such as `Input 1` or `Output 1`.
- R5. Use mode must provide substantially larger long-text editing and reading regions than node cards, with a responsive two-column input/output workspace on wide screens and a stacked layout on narrow screens.
- R6. Updating any public input in Use mode must immediately recompute the workflow using the current values of all public inputs and refresh all public outputs. There is no Run button or separate draft state.
- R7. Build and Use modes must call one shared graph evaluator. Use-mode components must not duplicate processor or graph propagation logic.
- R8. Intermediate nodes and intermediate results remain hidden in Use mode. Processing failures show a concise status and an action to return to Build mode for debugging.
- R9. When the graph has no dedicated inputs or no dedicated outputs, Use mode shows a helpful empty/not-ready state with an action to return to Build mode instead of an unusable blank workspace.
- R10. Switching between modes must not discard or reset topology, node configuration, public names, input text, or current outputs.

## Acceptance Criteria

- [ ] AC1. A clearly selected `Build` / `Use` control is available in the application header; switching it changes the main workspace without navigation or reload.
- [ ] AC2. Build mode retains the sidebar, canvas, node configuration, connection, selection, and deletion behavior.
- [ ] AC3. Use mode hides the sidebar, canvas, and intermediate-node details and renders all dedicated inputs and outputs in a focused workspace.
- [ ] AC4. A workflow with two or more `Text Input` or `Text Display` nodes exposes every one exactly once, with unique deterministic fallback labels.
- [ ] AC5. Editing an I/O node's optional public name in Build mode updates its Use-mode label; clearing the name restores the fallback label without changing processing behavior.
- [ ] AC6. Use-mode editors and output panels provide materially more space than node cards, preserve multiline whitespace, handle long unbroken text, and adapt from two columns to a stacked narrow-screen layout.
- [ ] AC7. Editing any Use-mode input updates the corresponding `Text Input` state and automatically refreshes every reachable public output without an additional action.
- [ ] AC8. The same evaluator and declared target-port ordering drive both canvas previews and Use-mode results, including multi-input nodes connected in either edge-creation order.
- [ ] AC9. Repeated Build/Use switching preserves nodes, edges, configurations, names, inputs, and derived outputs.
- [ ] AC10. Missing public endpoints, disconnected outputs, processor failures, and graph cycles produce understandable non-crashing states; failures do not present stale failed-branch output as a successful new result, and the user can return to Build mode.
- [ ] AC11. `npm run lint` and `npm run build` pass, followed by manual verification of single-input, multi-input, multi-output, error, empty, long-text, and mode-switch flows.

## Out of Scope

- Workflow persistence, naming, history, sharing, publishing, permissions, and cloud/server execution.
- Independent Use-mode URLs or adding a router.
- Manual endpoint publishing or exposing arbitrary processor ports.
- A Run button, queued execution, execution history, or configurable debounce controls.
- Viewing or editing intermediate node configuration from Use mode.
- Introducing a test framework solely for this feature.

