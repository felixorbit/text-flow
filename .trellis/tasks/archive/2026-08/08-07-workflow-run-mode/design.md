# Focused workflow run mode design

## Architecture and boundaries

Keep one mounted workflow state owner and introduce three explicit boundaries:

1. `App` owns the presentation mode (`build` or `use`) and renders the header switch.
2. `FlowWithLogic` continues to own React Flow nodes and edges, but delegates graph calculation to a shared workflow evaluator.
3. A focused workflow component renders public inputs and outputs from the evaluated node state and updates inputs through the existing node-state mutation boundary.

Suggested file ownership:

- `src/App.tsx`: mode state, header actions, workflow-state ownership, and evaluator integration.
- `src/lib/workflow.ts`: shared graph evaluation and any graph-level diagnostic contract.
- `src/components/workflow/WorkflowRunView.tsx`: focused I/O layout, endpoint projection, fallback labels, empty states, and error status.
- `src/lib/nodes.ts`: public-name field on `CustomNodeData` if the type remains colocated with node contracts.
- `src/contexts/NodeContext.tsx`: a narrow update method for public node metadata in addition to processor state.
- `TextInputNode.tsx` and `TextDisplayNode.tsx`: Build-mode public-name controls.

This is one integrated deliverable rather than a parent/child task tree: the evaluator extraction, I/O metadata, and focused view share one state contract and cannot be independently useful to the user.

## Data flow and contracts

### Public endpoint metadata

- Dedicated endpoints are selected only by node type: `textInput` and `textDisplay`.
- Add optional `publicName?: string` to node data. Normalize whitespace-only values to unnamed at render/update time.
- Preserve processor configuration in `internalState`; changing `publicName` must not trigger processor re-execution.
- In Use mode, enumerate each endpoint category in current node-array order. A non-empty public name wins; otherwise render `Input N` or `Output N`, where `N` is the one-based position within that category.

### Live processing

```text
Use-mode textarea
  -> updateNodeState(textInputId, { text })
  -> nodes state changes
  -> shared evaluator resolves graph in declared port order
  -> outputValues / incomingValue / error flags update
  -> all Use-mode output panels render the shared result
```

Build-mode input editing follows the same path. The focused component never calls a processor.

### Evaluator result

Extract the existing topological evaluation into a deterministic function that receives nodes and edges and returns evaluated nodes plus any graph-level condition needed by the UI. Preserve these contracts:

- Processor inputs are constructed in `definition.inputs` order by matching `targetHandle`.
- Processor outputs are assigned in `definition.outputs` order and keyed by output port ID.
- A disconnected input resolves to `undefined`; each processor retains ownership of its existing coercion behavior.
- A successful `Text Display` receives the resolved first input as `incomingValue`.

Strengthen failure behavior while extracting:

- On processor failure, set the node error flag and clear its declared output values before continuing propagation.
- Nodes left outside the topological order are treated as a cycle error and cannot retain successful-looking stale outputs.
- Clear an error flag after a later successful evaluation.
- Use mode derives a concise workflow error status from evaluator/node diagnostics and offers `Back to Build`; detailed node troubleshooting remains on the canvas.

## UI behavior

### Header

- Add an accessible two-option `Build` / `Use` segmented control with an obvious selected state.
- Keep branding stable across modes and update the small subtitle to match the active context if it improves clarity.
- Show selection deletion only in Build mode. Use mode instead keeps the header focused on mode navigation and status.

### Build mode

- Preserve the sidebar and React Flow canvas unchanged apart from I/O public-name controls.
- Place a compact optional name field inside each `Text Input` and `Text Display` card. It labels the endpoint in Use mode and does not rename the node type.

### Use mode

- Replace the sidebar and canvas with a centered, full-height workspace.
- On wide screens, render an Inputs column and an Outputs column of equal visual weight. Stack them on narrow screens.
- Each input uses a large monospace textarea. Each output uses a large scrollable/pre-wrapped monospace panel with long-token breaking and copy-friendly selectable text.
- Multiple endpoints render as separate labeled cards within their respective column.
- If either endpoint category is missing, render a not-ready state that explains what to add and provides `Back to Build`.
- A disconnected display renders a waiting/empty state. A processing or cycle failure renders a concise alert without exposing intermediate details.

## Compatibility and trade-offs

- Same-page conditional rendering is chosen over routing because workflow data is in memory and must survive mode switches.
- Automatic dedicated-node exposure is chosen over explicit publishing for a smaller, predictable MVP; arbitrary ports remain private.
- Live evaluation is chosen over a Run button, draft state, or execution history and preserves current processor semantics.
- Optional public names improve multi-input usability without adding a publication workflow.
- Node-array order is sufficient for deterministic fallback labels in this in-memory MVP. Persistent interface ordering can be designed alongside future workflow persistence.
- Evaluator extraction carries more risk than rendering directly from the canvas effect, but it prevents two execution implementations from drifting and creates a testable boundary for future work.

## Rollout and rollback

- Extract and validate the evaluator before adding the new presentation mode so existing canvas behavior can be smoke-tested independently.
- Add public-name metadata without changing processor state to isolate naming regressions.
- Add the mode switch and focused component last.
- If the focused UI regresses, it can be removed while retaining the evaluator extraction and canvas behavior.
- If evaluator extraction changes existing results, revert that boundary independently before proceeding with the UI.

