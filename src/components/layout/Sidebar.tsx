import { nodeDefinitions } from '@/lib/nodes';

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="border-r bg-slate-50/50 backdrop-blur-sm p-3 text-sm w-60 flex flex-col gap-4 overflow-y-auto z-40">
      <div>
        <h2 className="text-[10px] font-bold mb-3 text-muted-foreground uppercase tracking-widest px-1">Nodes</h2>
        <div className="grid gap-1.5">
          {Object.values(nodeDefinitions).map((nodeDef) => {
            const Icon = nodeDef.icon;
            return (
              <div
                key={nodeDef.type}
                className="flex items-center gap-2.5 p-2 border rounded-lg cursor-grab bg-card shadow-sm hover:shadow-md hover:border-primary/50 hover:ring-1 hover:ring-primary/10 transition-all duration-200 group select-none"
                onDragStart={(event) => onDragStart(event, nodeDef.type)}
                draggable
              >
                <div className="p-1.5 rounded-md bg-muted/50 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-medium text-xs text-foreground leading-none">{nodeDef.name}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-auto p-3 bg-secondary/30 rounded-lg border border-secondary text-secondary-foreground">
        <h3 className="text-xs font-semibold mb-1">Guide</h3>
        <p className="text-[10px] text-muted-foreground leading-tight">
           Drag nodes to canvas and connect ports.
        </p>
      </div>
    </aside>
  );
}