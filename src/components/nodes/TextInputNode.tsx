import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function TextInputNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeMetadata, updateNodeState } = useNodeContext();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeState(id, { text: event.target.value });
  };

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
        placeholder="Input name (optional)"
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
      <textarea
        className="nodrag nowheel w-full p-2 text-sm font-mono bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px] resize-y"
        placeholder="Enter text..."
        value={(data.internalState.text as string) || ''}
        onChange={handleChange}
      />
    </BaseNode>
  );
}
