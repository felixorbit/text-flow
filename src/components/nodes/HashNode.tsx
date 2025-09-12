
import { Handle, Position } from 'reactflow';
import { useNodeContext } from '@/contexts/NodeContext';
import type { CustomNodeProps } from './types';

const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];

export function HashNode({ id, data }: CustomNodeProps) {
  const { updateNodeState } = useNodeContext();

  const handleAlgoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeState(id, { algorithm: event.target.value });
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
      <div className="mt-2">
        <label htmlFor={`algo-${id}`} className="text-sm">Algorithm</label>
        <select 
          id={`algo-${id}`}
          className="w-full mt-1 p-2 border rounded-md text-sm focus:outline-blue-500"
          value={data.internalState.algorithm as string}
          onChange={handleAlgoChange}
        >
          {algorithms.map(algo => <option key={algo} value={algo}>{algo}</option>)}
        </select>
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
