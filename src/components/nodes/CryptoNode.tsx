
import { Handle, Position } from 'reactflow';
import { useNodeContext } from '@/contexts/NodeContext';
import type { CustomNodeProps } from './types';

export function CryptoNode({ id, data }: CustomNodeProps) {
  const { updateNodeState } = useNodeContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { mode: event.target.value });
  };

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { key: event.target.value });
  };

  return (
    <div className={`p-4 border rounded-md bg-white shadow-lg w-72 ${data.hasError ? 'border-red-500' : ''}`}>
      <Handle type="target" position={Position.Left} id="input" className="!bg-green-500" />
      <label className="font-bold text-sm">{data.definition.name} (AES)</label>
      
      <div className="mt-2 space-y-2">
        <div className="text-sm grid grid-cols-2 gap-1">
            <div className="flex items-center gap-2">
                <input type="radio" id={`${id}-encrypt`} name={`mode-${id}`} value="encrypt" checked={data.internalState.mode === 'encrypt'} onChange={handleModeChange} />
                <label htmlFor={`${id}-encrypt`}>Encrypt</label>
            </div>
            <div className="flex items-center gap-2">
                <input type="radio" id={`${id}-decrypt`} name={`mode-${id}`} value="decrypt" checked={data.internalState.mode === 'decrypt'} onChange={handleModeChange} />
                <label htmlFor={`${id}-decrypt`}>Decrypt</label>
            </div>
        </div>
        <div>
          <label htmlFor={`key-${id}`} className="text-xs font-medium">Secret Key</label>
          <input
            type="password"
            id={`key-${id}`}
            className="w-full mt-1 p-1 border rounded-md text-sm font-mono focus:outline-blue-500"
            value={data.internalState.key as string}
            onChange={handleKeyChange}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Right} id="output" className="!bg-blue-500" />
    </div>
  );
}
