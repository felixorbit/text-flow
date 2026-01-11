import React from 'react';
import { Handle, Position } from 'reactflow';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { XCircle } from 'lucide-react';
import type { CustomNodeData } from '@/lib/nodes';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BaseNodeProps {
  id: string;
  data: CustomNodeData;
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
}

export function BaseNode({ data, selected, children, className }: BaseNodeProps) {
  const Icon = data.definition.icon;

  return (
    <div
      className={cn(
        "bg-card border rounded-xl shadow-sm min-w-[280px] transition-all duration-200 group",
        selected ? "border-primary ring-1 ring-primary shadow-md" : "border-border",
        data.hasError && "border-destructive ring-destructive/20",
        className
      )}
    >
      {/* Handles - Inputs */}
      <div className="absolute -left-[7px] top-0 bottom-0 flex flex-col justify-center gap-3 py-4 pointer-events-none">
        {data.definition.inputs.map((input) => (
           <div key={input.id} className="relative w-3.5 h-3.5 pointer-events-auto flex items-center group/handle">
              <Handle
                type="target"
                position={Position.Left}
                id={input.id}
                className={cn(
                  "!w-3.5 !h-3.5 !bg-primary !border-2 !border-background !shadow-sm transition-all duration-200",
                  "hover:!scale-125 hover:!bg-primary/90",
                  "!relative !left-0 !transform-none"
                )}
              />
              <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-bold uppercase tracking-wider rounded shadow-md border opacity-0 group-hover/handle:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {input.name}
              </div>
           </div>
        ))}
      </div>

       {/* Handles - Outputs */}
      <div className="absolute -right-[7px] top-0 bottom-0 flex flex-col justify-center gap-3 py-4 pointer-events-none">
        {data.definition.outputs.map((output) => (
           <div key={output.id} className="relative w-3.5 h-3.5 pointer-events-auto flex items-center justify-end group/handle">
              <Handle
                type="source"
                position={Position.Right}
                id={output.id}
                 className={cn(
                  "!w-3.5 !h-3.5 !bg-primary !border-2 !border-background !shadow-sm transition-all duration-200",
                  "hover:!scale-125 hover:!bg-primary/90",
                  "!relative !right-0 !transform-none"
                )}
              />
              <div className="absolute right-full mr-2 px-2 py-1 bg-popover text-popover-foreground text-[10px] font-bold uppercase tracking-wider rounded shadow-md border opacity-0 group-hover/handle:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {output.name}
              </div>
           </div>
        ))}
      </div>


      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b bg-gradient-to-br from-white to-muted/50 rounded-t-xl">
        <div className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-sm">
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-grow">
          <h3 className="font-semibold text-sm text-foreground">{data.definition.name}</h3>
        </div>
        {data.hasError && (
            <XCircle className="w-5 h-5 text-destructive" />
        )}
      </div>

      {/* Content */}
      <div className="p-4 bg-card rounded-b-xl">
        {children}
      </div>
    </div>
  );
}