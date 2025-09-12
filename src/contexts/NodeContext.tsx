
import { createContext, useContext } from 'react';

interface NodeContextType {
  updateNodeState: (nodeId: string, newInternalState: Record<string, unknown>) => void;
}

export const NodeContext = createContext<NodeContextType | undefined>(undefined);

export function useNodeContext() {
  const context = useContext(NodeContext);
  if (!context) {
    throw new Error('useNodeContext must be used within a NodeProvider');
  }
  return context;
}
