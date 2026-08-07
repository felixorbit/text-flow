import { AlertTriangle, ArrowLeft, TextCursorInput, Type } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useNodeContext } from '@/contexts/NodeContext'
import type { CustomNode } from '@/lib/nodes'

interface WorkflowRunViewProps {
  nodes: CustomNode[]
  onBackToBuild: () => void
}

function getEndpointName(node: CustomNode, fallbackName: string) {
  return node.data.publicName?.trim() || fallbackName
}

export function WorkflowRunView({
  nodes,
  onBackToBuild,
}: WorkflowRunViewProps) {
  const { updateNodeState } = useNodeContext()
  const inputs = nodes.filter(node => node.type === 'textInput')
  const outputs = nodes.filter(node => node.type === 'textDisplay')
  const errorNodes = nodes.filter(node => node.data.evaluationError)

  if (inputs.length === 0 || outputs.length === 0) {
    const missingEndpoints = [
      inputs.length === 0 ? 'a Text Input' : null,
      outputs.length === 0 ? 'a Text Display' : null,
    ].filter(Boolean).join(' and ')

    return (
      <section className="flex min-h-0 flex-1 items-center justify-center overflow-y-auto bg-slate-50/70 p-6">
        <div className="w-full max-w-xl rounded-2xl border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <TextCursorInput className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-semibold">Workflow is not ready to use</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Add {missingEndpoints} in Build mode so this workflow has public text to edit and a result to display.
          </p>
          <Button className="mt-6 gap-2" onClick={onBackToBuild}>
            <ArrowLeft className="h-4 w-4" />
            Back to Build
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-slate-50/70 lg:overflow-hidden">
      <div className="mx-auto flex min-h-full w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 lg:px-8">
        <div className="mb-4 flex shrink-0 flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Use workflow</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Edit any input to refresh every connected output instantly.
            </p>
          </div>
          <Button variant="outline" size="sm" className="gap-2" onClick={onBackToBuild}>
            <ArrowLeft className="h-4 w-4" />
            Back to Build
          </Button>
        </div>

        {errorNodes.length > 0 && (
          <div
            className="mb-4 flex shrink-0 items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm"
            role="alert"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-destructive">Workflow needs attention</p>
              <p className="mt-0.5 text-muted-foreground">
                {errorNodes.some(node => node.data.evaluationError?.kind === 'cycle')
                  ? 'A cycle is preventing part of the workflow from running.'
                  : 'One or more steps could not process the current input.'}
                {' '}Return to Build mode to inspect the highlighted nodes.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onBackToBuild}>
              Back to Build
            </Button>
          </div>
        )}

        <div className="grid gap-5 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
          <div className="flex flex-col lg:min-h-0 lg:overflow-y-auto lg:pr-1">
            <div className="mb-3 flex shrink-0 items-center gap-2">
              <TextCursorInput className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Inputs</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {inputs.length}
              </span>
            </div>
            <div className="grid gap-4 pb-1">
              {inputs.map((node, index) => {
                const name = getEndpointName(node, `Input ${index + 1}`)
                const inputId = `workflow-input-${node.id}`

                return (
                  <article key={node.id} className="rounded-xl border bg-card p-4 shadow-sm">
                    <label className="mb-2 block text-sm font-semibold" htmlFor={inputId}>
                      {name}
                    </label>
                    <textarea
                      id={inputId}
                      className="block min-h-72 w-full resize-y rounded-lg border bg-background p-4 font-mono text-sm leading-6 focus:outline-none focus:ring-2 focus:ring-ring lg:min-h-88"
                      placeholder={`Enter text for ${name}...`}
                      value={String(node.data.internalState.text ?? '')}
                      onChange={event => updateNodeState(node.id, {
                        text: event.target.value,
                      })}
                    />
                  </article>
                )
              })}
            </div>
          </div>

          <div className="flex flex-col lg:min-h-0 lg:overflow-y-auto lg:pl-1">
            <div className="mb-3 flex shrink-0 items-center gap-2">
              <Type className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">Outputs</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {outputs.length}
              </span>
            </div>
            <div className="grid gap-4 pb-1">
              {outputs.map((node, index) => {
                const name = getEndpointName(node, `Output ${index + 1}`)
                const displayValue = node.data.incomingValue

                return (
                  <article key={node.id} className="rounded-xl border bg-card p-4 shadow-sm">
                    <h4 className="mb-2 text-sm font-semibold">{name}</h4>
                    <div
                      className="min-h-72 max-h-[32rem] overflow-auto whitespace-pre-wrap break-all rounded-lg border bg-muted/30 p-4 font-mono text-sm leading-6 lg:min-h-88"
                      aria-live="polite"
                      aria-label={`${name} output`}
                    >
                      {displayValue === undefined ? (
                        <span className="font-sans italic text-muted-foreground">
                          Waiting for a connected result...
                        </span>
                      ) : String(displayValue)}
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
