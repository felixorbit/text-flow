
import { Handle, Position } from 'reactflow';
import type { CustomNodeProps } from './types';

export function TextDisplayNode({ data }: CustomNodeProps) {
  const displayValue = data.internalState.inputValue;

  return (
    <div className={`p-4 border rounded-md bg-white shadow-lg w-64 ${data.hasError ? 'border-red-500' : ''}`}>
      <Handle
        type="target"
        position={Position.Left}
        id={data.definition.inputs[0].id}
        className="!bg-green-500"
      />
      <label className="font-bold text-sm">{data.definition.name}</label>
      <pre className="w-full mt-2 p-2 border rounded-md bg-gray-50 text-sm font-mono whitespace-pre-wrap break-all">
        {String(displayValue === undefined ? 'Waiting for input...' : displayValue)}
      </pre>
    </div>
  );
}
