# Text Diff node design

## Architecture and boundaries

- Add the line-diff dependency to the existing Vite application.
- Keep diff computation in `src/lib/nodes.ts` as a pure processor, consistent with the other text-processing nodes.
- Add `src/components/nodes/TextDiffNode.tsx` only for rendering the processor result; it does not own comparison state.
- Register the component in `src/App.tsx` and the definition in `nodeDefinitions`. Sidebar discovery remains automatic.

## Data flow and contracts

1. Two upstream edges target the `original` and `changed` handles.
2. Flow evaluation constructs processor inputs by iterating `definition.inputs` and resolving the edge for each target handle.
3. The processor converts missing or non-string values with the same string-coercion convention used by existing processors, with nullish values becoming empty strings.
4. The diff library returns ordered unchanged/added/removed line groups.
5. The processor formats every output line with ` `, `+`, or `-` and returns one plain string; exact equality returns `No differences`.
6. `outputValues.diff` drives both the node preview and any downstream connection.

## UI behavior

- The preview is a bounded, scrollable monospace region so large output does not expand the entire canvas node.
- Added and removed rows receive semantic green/red styling; unchanged rows remain neutral.
- `No differences` is displayed as a neutral status.
- Prefix characters remain part of the selectable/copyable text and downstream output.

## Compatibility and trade-offs

- Port-ordered input resolution fixes a latent multi-input contract issue. Existing one-input nodes retain the same value mapping.
- If multiple edges target the same input handle, use the first matching edge, matching the graph's current lack of explicit multi-value semantics. This task does not add connection validation.
- Unified output is intentionally human-readable rather than a standards-compliant patch: headers and hunk coordinates are omitted.
- A maintained dependency avoids a bespoke quadratic diff implementation and its edge cases; the package and lockfile changes are kept isolated for easy rollback.

## Rollback

- Remove the Text Diff registration, component, processor definition, and dependency entries.
- Revert the port-ordered input resolution independently if it causes an unexpected compatibility issue, though reverse-order verification should catch regressions before completion.
