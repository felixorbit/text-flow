
import { Handle, Position } from 'reactflow';
import { useNodeContext } from '@/contexts/NodeContext';
import type { CustomNodeProps } from './types';

export function Base64Node({ id, data }: CustomNodeProps) {
  const { updateNodeState } = useNodeContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { mode: event.target.value });
  };

  return (
    <div className={`p-4 border rounded-md bg-white shadow-lg w-64 ${data.hasError ? 'border-red-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id={data.definition.inputs[0].id}
        className="!bg-green-500"
      />
      <label className="font-bold text-sm">{data.definition.name}</label>
      <div className="mt-2 text-sm space-y-1">
        <div className="flex items-center gap-2">
          <input type="radio" id={`${id}-encode`} name={`mode-${id}`} value="encode" checked={data.internalState.mode === 'encode'} onChange={handleModeChange} />
          <label htmlFor={`${id}-encode`}>Encode</label>
        </div>
        <div className="flex items-center gap-2">
          <input type="radio" id={`${id}-decode`} name={`mode-${id}`} value="decode" checked={data.internalState.mode === 'decode'} onChange={handleModeChange} />
          <label htmlFor={`${id}-decode`}>Decode</label>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id={data.definition.outputs[0].id}
        className="!bg-blue-500"
      />
    </div>
  );
}
