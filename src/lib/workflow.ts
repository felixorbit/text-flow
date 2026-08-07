import type { Edge } from 'reactflow'
import { produce } from 'immer'

import type { CustomNode } from '@/lib/nodes'

export type WorkflowErrorKind = 'processing' | 'cycle'

export interface WorkflowEvaluationError {
  kind: WorkflowErrorKind
  nodeId: string
  nodeName: string
  message: string
}

export interface WorkflowEvaluationResult {
  nodes: CustomNode[]
  errors: WorkflowEvaluationError[]
}

function valuesMatch(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

function snapshotState(state: Record<string, unknown>) {
  return JSON.parse(JSON.stringify(state)) as Record<string, unknown>
}

interface NodeOutputState {
  data: {
    definition: {
      outputs: ReadonlyArray<{ id: string }>
    }
    outputValues: Record<string, unknown>
  }
}

function clearDeclaredOutputs(node: NodeOutputState) {
  for (const output of node.data.definition.outputs) {
    delete node.data.outputValues[output.id]
  }
}

export function evaluateWorkflow(
  nodes: CustomNode[],
  edges: Edge[],
): WorkflowEvaluationResult {
  const nodeIds = new Set(nodes.map(node => node.id))
  const workflowEdges = edges.filter(edge => (
    nodeIds.has(edge.source) && nodeIds.has(edge.target)
  ))
  const inDegree = new Map(nodes.map(node => [node.id, 0]))

  for (const edge of workflowEdges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1)
  }

  const queue = nodes.filter(node => inDegree.get(node.id) === 0)
  const sortedNodeIds: string[] = []

  while (queue.length > 0) {
    const node = queue.shift()
    if (!node) continue

    sortedNodeIds.push(node.id)
    for (const edge of workflowEdges) {
      if (edge.source !== node.id) continue

      const nextDegree = (inDegree.get(edge.target) ?? 1) - 1
      inDegree.set(edge.target, nextDegree)
      if (nextDegree === 0) {
        queue.push(nodes.find(candidate => candidate.id === edge.target)!)
      }
    }
  }

  const sortedNodeIdSet = new Set(sortedNodeIds)
  const errors: WorkflowEvaluationError[] = []
  const evaluatedNodes = produce(nodes, draft => {
    const draftMap = new Map(draft.map(node => [node.id, node]))

    for (const nodeId of sortedNodeIds) {
      const node = draftMap.get(nodeId)
      if (!node) continue

      const incomingEdges = workflowEdges.filter(edge => edge.target === nodeId)
      const inputs = node.data.definition.inputs.map(port => {
        const edge = incomingEdges.find(candidate => candidate.targetHandle === port.id)
        if (!edge) return undefined

        const source = draftMap.get(edge.source)
        const sourceHandle = edge.sourceHandle || 'output'
        return source?.data.outputValues[sourceHandle]
      })
      const inputsChanged = !valuesMatch(inputs, node.data.lastInputs)
      const stateChanged = !valuesMatch(
        node.data.internalState,
        node.data.lastInternalState,
      )
      const shouldProcess = inputsChanged
        || stateChanged
        || node.data.hasError
        || Boolean(node.data.evaluationError)

      if (shouldProcess) {
        try {
          const outputs = node.data.definition.processor(
            inputs,
            node.data.internalState,
          )

          node.data.hasError = false
          node.data.evaluationError = undefined
          node.data.definition.outputs.forEach((port, index) => {
            node.data.outputValues[port.id] = outputs[index]
          })
        } catch (error) {
          const message = error instanceof Error
            ? error.message
            : 'This node could not process its input.'

          clearDeclaredOutputs(node)
          node.data.hasError = true
          node.data.evaluationError = {
            kind: 'processing',
            message,
          }
          errors.push({
            kind: 'processing',
            nodeId: node.id,
            nodeName: node.data.definition.name,
            message,
          })
        }

        node.data.lastInputs = inputs
        node.data.lastInternalState = snapshotState(node.data.internalState)
      } else if (node.data.evaluationError) {
        errors.push({
          kind: node.data.evaluationError.kind,
          nodeId: node.id,
          nodeName: node.data.definition.name,
          message: node.data.evaluationError.message,
        })
      }

      if (node.type === 'textDisplay') {
        node.data.incomingValue = inputs[0]
      }
    }

    for (const node of draft) {
      if (sortedNodeIdSet.has(node.id)) continue

      const message = 'A workflow cycle prevents this node from running.'
      clearDeclaredOutputs(node)
      node.data.incomingValue = undefined
      node.data.hasError = true
      node.data.evaluationError = {
        kind: 'cycle',
        message,
      }
      errors.push({
        kind: 'cycle',
        nodeId: node.id,
        nodeName: node.data.definition.name,
        message,
      })
    }
  })

  return {
    nodes: evaluatedNodes,
    errors,
  }
}
