import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

const algorithms = ['MD5', 'SHA1', 'SHA256', 'SHA512'];

export function HashNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeState } = useNodeContext();

  const handleAlgoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeState(id, { algorithm: event.target.value });
  };

  return (
    <BaseNode {...props}>
      <div className="space-y-2">
        <label htmlFor={`algo-${id}`} className="text-xs font-medium text-muted-foreground uppercase">Algorithm</label>
        <div className="relative">
            <select 
            id={`algo-${id}`}
            className="w-full p-2 bg-background border rounded-md text-sm appearance-none focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
            value={data.internalState.algorithm as string}
            onChange={handleAlgoChange}
            >
            {algorithms.map(algo => <option key={algo} value={algo}>{algo}</option>)}
            </select>
            {/* Custom arrow could go here if we hide default appearance */}
        </div>
      </div>
    </BaseNode>
  );
}