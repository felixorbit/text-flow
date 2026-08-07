# Current behavior research

## Node registration

- `src/lib/nodes.ts` owns processor functions, port definitions, icons, initial state, and component references.
- `src/App.tsx` separately registers component types with React Flow.
- `src/components/layout/Sidebar.tsx` enumerates `nodeDefinitions`, so no dedicated sidebar edit is needed for a new definition.

## Processor data flow

- `src/App.tsx` topologically evaluates graph nodes and gathers each node's incoming edges.
- Processor inputs are currently produced by mapping `incomingEdges`, which ties argument position to edge insertion order.
- A two-input node therefore requires target-handle lookup in definition order.
- Processor outputs are assigned to definition outputs by array index and stored in `data.outputValues`.

## UI and verification constraints

- `BaseNode` already renders any number of input/output handles and their tooltip labels.
- Node components receive `data.outputValues`, allowing the Diff preview to render the processor result without duplicating computation.
- The repository has lint and production-build commands but no automated test runner; interactive flow verification is required.
- No diff implementation is present in the current dependency graph or source tree.
