
import { nodeDefinitions } from '@/lib/nodes';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="border-r bg-gray-50 p-4 text-sm w-64">
      <h2 className="text-lg font-bold mb-4">Nodes</h2>
      <div className="space-y-2">
        {Object.values(nodeDefinitions).map((nodeDef) => (
          <div
            key={nodeDef.type}
            className="p-3 border rounded-md cursor-grab bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            onDragStart={(event) => onDragStart(event, nodeDef.type)}
            draggable
          >
            {nodeDef.name}
          </div>
        ))}
      </div>
    </aside>
  );
}
