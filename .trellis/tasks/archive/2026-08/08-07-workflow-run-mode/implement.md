# Focused workflow run mode implementation plan

## Implementation checklist

1. Extract the current topological processor execution from `FlowWithLogic` into a shared workflow evaluator, preserving declared target-port ordering and output-port mapping.
2. Add processor-failure and cycle handling that clears stale failed outputs and produces UI-readable diagnostics; integrate the evaluator back into the existing canvas state loop.
3. Extend node data with optional public-name metadata and add a dedicated metadata update method that does not mutate processor `internalState`.
4. Add compact public-name fields to the Build-mode `Text Input` and `Text Display` nodes, including normalization and accessible labels.
5. Add application-level `build` / `use` mode state and an accessible header segmented control; keep the workflow state owner mounted and make deletion actions Build-only.
6. Implement `WorkflowRunView` to project all dedicated endpoints, assign deterministic fallback labels, edit input node state, and render shared output values.
7. Add the responsive wide-screen two-column and narrow-screen stacked layout, large long-text regions, endpoint-empty states, disconnected-output state, workflow-error alert, and `Back to Build` actions.
8. Review the complete data flow to ensure no processor or port-resolution logic exists in presentation components and no public-name change triggers evaluation.

## Validation

1. Run `npm run lint`.
2. Run `npm run build`.
3. Start `npm run dev` and verify Build mode still supports dragging, connecting, selecting, deleting, configuring, and editing all existing node types.
4. Verify a `Text Input -> Base64 -> Text Display` flow updates immediately from the Use-mode textarea and matches the canvas result.
5. Verify `Text Diff` with two Text Inputs when its ports are connected in both creation orders; confirm `Original` and `Changed` semantics do not swap.
6. Verify multiple Text Input and Text Display nodes appear exactly once, custom public names render correctly, and clearing a name restores unique fallback numbering.
7. Switch modes repeatedly after editing topology, processor configuration, names, inputs, and outputs; confirm all values survive.
8. Verify empty graph, missing inputs, missing outputs, disconnected display, invalid JSON/regex/crypto input, and a graph cycle show non-crashing states and do not present stale failed output as current success.
9. Paste multiline text, long text, and a long unbroken token; verify whitespace, wrapping, scrolling, selection, and responsive stacked layout.
10. Confirm Use mode contains no sidebar, canvas, intermediate results, delete action, or Run button and provides a direct return to Build mode.

## Risk and rollback points

- `src/lib/workflow.ts` changes evaluation for every node type. Validate existing single-input nodes immediately after extraction and stop/revert that isolated step if values differ.
- Error-output clearing changes current stale-value behavior intentionally. Verify recovery after correcting invalid input and ensure unrelated valid branches still render.
- Mode switching must not conditionally mount the component that owns nodes and edges. If state resets, restore the persistent owner before continuing visual work.
- Public names must not enter `internalState`; if name edits recalculate processors, move the field/update boundary before proceeding.
- Responsive sizing can create nested overflow traps inside the full-height app. Check both viewport axes and keep scrolling owned by the endpoint columns/cards rather than the document body.

## Review gate

- Confirm the converged PRD, design, and implementation plan with the user before running `task.py start`.
- Curate real `implement.jsonl` and `check.jsonl` context entries before implementation dispatch.
- Re-run the PRD convergence check if any product behavior changes during review.

