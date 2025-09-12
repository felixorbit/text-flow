
import { Handle, Position } from 'reactflow';
import { useNodeContext } from '@/contexts/NodeContext';
import type { CustomNodeProps } from './types';

export function RegexNode({ id, data }: CustomNodeProps) {
  const { updateNodeState } = useNodeContext();

  const handlePatternChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { pattern: event.target.value });
  };

  const handleFlagsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { flags: event.target.value });
  };

  return (
    <div className={`p-4 border rounded-md bg-white shadow-lg w-72 ${data.hasError ? 'border-red-500' : ''}`}>
      <Handle type="target" position={Position.Left} id="input" className="!bg-green-500" />
      <label className="font-bold text-sm">{data.definition.name}</label>
      <div className="mt-2 space-y-2">
        <div>
          <label htmlFor={`pattern-${id}`} className="text-xs font-medium">Pattern</label>
          <input
            type="text"
            id={`pattern-${id}`}
            className="w-full mt-1 p-1 border rounded-md text-sm font-mono focus:outline-blue-500"
            value={data.internalState.pattern as string}
            onChange={handlePatternChange}
            placeholder="e.g., [a-z]+"
          />
        </div>
        <div>
          <label htmlFor={`flags-${id}`} className="text-xs font-medium">Flags</label>
          <input
            type="text"
            id={`flags-${id}`}
            className="w-full mt-1 p-1 border rounded-md text-sm font-mono focus:outline-blue-500"
            value={data.internalState.flags as string}
            onChange={handleFlagsChange}
            placeholder="e.g., gi"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-blue-500" />
    </div>
  );
}
