import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

const modes = [
    { id: 'format', label: 'Format' },
    { id: 'compress', label: 'Compress' },
    { id: 'escape', label: 'Escape' },
    { id: 'unescape', label: 'Unescape' },
];

export function JsonNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeState } = useNodeContext();

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeState(id, { mode: event.target.value });
  };

  return (
    <BaseNode {...props}>
      <div className="space-y-3">
        <label className="text-xs font-medium text-muted-foreground uppercase">Operation</label>
        <div className="grid grid-cols-2 gap-2">
            {modes.map(m => (
            <label key={m.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-primary transition-colors p-1 rounded hover:bg-muted/50">
                <input 
                type="radio" 
                name={`mode-${id}`} 
                value={m.id} 
                checked={data.internalState.mode === m.id} 
                onChange={handleModeChange}
                className="accent-primary w-4 h-4" 
                />
                {m.label}
            </label>
            ))}
        </div>
      </div>
    </BaseNode>
  );
}