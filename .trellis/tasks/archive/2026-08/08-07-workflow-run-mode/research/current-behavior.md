# Current behavior and integration evidence

## Application ownership

- `FlowWithLogic` owns `nodes` and `edges` as local state (`src/App.tsx:51-56`). Keeping this component mounted while changing its rendered workspace is the smallest way to preserve state across modes.
- `App` owns the application header while `FlowWithLogic` owns workflow state (`src/App.tsx:305-339`). A mode value can live in `App` and be passed into the still-mounted workflow component.
- The application has no router, persistence, or server state, so an independent Use-mode route would add state transfer and refresh semantics that the product does not yet support.

## I/O contract

- `Text Input` is identified by node type `textInput`, has no declared inputs, exposes output port `text`, and returns `internalState.text` from its processor (`src/lib/nodes.ts:47-48`, `src/lib/nodes.ts:157-167`).
- `Text Display` is identified by node type `textDisplay`, accepts port `text`, has no outputs, and receives its resolved value through `data.incomingValue` (`src/lib/nodes.ts:168-176`, `src/App.tsx:258-260`).
- Multiple I/O nodes are already legal. Node array order is stable across position changes and can provide deterministic fallback numbering for the in-memory MVP.
- Public names are presentation metadata and should live directly on `CustomNodeData` rather than inside `internalState`; this keeps label edits from being treated as processor configuration changes.

## Execution contract

- Current evaluation topologically sorts nodes, resolves processor arguments by iterating declared input ports, invokes each processor, writes outputs by declared output port ID, and updates `Text Display.incomingValue` (`src/App.tsx:200-268`).
- State management guidelines require target-port ordering and say UI components must render shared derived output rather than recalculate it (`.trellis/spec/frontend/state-management.md:24-61`, `.trellis/spec/frontend/state-management.md:79-84`).
- The evaluator should therefore move to a shared pure workflow module. Both the canvas previews and focused workspace should observe the resulting node data; input edits from either mode should flow through the same state update and evaluator path.
- Current processor failures only set `hasError` and may leave prior output values in place (`src/App.tsx:241-255`). The shared evaluator must clear failed-node outputs and mark cycles so Use mode cannot imply that stale failed-branch data is current.

## UI evidence

- The current `Text Input` textarea has a `100px` minimum height inside a `280px`-minimum node card (`src/components/nodes/TextInputNode.tsx:14-20`, `src/components/nodes/BaseNode.tsx:24-31`).
- `Text Display` is capped at `300px` inside its node (`src/components/nodes/TextDisplayNode.tsx:8-16`).
- The header already has room for global controls, and the existing shared `Button` supports default, outline, secondary, and ghost presentation (`src/App.tsx:305-333`, `src/components/ui/button.tsx:8-34`).
- Build-only destructive actions should be hidden in Use mode to keep the focused workspace safe and uncluttered.

## Verification risks

- Reverse-order connections to multi-input processors must preserve declared port semantics.
- Changing public names must not cause processor execution or change outputs.
- Conditional rendering must not remount the workflow state owner.
- Empty graphs, missing one endpoint category, disconnected displays, processor errors, and cycles need explicit non-crashing states.
- Long lines require wrapping/breaking while multiline values preserve whitespace.

