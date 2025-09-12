
import { Handle, Position } from 'reactflow';
import { useNodeContext } from '@/contexts/NodeContext';
import type { CustomNodeProps } from './types';

export function TextInputNode({ id, data }: CustomNodeProps) {
  const { updateNodeState } = useNodeContext();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeState(id, { text: event.target.value });
  };

  return (
    <div className={`p-4 border rounded-md bg-white shadow-lg w-64 ${data.hasError ? 'border-red-500' : ''}`}>
      <label className="font-bold text-sm">{data.definition.name}</label>
      <textarea
        className="w-full mt-2 p-2 border rounded-md text-sm font-mono focus:outline-blue-500"
        rows={5}
        value={data.internalState.text as string}
        onChange={handleChange}
      />
      <Handle
        type="source"
        position={Position.Right}
        id={data.definition.outputs[0].id}
        className="!bg-blue-500"
      />
    </div>
  );
}
