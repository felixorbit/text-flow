# State Management

> How state is managed in this project.

---

## Overview

React Flow node data is held in `FlowWithLogic` in `src/App.tsx`. Processor state is
stored in each node's `data.internalState`, while derived processor results are
stored in `data.outputValues` and propagated through edges by
`evaluateWorkflow` in `src/lib/workflow.ts`.

---

## State Categories

- Component-local interaction state uses React hooks.
- Editable processor configuration uses `data.internalState` through
  `NodeContext.updateNodeState`.
- Public endpoint presentation metadata uses `data.publicName` through
  `NodeContext.updateNodeMetadata`; it must not be stored in `internalState` or
  included in the workflow evaluation trigger.
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

## Scenario: Shared workflow evaluation boundary

### 1. Scope / Trigger

Use this contract whenever a component edits processor input, renders a derived
result, or changes graph topology. Build-mode previews and the focused Use
workspace must observe the same evaluator-owned node data.

### 2. Signatures

```typescript
evaluateWorkflow(nodes: CustomNode[], edges: Edge[]): WorkflowEvaluationResult
updateNodeState(nodeId: string, state: Record<string, unknown>): void
updateNodeMetadata(nodeId: string, publicName: string | undefined): void
```

### 3. Contracts

- `internalState` is processor input and participates in the evaluation trigger.
- `publicName` is presentation metadata and must not participate in evaluation.
- `outputValues` keys come from `NodeDefinition.outputs`; `incomingValue` is the
  resolved first input of a `Text Display` node.
- Presentation components may update state or metadata and render evaluated
  node data. They must not invoke processors or traverse edges.

### 4. Validation & Error Matrix

| Condition | Required state |
|-----------|----------------|
| Processor succeeds | Clear its prior error and write all declared outputs |
| Processor throws | Set a processing diagnostic and delete all declared outputs |
| Node is blocked by a graph cycle | Set a cycle diagnostic; clear outputs and `incomingValue` |
| Invalid input is later corrected | Clear the diagnostic and repopulate outputs |
| Only `publicName` changes | Update labels without invoking a processor |

### 5. Good / Base / Bad Cases

- Good: changing `internalState` or topology refreshes every reachable display.
- Base: a disconnected input resolves to `undefined`; its processor owns coercion.
- Bad: a failed node retains an old output, allowing downstream UI to present it
  as the result of the current input.

### 6. Tests Required

- Connect multi-input ports in reverse creation order and assert declared port
  semantics are preserved.
- Cause a processor failure, assert declared outputs are absent, correct the
  input, and assert the output and error state recover.
- Create and remove a cycle, asserting output clearing and later recovery.
- Change only `publicName` and assert processor state and output stay unchanged.

### 7. Wrong vs Correct

```typescript
// Wrong: a presentation component creates a second execution path.
const output = node.data.definition.processor(inputs, node.data.internalState)

// Correct: update the input boundary and render evaluator-owned data.
updateNodeState(node.id, { text })
const output = node.data.incomingValue
```

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
- Do not use public endpoint labels as processor state or evaluation dependencies.
- Do not leave declared outputs populated after a processing or cycle failure.
