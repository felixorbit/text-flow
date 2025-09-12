
import { Handle, Position } from 'reactflow';
import { useNodeContext } from '@/contexts/NodeContext';
import type { CustomNodeProps } from './types';

const modes = [
    { id: 'format', label: 'Format' },
    { id: 'compress', label: 'Compress' },
    { id: 'escape', label: 'Escape' },
    { id: 'unescape', label: 'Unescape' },
];

export function JsonNode({ id, data }: CustomNodeProps) {
  const { updateNodeState } = useNodeContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { mode: event.target.value });
  };

  return (
    <div className={`p-4 border rounded-md bg-white shadow-lg w-64 ${data.hasError ? 'border-red-500' : ''}`}>
      <Handle type="target" position={Position.Left} id="input" className="!bg-green-500" />
      <label className="font-bold text-sm">{data.definition.name}</label>
      <div className="mt-2 text-sm grid grid-cols-2 gap-1">
        {modes.map(m => (
          <div key={m.id} className="flex items-center gap-2">
            <input type="radio" id={`${id}-${m.id}`} name={`mode-${id}`} value={m.id} checked={data.internalState.mode === m.id} onChange={handleModeChange} />
            <label htmlFor={`${id}-${m.id}`}>{m.label}</label>
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Right} id="output" className="!bg-blue-500" />
    </div>
  );
}
