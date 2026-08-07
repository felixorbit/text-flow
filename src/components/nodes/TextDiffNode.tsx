import { BaseNode } from './BaseNode'
import type { CustomNodeProps } from './types'

export function TextDiffNode(props: CustomNodeProps) {
  const output = String(props.data.outputValues.diff ?? 'No differences')
  const lines = output.split('\n')

  return (
    <BaseNode {...props} className="w-[380px]">
      <div className="max-h-[240px] overflow-auto rounded-md border bg-muted/30 py-2 font-mono text-xs">
        {lines.map((line, index) => {
          const lineStyle = line.startsWith('+')
            ? 'bg-green-500/10 text-green-700 dark:text-green-400'
            : line.startsWith('-')
              ? 'bg-red-500/10 text-red-700 dark:text-red-400'
              : 'text-muted-foreground'

          return (
            <div
              key={`${index}-${line}`}
              className={`min-w-max whitespace-pre px-3 leading-5 ${lineStyle}`}
            >
              {line}
            </div>
          )
        })}
      </div>
    </BaseNode>
  )
}
