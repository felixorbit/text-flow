# State Management

> How state is managed in this project.

---

## Overview

React Flow node data is held in `FlowWithLogic` in `src/App.tsx`. Processor state is
stored in each node's `data.internalState`, while derived processor results are
stored in `data.outputValues` and propagated through edges.

---

## State Categories

- Component-local interaction state uses React hooks.
- Editable processor configuration uses `data.internalState` through
  `NodeContext.updateNodeState`.
- Processor results use `data.outputValues`, keyed by the output port ID declared
  in `NodeDefinition.outputs`.
- The application currently has no server state.

### Convention: Resolve processor inputs by target port

**What**: Build the processor input array in `NodeDefinition.inputs` order and
resolve each value through the edge whose `targetHandle` matches that port ID.

**Why**: Edge array order reflects connection creation order, not the processor's
argument contract. Mapping `incomingEdges` directly can silently swap semantic
inputs on nodes such as Text Diff.

```typescript
const inputs = definition.inputs.map(port => {
  const edge = incomingEdges.find(candidate => candidate.targetHandle === port.id)
  if (!edge) return undefined

  const source = nodeMap.get(edge.source)
  const sourceHandle = edge.sourceHandle || 'output'
  return source?.data.outputValues[sourceHandle]
})
```

The processor contract is positional: `inputs[i]` corresponds to
`definition.inputs[i]`. A disconnected port produces `undefined`; processors
must define their own empty-input coercion or validation behavior.

Validation cases:

- Base: one connected input resolves to its source output.
- Good: connecting multi-input ports in reverse chronological order preserves
  their declared semantic positions.
- Bad: multiple edges on one target port are not a supported multi-value input;
  the evaluator currently uses the first matching edge.

Required checks when adding a multi-input node:

- Connect ports in both creation orders and assert identical argument mapping.
- Leave each port disconnected in turn and assert the processor's documented
  empty-input behavior.
- Connect the output downstream and assert the declared output-port ID is used.

---

## When to Use Global State

Keep configuration in node data when it affects processor output or must travel
with the node. Keep transient presentation-only interactions local to the
component.

---

## Server State

Not currently applicable; Text Flow runs processor evaluation in the browser.

---

## Common Mistakes

- Do not derive processor argument positions by mapping `incomingEdges`; always
  map declared input ports and look up their matching `targetHandle`.
- Do not duplicate processor computation inside a node component. Render the
  corresponding value from `data.outputValues` instead.
