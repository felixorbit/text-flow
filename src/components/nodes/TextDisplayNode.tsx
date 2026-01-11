import { BaseNode } from './BaseNode';
import type { CustomNodeProps } from './types';

export function TextDisplayNode(props: CustomNodeProps) {
  const { data } = props;
  const displayValue = data.incomingValue;

  return (
    <BaseNode {...props}>
      <div className="w-full p-3 bg-muted/50 border rounded-md text-sm font-mono whitespace-pre-wrap break-all min-h-[60px] max-h-[300px] overflow-y-auto">
        {displayValue === undefined ? (
          <span className="text-muted-foreground italic">Waiting for input...</span>
        ) : (
          String(displayValue)
        )}
      </div>
    </BaseNode>
  );
}