# Text Diff node implementation plan

## Implementation checklist

1. Add a maintained JavaScript line-diff dependency and update the lockfile.
2. Add the `Text Diff` processor and node definition with `original`, `changed`, and `diff` port contracts in `src/lib/nodes.ts`.
3. Add `TextDiffNode.tsx` with a bounded unified-diff preview and semantic line styling.
4. Register `TextDiffNode` in the React Flow `nodeTypes` map in `src/App.tsx`.
5. Change graph evaluation to resolve incoming values in `definition.inputs` order by `targetHandle` rather than edge insertion order.
6. Review all node registrations and output IDs for consistency.

## Validation

1. Run `npm run lint`.
2. Run `npm run build`.
3. Start `npm run dev` and verify the node can be dragged from the sidebar.
4. Compare identical, added-line, removed-line, replacement, multiline, and empty inputs.
5. Connect Changed before Original and confirm the semantics do not swap.
6. Connect the Diff output to Text Display and confirm exact output propagation.
7. Smoke-test an existing single-input processor.

## Risk and rollback points

- `src/App.tsx` input resolution affects all processors; validate existing nodes immediately after this change and revert that isolated edit if compatibility breaks.
- Dependency addition touches `package.json` and `package-lock.json`; remove both entries if package typing or bundling is unsuitable, then reassess the algorithm choice before continuing.
- Preview rendering must preserve exact line prefixes while applying colors; compare preview text with downstream Text Display output.

## Review gate

- Confirm PRD, design, and implementation plan with the user before `task.py start`.
- Ensure curated `implement.jsonl` and `check.jsonl` entries exist before dispatching implementation or review.
