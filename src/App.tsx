import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';
import type {
  NodeChange,
  EdgeChange,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { nanoid } from 'nanoid';
import { produce } from 'immer';
import { Trash2, BoxSelect } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { nodeDefinitions } from '@/lib/nodes';
import type { CustomNode, NodeDefinition } from '@/lib/nodes';
import { TextInputNode } from '@/components/nodes/TextInputNode';
import { TextDisplayNode } from '@/components/nodes/TextDisplayNode';
import { Base64Node } from '@/components/nodes/Base64Node';
import { HashNode } from '@/components/nodes/HashNode';
import { JsonNode } from '@/components/nodes/JsonNode';
import { RegexNode } from '@/components/nodes/RegexNode';
import { CryptoNode } from '@/components/nodes/CryptoNode';
import { NodeContext } from '@/contexts/NodeContext';

const FlowWithLogic = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<CustomNode[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { project } = useReactFlow();

  const nodeTypes = useMemo(() => ({
    textInput: TextInputNode,
    textDisplay: TextDisplayNode,
    base64: Base64Node,
    hash: HashNode,
    json: JsonNode,
    regex: RegexNode,
    crypto: CryptoNode,
  }), []);

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect = useCallback((connection: Connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);

  const onDelete = useCallback(() => {
    const selectedNodes = nodes.filter(n => n.selected).map(n => n.id);
    const selectedEdges = edges.filter(e => e.selected).map(e => e.id);
    setNodes(nds => nds.filter(n => !selectedNodes.includes(n.id)));
    setEdges(eds => eds.filter(e => !selectedEdges.includes(e.id)));
  }, [nodes, edges, setNodes, setEdges]);

  useEffect(() => {
    const handleDeleteEvent = () => onDelete();
    document.addEventListener('delete-selected', handleDeleteEvent);
    return () => document.removeEventListener('delete-selected', handleDeleteEvent);
  }, [onDelete]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;

    const position = project({
      x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
      y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
    });

    const definition = nodeDefinitions[type] as NodeDefinition;
    const newNode: CustomNode = {
      id: nanoid(),
      type,
      position,
      data: {
        definition,
        outputValues: {},
        internalState: { ...(definition.initialState || {}) },
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [project]);

  const updateNodeState = useCallback((nodeId: string, newInternalState: Record<string, unknown>) => {
    setNodes(produce(draft => {
      const node = draft.find(n => n.id === nodeId);
      if (node) {
        node.data.internalState = { ...node.data.internalState, ...newInternalState };
      }
    }));
  }, []);

  useEffect(() => {
    const nodeMap = new Map(nodes.map(node => [node.id, node]));
    if (nodeMap.size !== nodes.length) return;

    const inDegree = new Map(nodes.map(node => [node.id, 0]));
    for (const edge of edges) {
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    }

    const queue = nodes.filter(node => inDegree.get(node.id) === 0);
    const sortedNodes: CustomNode[] = [];
    while (queue.length > 0) {
      const u = queue.shift()!;
      sortedNodes.push(u);
      for (const edge of edges.filter(e => e.source === u.id)) {
        const vId = edge.target;
        inDegree.set(vId, (inDegree.get(vId) || 1) - 1);
        if (inDegree.get(vId) === 0) {
          const vNode = nodeMap.get(vId);
          if (vNode) queue.push(vNode);
        }
      }
    }

    const newNodes = produce(nodes, draft => {
      const draftMap = new Map(draft.map(n => [n.id, n]));
      for (const node of sortedNodes) {
        const draftNode = draftMap.get(node.id)!;
        const incomingEdges = edges.filter(e => e.target === node.id);
        const inputs = incomingEdges.map(edge => {
          const sourceNode = draftMap.get(edge.source)!;
          const sourceHandle = edge.sourceHandle || 'output';
          return sourceNode?.data.outputValues[sourceHandle];
        });

        const inputsChanged = JSON.stringify(inputs) !== JSON.stringify(draftNode.data.lastInputs);
        const stateChanged = JSON.stringify(draftNode.data.internalState) !== JSON.stringify(draftNode.data.lastInternalState);

        if (inputsChanged || stateChanged) {
            try {
              const outputs = draftNode.data.definition.processor(inputs, draftNode.data.internalState);
              draftNode.data.hasError = false;
              draftNode.data.definition.outputs.forEach((port, i) => {
                draftNode.data.outputValues[port.id] = outputs[i];
              });
            } catch (error) {
                console.error('Processing error in node', draftNode.id, error);
                draftNode.data.hasError = true;
            }
            
            draftNode.data.lastInputs = inputs;
            // Store a snapshot of the state
            draftNode.data.lastInternalState = JSON.parse(JSON.stringify(draftNode.data.internalState));
        }

        if (draftNode.type === 'textDisplay') {
          draftNode.data.incomingValue = inputs[0];
        }
      }
    });

    if (JSON.stringify(newNodes) !== JSON.stringify(nodes)) {
        setNodes(newNodes);
    }

  }, [JSON.stringify(nodes.map(n => n.data.internalState)), edges, nodes.length]);

  return (
    <NodeContext.Provider value={{ updateNodeState }}>
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          deleteKeyCode={['Backspace', 'Delete']}
          fitView
          className="bg-slate-50/50"
          proOptions={{ hideAttribution: true }}
        >
          <Controls className="bg-white border-2 border-border shadow-md rounded-lg overflow-hidden" />
          <Background color="#cbd5e1" gap={20} size={1} variant={BackgroundVariant.Dots} />
        </ReactFlow>
      </div>
    </NodeContext.Provider>
  );
};

function App() {
  return (
    <div className="h-screen w-screen flex flex-col bg-background text-foreground overflow-hidden font-sans">
      <header className="px-5 py-3 border-b bg-background/95 backdrop-blur-md flex justify-between items-center shadow-sm z-50 supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-sm">
             <BoxSelect className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">Text Flow</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mt-0.5">Workflow Editor</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                System Ready
            </div>
            <Button 
                variant="destructive" 
                size="sm" 
                onClick={() => document.dispatchEvent(new Event('delete-selected'))}
                className="gap-2 shadow-sm"
            >
                <Trash2 className="w-4 h-4" />
                Delete Selected
            </Button>
        </div>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <ReactFlowProvider>
          <Sidebar />
          <FlowWithLogic />
        </ReactFlowProvider>
      </main>
    </div>
  );
}

export default App;