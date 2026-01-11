import { useNodeContext } from '@/contexts/NodeContext';
import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function TextInputNode(props: CustomNodeProps) {
  const { id, data } = props;
  const { updateNodeState } = useNodeContext();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeState(id, { text: event.target.value });
  };

  return (
    <BaseNode {...props}>
      <textarea
        className="w-full p-2 text-sm font-mono bg-background border rounded-md focus:outline-none focus:ring-1 focus:ring-ring min-h-[100px] resize-y"
        placeholder="Enter text..."
        value={(data.internalState.text as string) || ''}
        onChange={handleChange}
      />
    </BaseNode>
  );
}