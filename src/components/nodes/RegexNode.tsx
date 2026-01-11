import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function RegexNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeState } = useNodeContext();

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { pattern: event.target.value });
  };

  const handleFlagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { flags: event.target.value });
  };

  return (
    <BaseNode {...props}>
      <div className="space-y-3">
        <div>
          <label htmlFor={`pattern-${id}`} className="text-xs font-medium text-muted-foreground uppercase block mb-1">Pattern</label>
          <input
            type="text"
            id={`pattern-${id}`}
            className="w-full p-2 bg-background border rounded-md text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            value={data.internalState.pattern as string}
            onChange={handlePatternChange}
            placeholder="e.g., [a-z]+"
          />
        </div>
        <div>
          <label htmlFor={`flags-${id}`} className="text-xs font-medium text-muted-foreground uppercase block mb-1">Flags</label>
          <input
            type="text"
            id={`flags-${id}`}
            className="w-full p-2 bg-background border rounded-md text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            value={data.internalState.flags as string}
            onChange={handleFlagsChange}
            placeholder="e.g., gi"
          />
        </div>
      </div>
    </BaseNode>
  );
}