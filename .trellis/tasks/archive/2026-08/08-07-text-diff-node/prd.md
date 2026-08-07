# Add text diff node

## Goal

Add a text-processing node that compares an original text with a changed text, letting users inspect a compact unified line diff and pass that plain-text result to downstream nodes.

## Background

- Node definitions and processors are centralized in `src/lib/nodes.ts`; node UIs live in `src/components/nodes/` and are registered in `src/App.tsx`.
- The sidebar is generated from `nodeDefinitions`, so a registered definition appears automatically.
- The graph engine currently builds processor inputs in edge insertion order rather than target-port order. A two-input Diff node requires deterministic mapping by target handle so Original and Changed cannot be swapped by connection order.
- The project currently has no diff library and no automated test runner.

## Requirements

- Add a node named `Text Diff` with labeled `Original` and `Changed` input ports and a `Diff` output port.
- Compare both inputs as plain text at line granularity and update whenever either upstream value changes.
- Render a compact, scrollable monospace preview inside the node using `-` for removed lines, `+` for added lines, and a leading space for unchanged lines, with visual color distinction for added and removed content.
- Emit the same unified diff as plain text through the output port for downstream processing.
- Return the clear message `No differences` when the two inputs are identical.
- Treat empty or disconnected inputs as empty strings so partially connected flows remain usable.
- Map processor arguments by the node definition's input-port order, independent of edge creation order.
- Use a maintained line-diff library rather than maintaining a custom diff algorithm.
- Follow the existing node component, registration, styling, and error-state conventions.

## Acceptance Criteria

- [ ] `Text Diff` appears in the node sidebar and can be dragged onto the canvas.
- [ ] The node exposes distinct `Original` and `Changed` input handles and one `Diff` output handle.
- [ ] Connecting the same two sources in either order preserves the intended Original/Changed interpretation.
- [ ] Identical inputs emit and display `No differences`.
- [ ] Added, removed, and unchanged lines use the agreed unified prefixes and are visually distinguishable in the node preview.
- [ ] The emitted plain-text result matches the preview content and propagates to a connected `Text Display` node.
- [ ] Empty, disconnected, and multiline inputs do not crash the flow.
- [ ] Existing single-input nodes continue to receive their connected values correctly.
- [ ] `npm run lint` and `npm run build` pass.

## Out of Scope

- Character- or word-level highlighting within changed lines.
- Side-by-side comparison.
- Editing, merging, patch application, or conflict resolution.
- File metadata headers, hunk coordinates, or patch-file compatibility.
- Persisting/exporting workflows or diff reports.
- Binary or rich-text comparison.

## Technical Notes

- Adding one focused runtime dependency for the line-diff algorithm is acceptable; no testing framework will be introduced as part of this task.
- Browser verification must cover reverse connection order because the current edge-order behavior is the main integration risk.
