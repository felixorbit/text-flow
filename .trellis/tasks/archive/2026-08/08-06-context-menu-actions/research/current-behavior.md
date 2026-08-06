# Context Menu Research

## Current behavior

- `src/App.tsx:38-40` owns controlled node and edge state inside `FlowWithLogic`.
- `src/App.tsx:52-61` applies React Flow changes and implements selected-element deletion.
- `src/App.tsx:177-193` configures the React Flow canvas and keyboard deletion.
- `src/App.tsx:217-225` exposes the existing top-level selected-element delete action.

## Available integration points

- React Flow 11 declares `onNodeContextMenu` and `onEdgeContextMenu` in `node_modules/@reactflow/core/dist/esm/types/component-props.d.ts:15,35`.
- Context-menu positioning can be derived from the pointer client coordinates and clamped to the existing `reactFlowWrapper` bounds.
- The current controlled state allows deletion to remain local to `FlowWithLogic`, including removal of edges connected to deleted nodes.

## Planning conclusion

This is a lightweight, single-component interaction change. A PRD plus this evidence record is sufficient; separate architecture and execution-plan documents would not add a meaningful design boundary.
