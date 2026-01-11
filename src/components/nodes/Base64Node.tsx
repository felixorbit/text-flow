import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function Base64Node(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeState } = useNodeContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { mode: event.target.value });
  };

  const mode = (data.internalState.mode as string) || 'encode';

  return (
    <BaseNode {...props}>
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-muted-foreground uppercase">Operation Mode</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name={`mode-${id}`} 
              value="encode" 
              checked={mode === 'encode'} 
              onChange={handleModeChange}
              className="accent-primary w-4 h-4"
            />
            Encode
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors">
            <input 
              type="radio" 
              name={`mode-${id}`} 
              value="decode" 
              checked={mode === 'decode'} 
              onChange={handleModeChange}
               className="accent-primary w-4 h-4"
            />
            Decode
          </label>
        </div>
      </div>
    </BaseNode>
  );
}
