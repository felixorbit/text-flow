import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function TextDisplayNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeMetadata } = useNodeContext();
  const displayValue = data.incomingValue;

  return (
    <BaseNode {...props}>
      <label
        className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
        htmlFor={`public-name-${id}`}
      >
        Use mode name
      </label>
      <input
        id={`public-name-${id}`}
        className="nodrag mb-3 w-full rounded-md border bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
        placeholder="Output name (optional)"
        value={data.publicName ?? ''}
        onChange={event => updateNodeMetadata(
          id,
          event.target.value.trim().length > 0 ? event.target.value : undefined,
        )}
        onBlur={event => updateNodeMetadata(
          id,
          event.target.value.trim() || undefined,
        )}
      />
      <div className="w-full p-3 bg-muted/50 border rounded-md text-sm font-mono whitespace-pre-wrap break-all min-h-[60px] max-h-[300px] overflow-y-auto">
        {displayValue === undefined ? (
          <span className="text-muted-foreground italic">Waiting for input...</span>
        ) : (
          String(displayValue)
        )}
      </div>
    </BaseNode>
  );
}
