import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function CryptoNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeState } = useNodeContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { mode: event.target.value });
  };

  const handleKeyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { key: event.target.value });
  };

  const mode = data.internalState.mode;

  return (
    <BaseNode {...props}>
      <div className="space-y-4">
        <div>
            <label className="text-xs font-medium text-muted-foreground uppercase block mb-2">Operation</label>
            <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                    <input type="radio" name={`mode-${id}`} value="encrypt" checked={mode === 'encrypt'} onChange={handleModeChange} className="accent-primary w-4 h-4" />
                    Encrypt
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
                    <input type="radio" name={`mode-${id}`} value="decrypt" checked={mode === 'decrypt'} onChange={handleModeChange} className="accent-primary w-4 h-4" />
                    Decrypt
                </label>
            </div>
        </div>
        <div>
          <label htmlFor={`key-${id}`} className="text-xs font-medium text-muted-foreground uppercase block mb-1">Secret Key</label>
          <input
            type="password"
            id={`key-${id}`}
            className="w-full p-2 bg-background border rounded-md text-sm font-mono focus:outline-none focus:ring-1 focus:ring-ring"
            value={data.internalState.key as string}
            onChange={handleKeyChange}
            placeholder="Enter key..."
          />
        </div>
      </div>
    </BaseNode>
  );
}